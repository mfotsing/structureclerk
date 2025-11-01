import { Metadata } from 'next';
import MobileLandingPage from '../(marketing)/[lang]/MobileLandingPage';

export const metadata: Metadata = {
  title: 'StructureClerk - AI-Powered Document Management for Canadian Businesses',
  description: 'Transform your business documents with AI. Built for Canadian entrepreneurs with bilingual support and PIPEDA compliance.',
};

export default function HomePage() {
  return <MobileLandingPage />;
}