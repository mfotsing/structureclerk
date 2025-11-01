import { Metadata } from 'next';
import PricingPage from '../../(marketing)/[lang]/pricing/page';

export const metadata: Metadata = {
  title: 'Tarifs - StructureClerk | Prix Simples et Transparents pour Entreprises Canadiennes',
  description: 'Choisissez votre plan : Gratuit, Starter, Professionnel ou Business. Aucuns frais cachés. Annulez à tout moment.',
};

export default function PricingPageFr() {
  return <PricingPage />;
}