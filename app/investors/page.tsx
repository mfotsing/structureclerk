import InvestorLandingPage from '@/components/landing/InvestorLandingPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StructureClerk - Canada\'s Next AI Unicorn | Investor Portal',
  description: 'Invest in Canada\'s premier AI-powered business administration platform. $324M TAM, 85% gross margins, and a clear path to unicorn status. PIPEDA compliant, bilingual EN/FR, built for global scale.',
  keywords: [
    'Canadian unicorn',
    'AI SaaS investment',
    'StructureClerk funding',
    'Canadian tech startup',
    'PIPEDA compliance',
    'Business automation AI',
    'SaaS investment opportunity',
    'Canadian startup funding',
    'AI document processing',
    'Business administration software'
  ],
  openGraph: {
    title: 'StructureClerk - Canada\'s Next AI Unicorn',
    description: 'Invest in the future of Canadian business administration. $324M market opportunity with proprietary AI technology.',
    type: 'website',
    locale: 'en_CA',
    url: 'https://structureclerk.com/investors'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StructureClerk - Canada\'s Next AI Unicorn',
    description: 'Invest in Canadian AI innovation. PIPEDA compliant, bilingual, built for global scale.',
    creator: '@structureclerk'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://structureclerk.com/investors',
    languages: {
      'en-CA': '/en/investors',
      'fr-CA': '/fr/investors'
    }
  }
};

export default function InvestorsPage() {
  return <InvestorLandingPage />;
}