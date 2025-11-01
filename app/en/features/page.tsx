import { Metadata } from 'next';
import FeaturesPage from '../../(marketing)/[lang]/features/page';

export const metadata: Metadata = {
  title: 'Features - StructureClerk | AI-Powered Document Management',
  description: 'Discover StructureClerk features: Smart document processing, audio transcription, business automation, team collaboration, and more.',
};

export default function FeaturesPageEn() {
  return <FeaturesPage />;
}