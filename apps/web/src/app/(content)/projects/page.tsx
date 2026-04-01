import type { Metadata } from 'next';
import { ProjectsContent } from './client';

export const metadata: Metadata = {
  title: 'Projelerimiz — NetTapu',
  description: 'NetTapu tamamlanan ve devam eden projeler.',
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
