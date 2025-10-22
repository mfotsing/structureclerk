import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Default to 'fr' if locale is undefined
  const effectiveLocale = locale || 'fr';
  
  return {
    locale: effectiveLocale,
    messages: (await import(`./messages/${effectiveLocale}.json`)).default
  };
});