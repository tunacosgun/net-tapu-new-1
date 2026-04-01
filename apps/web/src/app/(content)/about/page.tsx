import type { Metadata } from 'next';
import { AboutPageContent } from './client';

export const metadata: Metadata = {
  title: 'Hakkımızda — NetTapu',
  description: "NetTapu hakkında - Türkiye'nin güvenilir gayrimenkul açık artırma platformu.",
  openGraph: {
    title: 'Hakkımızda — NetTapu',
    description: 'NetTapu hakkında bilgi edinin.',
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
