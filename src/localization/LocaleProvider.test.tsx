import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { LocaleProvider } from './LocaleProvider'
import { LocalizedText } from './LocalizedText'
import { LanguageSelector } from '../components/public/LanguageSelector'

test('Spanish ignores browser preference and round-trip switching keeps control focus', async () => {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US')
  const user = userEvent.setup()
  render(<LocaleProvider><LanguageSelector /><LocalizedText messageKey="feedback.retry" /></LocaleProvider>)
  const selector = screen.getByRole('combobox', { name: 'Idioma' })
  expect(selector).toHaveValue('es')
  expect(screen.getByText('Reintentar')).toBeInTheDocument()
  await user.selectOptions(selector, 'en')
  expect(screen.getByRole('combobox', { name: 'Language' })).toBe(selector)
  expect(selector).toHaveFocus()
  expect(screen.getByText('Retry')).toBeInTheDocument()
  await user.selectOptions(selector, 'es')
  expect(selector).toHaveFocus()
  expect(screen.getByText('Reintentar')).toBeInTheDocument()
  vi.restoreAllMocks()
})
test('cross-language fallback text carries the actual language', () => {
  render(<LocaleProvider initialLocale="en" available={{ es: { 'feedback.retry': 'Reintentar' } }}>
    <LocalizedText messageKey="feedback.retry" />
  </LocaleProvider>)
  expect(screen.getByText('Reintentar')).toHaveAttribute('lang', 'es')
})
