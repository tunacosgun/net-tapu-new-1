import type { Metadata } from 'next';
import { PostSaleContent } from './client';

export const metadata: Metadata = {
  title: 'Satış Sonrası — NetTapu',
  description: 'NetTapu satış sonrası destek süreçleri.',
};

export default function PostSalePage() {
  return <PostSaleContent />;
}
