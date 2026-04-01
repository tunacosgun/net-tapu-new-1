import type { Metadata } from 'next';
import { RealEstateGuideContent } from './client';

export const metadata: Metadata = {
  title: 'Gayrimenkul Rehberi — NetTapu',
  description: 'Arsa, tapu ve gayrimenkul yatırımları hakkında kapsamlı rehber.',
};

export default function RealEstateGuidePage() {
  return <RealEstateGuideContent />;
}
