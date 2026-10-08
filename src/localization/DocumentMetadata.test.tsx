import { readFileSync } from 'node:fs'
import { StrictMode } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test } from 'vitest'
import { LocaleProvider } from './LocaleProvider'
import { DocumentMetadata } from './DocumentMetadata'
import { LanguageSelector } from '../components/public/LanguageSelector'

const originalHead = document.head.innerHTML
const originalLanguage = document.documentElement.lang
afterEach(() => { document.head.innerHTML = originalHead; document.documentElement.lang = originalLanguage })

test('static Spanish metadata and runtime round trip, including missing meta in Strict Mode', async () => {
  const html = readFileSync('index.html', 'utf8')
  expect(html).toContain('<html lang="es">')
  expect(html).toContain('<title>Directorio profesional · VeganPro</title>')
  expect(html).toContain('Personas y datos ficticios.')
  document.querySelector('meta[name="description"]')?.remove()
  const user = userEvent.setup()
  render(<StrictMode><LocaleProvider><DocumentMetadata /><LanguageSelector /></LocaleProvider></StrictMode>)
  expect(document.documentElement.lang).toBe('es')
  expect(document.title).toBe('Directorio profesional · VeganPro')
  const selector = screen.getByRole('combobox', { name: 'Idioma' })
  await user.selectOptions(selector, 'en')
  expect(document.documentElement.lang).toBe('en')
  expect(document.title).toBe('Professional directory · VeganPro')
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringContaining('Fictional people'))
  await user.selectOptions(selector, 'es')
  expect(document.documentElement.lang).toBe('es')
  expect(document.querySelectorAll('meta[name="description"]')).toHaveLength(1)
})
test('fallback metadata carries its actual language without mislabeling the page', () => {
  render(<LocaleProvider initialLocale="en" available={{ es: {
    'metadata.title': 'Directorio de muestra', 'metadata.description': 'Personas ficticias',
  } }}><DocumentMetadata /></LocaleProvider>)
  expect(document.documentElement.lang).toBe('en')
  expect(document.querySelector('title')).toHaveAttribute('lang', 'es')
  expect(document.querySelector('meta[name="description"]')).toHaveAttribute('lang', 'es')
})
