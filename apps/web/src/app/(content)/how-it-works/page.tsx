import type { Metadata } from 'next';
import { HowItWorksContent } from './client';

export const metadata: Metadata = {
  title: 'Nasıl Çalışır — NetTapu',
  description: 'NetTapu platformunda arsa satın alma ve ihale süreçleri.',
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
