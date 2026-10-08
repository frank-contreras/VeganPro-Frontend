import { ProfessionalCard } from './ProfessionalCard'
import { LanguageSelector } from '../../components/public/LanguageSelector'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { LocaleProvider } from '../../localization/LocaleProvider'
import { DocumentMetadata } from '../../localization/DocumentMetadata'
import { ProfessionalDirectoryPage } from './ProfessionalDirectoryPage'
import { controlledSource } from '../../../tests/helpers/controlledSource'
import { sampleOptions, sampleProfessionals } from './fixtures'
import { createMockDirectorySource } from './mockDirectorySource'
import { ALL, type DirectoryView } from './model'
import type { Locale } from '../../localization/resolveMessage'

const copy = {
  es: { language: 'Idioma', category: 'Categoría profesional', affiliation: 'Afinidad con el veganismo',
    retry: 'Reintentar', clear: 'Limpiar estos filtros', heading: 'Profesionales del directorio', discovery: 'Explorar profesionales',
    pending: 'Cargando profesionales…', populated: 'Profesionales disponibles.', empty: 'El directorio está vacío.',
    'no-matches': 'No hay profesionales que coincidan con estos filtros.', error: 'No pudimos cargar los profesionales.' },
  en: { language: 'Language', category: 'Professional category', affiliation: 'Vegan affiliation',
    retry: 'Retry', clear: 'Clear these filters', heading: 'Directory professionals', discovery: 'Explore professionals',
    pending: 'Loading professionals…', populated: 'Professionals ready.', empty: 'The directory is empty.',
    'no-matches': 'No professionals match these filters.', error: 'We could not load professionals.' },
}
const view: DirectoryView = { options: sampleOptions, professionals: sampleProfessionals }

