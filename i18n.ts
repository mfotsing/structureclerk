import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
const locales = ['en', 'fr'] as const
const defaultLocale = 'en' as const

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}))

export { locales, defaultLocale }