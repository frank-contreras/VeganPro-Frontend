import { render as baseRender, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { LocaleProvider } from '../../src/localization/LocaleProvider'
import type { Locale } from '../../src/localization/resolveMessage'

export function renderForLocale(locale: Locale) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
  }
  return (ui: ReactElement, options?: RenderOptions) => baseRender(ui, { wrapper: Wrapper, ...options })
}
// Independent expected copy for bilingual baseline assertions, not resolver output.
const spanish: Record<string, string> = {
  'Professional directory': 'Directorio profesional',
  'Professional category': 'Categoría profesional',
  'Vegan affiliation': 'Afinidad con el veganismo',
  'Clear filters': 'Limpiar filtros',
  'Clear these filters': 'Limpiar estos filtros',
  'Directory professionals': 'Profesionales del directorio',
  'Retry': 'Reintentar',
  'Name unavailable': 'Nombre no disponible',
  'Category unavailable': 'Categoría no disponible',
  'Affiliation unavailable': 'Afinidad no disponible',
  'Verification status unavailable': 'Estado de verificación no disponible',
  'Verified': 'Verificado', 'Not verified': 'No verificado',
  'Loading professionals': 'Cargando profesionales',
  'The directory is empty.': 'El directorio está vacío.',
  'No professionals match': 'No hay profesionales que coincidan',
  'We could not load': 'No pudimos cargar',
  'Professionals ready.': 'Profesionales disponibles.',
}
export function expectedCopy(locale: Locale, english: string) {
  if (locale === 'en') return english
  if (!spanish[english]) throw new Error(`Missing test expectation: ${english}`)
  return spanish[english]
}
