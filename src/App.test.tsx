import { renderForLocale, expectedCopy } from '../tests/helpers/renderLocalized'
import { screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { App } from './App'

describe.each(['es', 'en'] as const)('directory presentation in %s', (locale) => {
  const render = renderForLocale(locale)
  const copy = (text: string) => expectedCopy(locale, text)

  test('public entry identifies the directory without a session', async () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: copy('Professional directory'), level: 1 })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText(locale === 'es' ? /Todas las personas, categorías, afinidades y estados de verificación son ficticios/ : /All people, categories, affiliations, and verification statuses are fictional/)).toBeInTheDocument()
    expect(await screen.findAllByRole('article')).toHaveLength(6)
  })
})
