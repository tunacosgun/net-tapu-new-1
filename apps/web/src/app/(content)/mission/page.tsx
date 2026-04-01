import type { Metadata } from 'next';
import { MissionContent } from './client';

export const metadata: Metadata = {
  title: 'Misyon — NetTapu',
  description: 'NetTapu misyonu — güvenli, şeffaf, erişilebilir gayrimenkul.',
  openGraph: {
    title: 'Misyon — NetTapu',
    description: 'Gayrimenkul alım-satımını herkes için güvenli, şeffaf ve erişilebilir kılmak.',
  },
};

export default function MissionPage() {
  return <MissionContent />;
}
