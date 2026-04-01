import type { Metadata } from 'next';
import { VisionContent } from './client';

export const metadata: Metadata = {
  title: 'Vizyon — NetTapu',
  description:
    'NetTapu vizyonu — 2030 yılına kadar Türkiye gayrimenkul sektöründe dijital dönüşümün öncüsü olmak.',
  openGraph: {
    title: 'Vizyonumuz 2030 — NetTapu',
    description: 'Dijital dönüşüm, küresel erişim, toplumsal fayda.',
  },
};

export default function VisionPage() {
  return <VisionContent />;
}
