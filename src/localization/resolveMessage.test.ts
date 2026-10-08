import { expect, test } from 'vitest'
import { catalogs, localeRegistry, resolveMessage, supportedLocale } from './resolveMessage'
import { emergencyEnglish, emergencySpanish, type MessageKey } from './messages'

test('both catalogs are complete nonblank copy; only reviewed locales are registered', () => {
  expect(Object.keys(localeRegistry)).toEqual(['es', 'en'])
  for (const catalog of [catalogs.es!, catalogs.en!, emergencyEnglish]) {
    expect(Object.keys(catalog).sort()).toEqual(Object.keys(emergencySpanish).sort())
    for (const key of Object.keys(emergencySpanish) as MessageKey[]) expect(catalog[key]?.trim()).toBeTruthy()
  }
  expect(supportedLocale('ht')).toBe('es')
  expect(supportedLocale('en')).toBe('en')
  expect(supportedLocale('toString')).toBe('es')
})
test('missing and blank messages resolve Spanish then English then meaningful emergency copy with language', () => {
  expect(resolveMessage('en', 'feedback.retry')).toEqual({ text: 'Retry', language: 'en' })
  expect(resolveMessage('en', 'feedback.retry', { es: { 'feedback.retry': 'Reintentar' }, en: { 'feedback.retry': ' ' } })).toEqual({ text: 'Reintentar', language: 'es' })
  expect(resolveMessage('es', 'feedback.retry', { en: { 'feedback.retry': 'Retry' } })).toEqual({ text: 'Retry', language: 'en' })
  expect(resolveMessage('en', 'verification.unavailable', {})).toEqual({ text: 'Verification status unavailable', language: 'en' })
  expect(resolveMessage('es', 'feedback.retry', {})).toEqual({ text: 'Reintentar', language: 'es' })
  expect(resolveMessage('ht', 'feedback.retry', { ht: { 'feedback.retry': 'Eseye ankò' } })).toEqual({ text: 'Eseye ankò', language: 'ht' })
})