describe.each(['es', 'en'] as const)('state preservation from %s', (locale) => {
  const next: Locale = locale === 'es' ? 'en' : 'es'
  for (const mode of ['initial-pending', 'update-pending', 'retry-pending', 'empty', 'no-matches', 'error', 'repeated-error'] as const) {
    test(`switch preserves ${mode} and its live operation/recovery`, async () => {
      const user = userEvent.setup()
      const { source, requests } = controlledSource()
      render(<LocaleProvider initialLocale={locale}><ProfessionalDirectoryPage source={source} /></LocaleProvider>)
      await waitFor(() => expect(requests).toHaveLength(1))
      if (mode === 'empty') await act(async () => requests[0].resolve({ ...view, professionals: [] }))
      else if (mode !== 'initial-pending') {
        await act(async () => requests[0].resolve(view))
        await user.selectOptions(screen.getByRole('combobox', { name: copy[locale].category }), 'nutrition')
        await waitFor(() => expect(requests).toHaveLength(2))
        if (mode === 'no-matches') await act(async () => requests[1].resolve({ ...view, professionals: [] }))
        else if (mode !== 'update-pending') {
          await act(async () => requests[1].reject(new Error('private detail')))
          if (mode === 'retry-pending' || mode === 'repeated-error') {
            await user.click(screen.getByRole('button', { name: copy[locale].retry }))
            await waitFor(() => expect(requests).toHaveLength(3))
            if (mode === 'repeated-error') await act(async () => requests[2].reject(new Error('again')))
          }
        }
      }
      const before = requests.length
      const active = requests.at(-1)!
      const category = screen.getByRole('combobox', { name: copy[locale].category })
      const expectedValue = mode === 'empty' || mode === 'initial-pending' ? ALL : 'nutrition'
      const disabled = mode === 'initial-pending'
      const status = screen.getByRole('status')
      const kind = mode === 'initial-pending' || mode === 'update-pending' || mode === 'retry-pending'
        ? 'pending' : mode === 'repeated-error' ? 'error' : mode
      const selector = screen.getByRole('combobox', { name: copy[locale].language })
      await user.selectOptions(selector, next)
      await act(async () => { await Promise.resolve() })
      expect(requests).toHaveLength(before)
      expect(requests.at(-1)).toBe(active)
      expect(screen.getByRole('status')).toBe(status)
      expect(status).toHaveTextContent(copy[next][kind])
      expect(category).toHaveValue(expectedValue)
      if (disabled) expect(category).toBeDisabled()
      else expect(category).toBeEnabled()
      expect(selector).toHaveFocus()
      expect(screen.queryByText('private detail')).not.toBeInTheDocument()
      if (mode.endsWith('pending')) {
        await act(async () => active.resolve(view))
        expect(status).toHaveTextContent(copy[next].populated)
        expect(screen.getAllByRole('article')).toHaveLength(6)
        expect(selector).toHaveFocus()
      } else if (mode === 'no-matches') {
        await user.click(screen.getByRole('button', { name: copy[next].clear }))
        await waitFor(() => expect(requests).toHaveLength(before + 1))
        expect(requests.at(-1)!.selection).toEqual({ category: ALL, affiliation: ALL })
        expect(screen.getByRole('heading', { name: copy[next].heading })).toHaveFocus()
        await act(async () => requests.at(-1)!.resolve(view))
      } else if (kind === 'error') {
        await user.click(screen.getByRole('button', { name: copy[next].retry }))
        await waitFor(() => expect(requests).toHaveLength(before + 1))
        expect(requests.at(-1)!.selection.category).toBe('nutrition')
        expect(screen.getByRole('heading', { name: copy[next].heading })).toHaveFocus()
        await act(async () => requests.at(-1)!.resolve(view))
      }
      expect(screen.getByRole('contentinfo')).toHaveTextContent(next === 'es' ? 'Un prototipo para crear comunidad, juntos.' : 'A prototype for building community, together.')
      expect(screen.getByRole('contentinfo')).toHaveTextContent(next === 'es' ? 'Retratos ilustrativos.' : 'Illustrative portraits.')
    })
  }
  test('populated category/affiliation/AND keep identities, options, order and no extra source load', async () => {
    const user = userEvent.setup()
    const mock = createMockDirectorySource()
    let count = 0
    const source = { load: (selection: Parameters<typeof mock.load>[0]) => { count++; return mock.load(selection) } }
    render(<LocaleProvider initialLocale={locale}><ProfessionalDirectoryPage source={source} /></LocaleProvider>)
    await screen.findByRole('heading', { name: 'Ada Green' })
    for (const selection of [{ category: 'nutrition', affiliation: ALL }, { category: ALL, affiliation: 'vegan' }, { category: 'nutrition', affiliation: 'vegan' }]) {
      const selector = screen.getByRole('combobox', { name: copy[locale].language })
      await user.selectOptions(screen.getByRole('combobox', { name: copy[locale].category }), selection.category)
      await user.selectOptions(screen.getByRole('combobox', { name: copy[locale].affiliation }), selection.affiliation)
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(copy[locale].populated))
      const cards = screen.getAllByRole('article')
      const text = cards.map((card) => card.querySelector('h3')!.textContent)
      const before = count
      await user.selectOptions(selector, next)
      expect(count).toBe(before)
      expect(screen.getAllByRole('article')).toEqual(cards)
      expect(cards.map((card) => card.querySelector('h3')!.textContent)).toEqual(text)
      expect(screen.getByRole('combobox', { name: copy[next].category })).toHaveValue(selection.category)
      expect(screen.getByRole('combobox', { name: copy[next].affiliation })).toHaveValue(selection.affiliation)
      expect(screen.getByRole('option', { name: next === 'es' ? 'Bienestar' : 'Wellbeing' })).toHaveValue('wellbeing')
      await user.click(screen.getByRole('link', { name: copy[next].discovery }))
      expect(document.getElementById('professional-directory')).toHaveFocus()
      expect(count).toBe(before)
      await user.selectOptions(selector, locale)
    }
  })
})

