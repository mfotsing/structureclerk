import { Metadata } from 'next';
import FeaturesPage from '../../(marketing)/[lang]/features/page';

export const metadata: Metadata = {
  title: 'Fonctionnalités - StructureClerk | Gestion de Documents IA',
  description: 'Découvrez les fonctionnalités StructureClerk : Traitement intelligent de documents, transcription audio, automatisation d\'affaires, collaboration d\'équipe, et plus.',
};

export default function FeaturesPageFr() {
  return <FeaturesPage />;
}