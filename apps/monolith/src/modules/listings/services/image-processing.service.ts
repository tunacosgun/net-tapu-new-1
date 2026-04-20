import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { ParcelImage } from '../entities/parcel-image.entity';

const WATERMARK_OPACITY = 0.35;
const THUMBNAIL_WIDTH = 400;
const FULL_SIZE_MAX_WIDTH = 1600;

/** Side padding (white bars) — disabled, no side bars */
const SIDE_PADDING_RATIO = 0; // no side padding

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name);
  private readonly uploadsDir: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(ParcelImage)
    private readonly imageRepo: Repository<ParcelImage>,
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.uploadsDir = this.config.get<string>('UPLOADS_DIR') || path.join(process.cwd(), 'uploads');
    this.baseUrl = this.config.get<string>('UPLOADS_BASE_URL') || '/uploads';
  }

  async processImage(imageId: string): Promise<ParcelImage> {
    const image = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!image) throw new Error(`Image ${imageId} not found`);

    try {
      image.status = 'processing';
      await this.imageRepo.save(image);

      const parcelDir = path.join(this.uploadsDir, 'parcels', image.parcelId);
      await fs.mkdir(parcelDir, { recursive: true });

      const imageBuffer = await this.downloadImage(image.originalUrl);

      const hash = crypto.createHash('md5').update(imageId).digest('hex').slice(0, 8);
      const ext = this.getExtension(image.mimeType || 'image/jpeg');

      // Fetch listing ID for parcel number overlay
      const listingId = await this.getListingId(image.parcelId);

      // Watermarked version (with side padding + parcel no + diagonal text)
      const watermarkedFilename = `${hash}-watermarked.jpg`;
      const watermarkedPath = path.join(parcelDir, watermarkedFilename);
      await this.applyWatermark(imageBuffer, watermarkedPath, listingId);

      // Thumbnail (no watermark, no padding)
      const thumbnailFilename = `${hash}-thumb${ext}`;
      const thumbnailPath = path.join(parcelDir, thumbnailFilename);
      await this.generateThumbnail(imageBuffer, thumbnailPath);

      const relativeDir = `parcels/${image.parcelId}`;
      image.watermarkedUrl = `${this.baseUrl}/${relativeDir}/${watermarkedFilename}`;
      image.thumbnailUrl = `${this.baseUrl}/${relativeDir}/${thumbnailFilename}`;
      image.status = 'ready';

      const saved = await this.imageRepo.save(image);
      this.logger.log(`Image ${imageId} processed successfully`);
      return saved;
    } catch (err) {
      image.status = 'failed';
      await this.imageRepo.save(image);
      this.logger.error(`Image ${imageId} processing failed: ${(err as Error).message}`);
      throw err;
    }
  }

  private async getListingId(parcelId: string): Promise<string | null> {
    try {
      const rows = await this.dataSource.query(
        `SELECT listing_id FROM listings.parcels WHERE id = $1`,
        [parcelId],
      );
      return rows?.[0]?.listing_id ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Apply watermark:
   *  1. Add white side padding bars (left + right)
   *  2. Render "#listingId" in top-left of the left padding bar
   *  3. Tile diagonal "NetTapu" text (or logo) over the full canvas
   */
  private async applyWatermark(
    buffer: Buffer,
    outputPath: string,
    listingId: string | null,
  ): Promise<void> {
    const meta = await sharp(buffer).metadata();
    const srcW = Math.min(meta.width || FULL_SIZE_MAX_WIDTH, FULL_SIZE_MAX_WIDTH);
    const srcH = meta.height
      ? Math.round((srcW / (meta.width || srcW)) * meta.height)
      : Math.round(srcW * 0.75);

    // --- resize original to srcW x srcH ---
    const resizedBuf = await sharp(buffer)
      .resize(srcW, srcH, { fit: 'inside', withoutEnlargement: true })
      .toFormat('png')
      .toBuffer();

    const padW = Math.round(srcW * SIDE_PADDING_RATIO); // width of each white bar
    const totalW = srcW + padW * 2;
    const totalH = srcH;

    // Build white canvas
    const canvas = await sharp({
      create: { width: totalW, height: totalH, channels: 3, background: { r: 255, g: 255, b: 255 } },
    }).png().toBuffer();

    // Composite: place resized image in centre
    const compositeOps: sharp.OverlayOptions[] = [
      { input: resizedBuf, left: padW, top: 0 },
    ];

    // --- Diagonal watermark over entire canvas ---
    const logoBuffer = await this.getWatermarkLogo();
    let wmInput: Buffer;
    if (logoBuffer) {
      wmInput = await this.createLogoWatermark(logoBuffer, totalW, totalH);
    } else {
      wmInput = Buffer.from(this.createTextWatermarkSvg(totalW, totalH));
    }
    compositeOps.push({ input: wmInput, left: 0, top: 0 });

    await sharp(canvas)
      .composite(compositeOps)
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(outputPath);
  }

  /**
   * Build an SVG that renders the parcel number vertically centred
   * in the left padding strip, rotated 90° (reads bottom-to-top).
   */
  private buildParcelLabelSvg(padW: number, imgH: number, listingId: string): string {
    const fontSize = Math.max(11, Math.round(padW * 0.28));
    const label = `#${listingId}`;
    // Rotate text -90deg around the centre of the left padding strip
    const cx = Math.round(padW / 2);
    const cy = Math.round(imgH / 2);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${padW}" height="${imgH}">
      <text
        x="${cx}" y="${cy}"
        font-family="DejaVu Sans Mono, Courier New, monospace"
        font-size="${fontSize}"
        font-weight="bold"
        fill="#1a1a1a"
        text-anchor="middle"
        dominant-baseline="middle"
        transform="rotate(-90, ${cx}, ${cy})"
        opacity="0.85"
      >${label}</text>
    </svg>`;
  }

  private async getWatermarkLogo(): Promise<Buffer | null> {
    try {
      const result = await this.dataSource.query(
        `SELECT value FROM admin.system_settings WHERE key = 'watermark_logo'`,
      );
      if (!result?.[0]?.value) return null;

      let logoUrl: string = result[0].value;
      if (typeof logoUrl !== 'string') logoUrl = String(logoUrl);
      logoUrl = logoUrl.replace(/^"|"$/g, '').trim();
      if (!logoUrl || logoUrl === 'null' || logoUrl.length < 5) return null;

      this.logger.log(`Loading watermark logo from: ${logoUrl}`);
      return this.downloadImage(logoUrl);
    } catch (err) {
      this.logger.warn(`Failed to load watermark logo: ${(err as Error).message}`);
      return null;
    }
  }

  private async createLogoWatermark(
    logoBuffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    const logoSize = Math.max(60, Math.round(width * 0.09));
    const resizedLogo = await sharp(logoBuffer)
      .resize(logoSize, logoSize, { fit: 'inside', withoutEnlargement: true })
      .ensureAlpha()
      .png()
      .toBuffer();

    const logoMeta = await sharp(resizedLogo).metadata();
    const lw = logoMeta.width || logoSize;
    const lh = logoMeta.height || logoSize;

    const alphaMask = await sharp({
      create: { width: lw, height: lh, channels: 4, background: { r: 255, g: 255, b: 255, alpha: WATERMARK_OPACITY } },
    }).png().toBuffer();

    const semiTransparentLogo = await sharp(resizedLogo)
      .composite([{ input: alphaMask, blend: 'dest-in' }])
      .png()
      .toBuffer();

    const spacingX = Math.round(lw * 2.5);
    const spacingY = Math.round(lh * 2.5);
    const compositeOps: { input: Buffer; left: number; top: number }[] = [];

    for (let y = spacingY / 2; y < height; y += spacingY) {
      for (let x = spacingX / 2; x < width; x += spacingX) {
        const left = Math.round(x - lw / 2);
        const top = Math.round(y - lh / 2);
        if (left >= 0 && top >= 0 && left + lw <= width && top + lh <= height) {
          compositeOps.push({ input: semiTransparentLogo, left, top });
        }
      }
    }

    if (compositeOps.length === 0) {
      compositeOps.push({
        input: semiTransparentLogo,
        left: Math.round((width - lw) / 2),
        top: Math.round((height - lh) / 2),
      });
    }

    return sharp({
      create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite(compositeOps.slice(0, 50))
      .png()
      .toBuffer();
  }

  /**
   * Diagonal tiled "NetTapu" text over full canvas.
   * Text is skewed/slanted — rotate(-35) for a bold watermark feel.
   */
  private createTextWatermarkSvg(width: number, height: number): string {
    const opacity = WATERMARK_OPACITY;
    const fontSize = Math.max(20, Math.round(width * 0.038));
    const spacing = Math.round(fontSize * 5.5);

    let textElements = '';
    for (let y = -spacing; y < height + spacing * 2; y += spacing) {
      for (let x = -spacing; x < width + spacing * 2; x += spacing) {
        textElements += `<text x="${x}" y="${y}" transform="rotate(-35, ${x}, ${y})" font-family="DejaVu Sans, Liberation Sans, Arial, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#222222" fill-opacity="${opacity}" letter-spacing="2">NetTapu</text>`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${textElements}</svg>`;
  }

  private async generateThumbnail(buffer: Buffer, outputPath: string): Promise<void> {
    await sharp(buffer)
      .resize(THUMBNAIL_WIDTH, undefined, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(outputPath);
  }

  private async downloadImage(url: string): Promise<Buffer> {
    if (url.startsWith('/uploads/')) {
      const relativePath = url.replace('/uploads/', '');
      const filePath = path.join(this.uploadsDir, relativePath);
      return fs.readFile(filePath);
    }

    if (url.startsWith('/') || url.startsWith('file://')) {
      const filePath = url.replace('file://', '');
      return fs.readFile(filePath);
    }

    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  private getExtension(mimeType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };
    return map[mimeType.toLowerCase()] || '.jpg';
  }
}
