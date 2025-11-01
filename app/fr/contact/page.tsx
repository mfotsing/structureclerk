import { Metadata } from 'next';
import ContactPage from '../../(marketing)/[lang]/contact/page';

export const metadata: Metadata = {
  title: 'Contactez-Nous - StructureClerk | Entrer en Contact',
  description: 'Contactez StructureClerk pour du support, des demandes de ventes, ou des partenariats. Nous sommes là pour aider les entreprises canadiennes à réussir.',
};

export default function ContactPageFr() {
  return <ContactPage />;
}