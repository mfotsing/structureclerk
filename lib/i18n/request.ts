import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // Default to English for now since middleware is disabled
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});