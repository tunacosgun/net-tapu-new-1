import type { Metadata } from 'next';
import { WithdrawalRightsContent } from './client';

export const metadata: Metadata = {
  title: 'Cayma Hakkı — NetTapu',
  description: 'NetTapu cayma hakkı bilgileri ve kullanım koşulları.',
};

export default function WithdrawalRightsPage() {
  return <WithdrawalRightsContent />;
}
