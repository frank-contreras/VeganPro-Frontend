import { emergencyEnglish, emergencySpanish, type Catalog, type MessageKey } from './messages'
import { es } from './catalogs/es'
import { en } from './catalogs/en'

export const localeRegistry = {
  es: { name: 'Español', catalog: es },
  en: { name: 'English', catalog: en },
} as const
export type Locale = keyof typeof localeRegistry
export type Catalogs = Readonly<Record<string, Partial<Catalog> | undefined>>
export interface Message { text: string; language: string }
export function supportedLocale(value: string): Locale {
  return Object.hasOwn(localeRegistry, value) ? value as Locale : 'es'
}
export const catalogs: Catalogs = Object.fromEntries(
  Object.entries(localeRegistry).map(([code, entry]) => [code, entry.catalog]),
)
export function resolveMessage(locale: string, key: MessageKey, available: Catalogs = catalogs): Message {
  for (const language of new Set([locale, 'es', 'en'])) {
    const text = available[language]?.[key]
    if (typeof text === 'string' && text.trim()) return { text, language }
  }
  const language = locale === 'es' ? 'es' : 'en'
  return { text: (language === 'es' ? emergencySpanish : emergencyEnglish)[key], language }
}
