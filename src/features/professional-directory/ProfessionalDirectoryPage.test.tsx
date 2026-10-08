import { renderForLocale, expectedCopy } from '../../../tests/helpers/renderLocalized'
import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { ProfessionalDirectoryPage } from './ProfessionalDirectoryPage'
import { createMockDirectorySource } from './mockDirectorySource'
import { controlledSource } from '../../../tests/helpers/controlledSource'
import { sampleOptions, sampleProfessionals } from './fixtures'
import { ALL } from './model'

describe.each(['es', 'en'] as const)('directory presentation in %s', (locale) => {
  const render = renderForLocale(locale)
  const copy = (text: string) => expectedCopy(locale, text)

  test('filters match category alone, affiliation alone, intersection, and clear', async () => {
    const user = userEvent.setup()
    render(<ProfessionalDirectoryPage source={createMockDirectorySource()} />)
    await screen.findByRole('heading', { name: 'Ada Green' })
    const category = screen.getByRole('combobox', { name: copy('Professional category') })
    const affiliation = screen.getByRole('combobox', { name: copy('Vegan affiliation') })
    await user.selectOptions(category, 'nutrition')
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))
    await user.selectOptions(affiliation, 'vegan-friendly')
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(1))
    expect(screen.getByRole('heading', { name: 'Leo Fields' })).toBeInTheDocument()
    await user.selectOptions(category, ALL)
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(3))
    expect(screen.queryByRole('heading', { name: 'Robin Meadow' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: copy('Clear filters') }))
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(6))
    expect(category).toHaveValue(ALL)
    expect(affiliation).toHaveValue(ALL)
  })

  test('initial filters wait for vocabulary and later updates hide old cards and retain options', async () => {
    const user = userEvent.setup()
    const { source, requests } = controlledSource()
    render(<ProfessionalDirectoryPage source={source} />)
    const category = screen.getByRole('combobox', { name: copy('Professional category') })
    expect(category).toBeDisabled()
    await waitFor(() => expect(requests).toHaveLength(1))
    await act(async () => requests[0].resolve({ options: sampleOptions, professionals: sampleProfessionals }))
    await user.selectOptions(category, 'fitness')
    await waitFor(() => expect(requests).toHaveLength(2))
    expect(screen.queryByRole('article')).not.toBeInTheDocument()
    expect(category).toBeEnabled()
    expect(category).toHaveValue('fitness')
    expect(within(category).getAllByRole('option')).toHaveLength(4)
    await act(async () => requests[1].resolve({ options: sampleOptions, professionals: [] }))
    expect(within(category).getAllByRole('option')).toHaveLength(4)
  })
})
