import { createContext, useContext, useState, type ReactNode } from 'react'
import { catalogs, resolveMessage, supportedLocale, type Catalogs, type Locale, type Message } from './resolveMessage'
import type { MessageKey } from './messages'

interface LocaleContextValue {
  locale: Locale
  setLocale: (value: string) => void
  message: (key: MessageKey) => Message
}
const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)
export function LocaleProvider({ children, initialLocale = 'es', available = catalogs }: {
  children: ReactNode; initialLocale?: Locale; available?: Catalogs
}) {
  const [locale, setCurrentLocale] = useState<Locale>(initialLocale)
  return <LocaleContext.Provider value={{ locale, setLocale: (value) => setCurrentLocale(supportedLocale(value)),
    message: (key) => resolveMessage(locale, key, available) }}>{children}</LocaleContext.Provider>
}
export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('LocaleProvider is required')
  return context
}
