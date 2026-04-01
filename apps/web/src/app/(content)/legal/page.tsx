import type { Metadata } from 'next';
import { LegalContent } from './client';

export const metadata: Metadata = {
  title: 'Yasal Bilgiler — NetTapu',
  description: 'NetTapu yasal bilgiler, kullanım şartları ve gizlilik politikası.',
};

export default function LegalPage() {
  return <LegalContent />;
}
