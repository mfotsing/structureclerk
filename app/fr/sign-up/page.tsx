import { Metadata } from 'next';
import SignUpPage from '../../(marketing)/[lang]/sign-up/page';

export const metadata: Metadata = {
  title: 'Inscription - StructureClerk | Commencez Votre Essai Gratuit',
  description: 'Créez votre compte StructureClerk et commencez à transformer vos documents d\'affaires avec l\'IA. Aucune carte de crédit requise.',
};

export default function SignUpPageFr() {
  return <SignUpPage />;
}