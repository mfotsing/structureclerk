import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Get the locale from the URL pathname
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  // Extract locale from URL - supports /en/* and /fr/* patterns
  const locale = pathname.startsWith('/fr') ? 'fr' : 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});