test('locale switch preserves stale rejection safeguards and the active execution in Strict Mode', async () => {
  const user = userEvent.setup()
  const { source, requests } = controlledSource()
  render(<LocaleProvider><ProfessionalDirectoryPage source={source} /></LocaleProvider>, { reactStrictMode: true })
  await waitFor(() => expect(requests.length).toBeGreaterThan(1))
  await act(async () => requests.at(-1)!.resolve(view))
  const category = screen.getByRole('combobox', { name: 'Categoría profesional' })
  await user.selectOptions(category, 'nutrition')
  const previous = requests.at(-1)!
  await user.selectOptions(category, 'fitness')
  const active = requests.at(-1)!
  const before = requests.length
  await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en')
  await act(async () => { active.resolve({ ...view, professionals: [sampleProfessionals[2]] }) })
  await act(async () => { previous.reject(new Error('obsolete')); requests[0].resolve({ ...view, professionals: [] }) })
  expect(requests).toHaveLength(before)
  expect(category).toHaveValue('fitness')
  expect(screen.getByRole('status')).toHaveTextContent('Professionals ready.')
  expect(screen.getAllByRole('article')).toHaveLength(1)
  expect(screen.getByRole('heading', { name: 'Maya River' })).toBeInTheDocument()
})

test('fallback names/options/announcements carry language and missing fields remain honest', async () => {
  render(<LocaleProvider initialLocale="en" available={{ es: {
    'filters.category': 'Categoría profesional', 'filters.label': 'Filtrar profesionales',
    'category.nutrition': 'Nutrición', 'status.populated': 'Profesionales disponibles.',
  } }}><DocumentMetadata /><ProfessionalDirectoryPage source={createMockDirectorySource()} /></LocaleProvider>)
  await screen.findByRole('heading', { name: 'Ada Green' })
  expect(screen.getByText('Categoría profesional')).toHaveAttribute('lang', 'es')
  expect(screen.getByRole('region', { name: 'Filtrar profesionales' })).toHaveAttribute('lang', 'es')
  expect(screen.getByRole('option', { name: 'Nutrición' })).toHaveAttribute('lang', 'es')
  expect(screen.getByRole('status').firstElementChild).toHaveAttribute('lang', 'es')
  expect(screen.getByRole('heading', { name: 'Name unavailable' })).toBeInTheDocument()
})


test('failed portrait stays failed across a locale change and recovers on source replacement', async () => {
  const user = userEvent.setup()
  const card = { key: 'portrait-test', name: 'Fictional Person', affiliation: 'vegan' as const, verification: 'unavailable' as const, image: 'old.jpg' }
  const tree = (image: string) => <LocaleProvider><LanguageSelector /><ProfessionalCard professional={{ ...card, image }} /></LocaleProvider>
  const { container, rerender } = render(tree(card.image))
  fireEvent.error(container.querySelector('img')!)
  await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en')
  expect(container.querySelector('img')).toBeNull()
  expect(screen.getByRole('heading', { name: 'Fictional Person' })).toBeInTheDocument()
  expect(screen.getByText('Verification status unavailable')).toBeInTheDocument()
  rerender(tree('new.jpg'))
  expect(container.querySelector('img')).toHaveAttribute('src', 'new.jpg')
  expect(container.querySelector('img')).toHaveAttribute('alt', '')
})

test('label hints do not fabricate missing fields and unkeyed supplied text is preserved', () => {
  const card = { key: 'missing', affiliation: 'unavailable' as const, verification: 'unavailable' as const,
    category: ' ', categoryLabelKey: 'category.nutrition' as const, locationLabelKey: 'location.remote' as const }
  const { rerender } = render(<LocaleProvider><ProfessionalCard professional={card} /></LocaleProvider>)
  expect(screen.getByText('Categoría no disponible')).toBeInTheDocument()
  expect(screen.queryByText('A distancia')).not.toBeInTheDocument()
  rerender(<LocaleProvider><ProfessionalCard professional={{ ...card, category: 'Unkeyed category', categoryLabelKey: undefined, location: 'Unkeyed place', locationLabelKey: undefined }} /></LocaleProvider>)
  expect(screen.getByText('Unkeyed category')).toBeInTheDocument()
  expect(screen.getByText('Unkeyed place')).toBeInTheDocument()
})
