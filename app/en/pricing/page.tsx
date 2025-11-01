import { Metadata } from 'next';
import PricingPage from '../../(marketing)/[lang]/pricing/page';

export const metadata: Metadata = {
  title: 'Pricing - StructureClerk | Simple, Transparent Pricing for Canadian Businesses',
  description: 'Choose your plan: Free, Starter, Professional, or Business. No hidden fees. Cancel anytime.',
};

export default function PricingPageEn() {
  return <PricingPage />;
}