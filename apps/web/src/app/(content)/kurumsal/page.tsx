import type { Metadata } from 'next';
import { KurumsalContent } from './client';

export const metadata: Metadata = {
  title: 'Kurumsal — NetTapu',
  description: 'NetTapu kurumsal bilgiler, şirket hakkında ve kurumsal iletişim.',
};

export default function KurumsalPage() {
  return <KurumsalContent />;
}
