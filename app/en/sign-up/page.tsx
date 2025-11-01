import { Metadata } from 'next';
import SignUpPage from '../../(marketing)/[lang]/sign-up/page';

export const metadata: Metadata = {
  title: 'Sign Up - StructureClerk | Start Your Free Trial',
  description: 'Create your StructureClerk account and start transforming your business documents with AI. No credit card required.',
};

export default function SignUpPageEn() {
  return <SignUpPage />;
}