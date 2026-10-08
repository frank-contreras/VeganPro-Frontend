import { renderForLocale, expectedCopy } from '../../../tests/helpers/renderLocalized'
import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test } from 'vitest'
import { ProfessionalDirectoryPage } from './ProfessionalDirectoryPage'
import { controlledSource } from '../../../tests/helpers/controlledSource'
import { sampleOptions, sampleProfessionals } from './fixtures'
import { ALL } from './model'

describe.each(['es', 'en'] as const)('directory presentation in %s', (locale) => {
  const render = renderForLocale(locale)
  const copy = (text: string) => expectedCopy(locale, text)

  const view = { options: sampleOptions, professionals: sampleProfessionals }

  test('delayed initial result shows loading, not empty, and a successful empty directory is distinct', async () => {
    const { source, requests } = controlledSource()
    render(<ProfessionalDirectoryPage source={source} />)
    expect(screen.getByRole('status')).toHaveTextContent(copy('Loading professionals'))
    expect(screen.queryByText(copy('The directory is empty.'))).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: copy('Retry') })).not.toBeInTheDocument()
    await waitFor(() => expect(requests).toHaveLength(1))
    await act(async () => requests[0].resolve({ ...view, professionals: [] }))
    expect(screen.getByRole('status')).toHaveTextContent(copy('The directory is empty.'))
    expect(screen.queryByRole('button', { name: copy('Clear these filters') })).not.toBeInTheDocument()
  })

  test('filtered empty offers clear, restores All and keeps focus predictable on recovery', async () => {
    const user = userEvent.setup()
    const { source, requests } = controlledSource()
    render(<ProfessionalDirectoryPage source={source} />)
    await waitFor(() => expect(requests).toHaveLength(1))
    await act(async () => requests[0].resolve(view))
    const category = screen.getByRole('combobox', { name: copy('Professional category') })
    await user.selectOptions(category, 'fitness')
    expect(category).toHaveFocus()
    await waitFor(() => expect(requests).toHaveLength(2))
    await act(async () => requests[1].resolve({ ...view, professionals: [] }))
    expect(category).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent(copy('No professionals match'))
    await user.click(screen.getByRole('button', { name: copy('Clear these filters') }))
    await waitFor(() => expect(requests).toHaveLength(3))
    expect(requests[2].selection).toEqual({ category: ALL, affiliation: ALL })
    expect(screen.getByRole('heading', { name: copy('Directory professionals') })).toHaveFocus()
    await act(async () => requests[2].resolve(view))
    expect(screen.getAllByRole('article')).toHaveLength(6)
    expect(screen.getByRole('heading', { name: copy('Directory professionals') })).toHaveFocus()
  })

  test('initial failure, repeat failure and retry recover without exposing source errors', async () => {
    const user = userEvent.setup()
    const { source, requests } = controlledSource()
    render(<ProfessionalDirectoryPage source={source} />)
    await waitFor(() => expect(requests).toHaveLength(1))
    await act(async () => requests[0].reject(new Error('private technical detail')))
    expect(screen.getByRole('status')).toHaveTextContent(copy('We could not load'))
    expect(screen.queryByText(/private technical detail/)).not.toBeInTheDocument()
    expect(screen.queryByText(copy('The directory is empty.'))).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: copy('Retry') }))
    expect(screen.getByRole('heading', { name: copy('Directory professionals') })).toHaveFocus()
    await waitFor(() => expect(requests).toHaveLength(2))
    await act(async () => requests[1].reject(new Error('still unavailable')))
    await user.click(screen.getByRole('button', { name: copy('Retry') }))
    await waitFor(() => expect(requests).toHaveLength(3))
    await act(async () => requests[2].resolve(view))
    expect(screen.getByRole('status')).toHaveTextContent(copy('Professionals ready.'))
    expect(screen.getAllByRole('article')).toHaveLength(6)
  })

  test('update failure keeps selections/options, and retry applies the current snapshot', async () => {
    const user = userEvent.setup()
    const { source, requests } = controlledSource()
    render(<ProfessionalDirectoryPage source={source} />)
    await waitFor(() => expect(requests).toHaveLength(1))
    await act(async () => requests[0].resolve(view))
    const affiliation = screen.getByRole('combobox', { name: copy('Vegan affiliation') })
    await user.selectOptions(affiliation, 'vegan')
    await waitFor(() => expect(requests).toHaveLength(2))
    await act(async () => requests[1].reject(new Error('failure')))
    expect(affiliation).toBeEnabled()
    expect(affiliation).toHaveValue('vegan')
    expect(screen.getByRole('button', { name: copy('Clear filters') })).toBeEnabled()
    await user.click(screen.getByRole('button', { name: copy('Retry') }))
    await waitFor(() => expect(requests).toHaveLength(3))
    expect(requests[2].selection.affiliation).toBe('vegan')
    await act(async () => requests[2].resolve({ ...view, professionals: [sampleProfessionals[0]] }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })
})
