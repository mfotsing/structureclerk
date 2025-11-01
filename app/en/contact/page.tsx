import { Metadata } from 'next';
import ContactPage from '../../(marketing)/[lang]/contact/page';

export const metadata: Metadata = {
  title: 'Contact Us - StructureClerk | Get in Touch',
  description: 'Contact StructureClerk for support, sales inquiries, or partnerships. We\'re here to help Canadian businesses succeed.',
};

export default function ContactPageEn() {
  return <ContactPage />;
}