import type { Metadata } from 'next';
import { PressContent } from './client';

export const metadata: Metadata = {
  title: 'Basın — NetTapu',
  description: 'NetTapu hakkında basın haberleri ve medya kiti.',
};

export default function PressPage() {
  return <PressContent />;
}
