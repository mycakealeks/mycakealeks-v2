export const CURRENCY_CONFIG: Record<string, { code: string; symbol: string; locale: string }> = {
  tr: { code: 'TRY', symbol: '₺', locale: 'tr-TR' },
  ru: { code: 'RUB', symbol: '₽', locale: 'ru-RU' },
  en: { code: 'USD', symbol: '$', locale: 'en-US' },
}

export const EXCHANGE_RATES: Record<string, number> = {
  TRY: 1,
  RUB: 2.8,
  USD: 0.028,
}

export function formatPrice(amountTRY: number, locale: string): string {
  const config = CURRENCY_CONFIG[locale] ?? CURRENCY_CONFIG.tr
  const rate = EXCHANGE_RATES[config.code] ?? 1
  const converted = Math.round(amountTRY * rate)
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: 0,
  }).format(converted)
}

export function getCurrencyCode(locale: string): string {
  return (CURRENCY_CONFIG[locale] ?? CURRENCY_CONFIG.tr).code
}
