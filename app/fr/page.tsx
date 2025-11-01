import { Metadata } from 'next';
import MobileLandingPage from '../(marketing)/[lang]/MobileLandingPage';

export const metadata: Metadata = {
  title: 'StructureClerk - Gestion de Documents IA pour Entreprises Canadiennes',
  description: 'Transformez vos documents d\'affaires avec l\'IA. Conçu pour les entrepreneurs canadiens avec support bilingue et conformité PIPEDA.',
};

export default function HomePage() {
  return <MobileLandingPage />;
}