import { renderForLocale, expectedCopy } from '../../../tests/helpers/renderLocalized'
import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { ProfessionalCard, VerificationBadge } from './ProfessionalCard'
import type { Professional, Verification } from './model'

describe.each(['es', 'en'] as const)('directory presentation in %s', (locale) => {
  const render = renderForLocale(locale)
  const copy = (text: string) => expectedCopy(locale, text)

  const incomplete: Professional = { key: 'test', affiliation: 'unavailable', verification: 'unavailable' }
  test('missing identity, category, affiliation and verification use honest unavailable labels', () => {
    const { container } = render(<ProfessionalCard professional={incomplete} />)
    expect(screen.getByRole('heading', { name: copy('Name unavailable') })).toBeInTheDocument()
    for (const text of [copy('Category unavailable'), copy('Affiliation unavailable'), copy('Verification status unavailable')]) expect(screen.getByText(text)).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })
  test('verification is explicit text, and unknown/missing statuses are not negative claims', () => {
    const { rerender } = render(<VerificationBadge status="verified" />)
    expect(screen.getByText(copy('Verified'))).toBeInTheDocument()
    rerender(<VerificationBadge status="not-verified" />)
    expect(screen.getByText(copy('Not verified'))).toBeInTheDocument()
    rerender(<VerificationBadge />)
    expect(screen.getByText(copy('Verification status unavailable'))).toBeInTheDocument()
    rerender(<VerificationBadge status={'unexpected' as Verification} />)
    expect(screen.getByText(copy('Verification status unavailable'))).toBeInTheDocument()
  })
  test('broken optional image falls back and resets when its source changes', () => {
    const { container, rerender } = render(<ProfessionalCard professional={{ ...incomplete, image: 'old.svg' }} />)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).toBeNull()
    rerender(<ProfessionalCard professional={{ ...incomplete, image: 'new.svg' }} />)
    expect(container.querySelector('img')).toHaveAttribute('src', 'new.svg')
    expect(container.querySelector('img')).toHaveAttribute('alt', '')
  })
})

// Normalized blank sources never create an image element.
test('blank portrait sources use the same neutral fallback', () => {
  const render = renderForLocale('es')
  const { container, rerender } = render(<ProfessionalCard professional={{ key: 'blank', affiliation: 'unavailable', verification: 'unavailable', image: '  ' }} />)
  expect(container.querySelector('img')).toBeNull()
  rerender(<ProfessionalCard professional={{ key: 'blank', affiliation: 'unavailable', verification: 'unavailable', image: '' }} />)
  expect(container.querySelector('img')).toBeNull()
  expect(screen.getByRole('heading', { name: 'Nombre no disponible' })).toBeInTheDocument()
})
