import { act, renderHook, waitFor } from '@testing-library/react'
import { expect, test } from 'vitest'
import { useProfessionalDirectory } from './useProfessionalDirectory'
import { sampleOptions, sampleProfessionals } from './fixtures'
import { ALL } from './model'
import { controlledSource } from '../../../tests/helpers/controlledSource'

const view = { options: sampleOptions, professionals: sampleProfessionals }

test('rapid selection changes ignore old success and old rejection', async () => {
  const { source, requests } = controlledSource()
  const { result } = renderHook(() => useProfessionalDirectory(source))
  await waitFor(() => expect(requests).toHaveLength(1))
  act(() => result.current.select({ category: 'nutrition', affiliation: ALL }))
  await waitFor(() => expect(requests).toHaveLength(2))
  act(() => result.current.select({ category: 'fitness', affiliation: ALL }))
  await waitFor(() => expect(requests).toHaveLength(3))
  await act(async () => requests[2].resolve(view))
  await act(async () => requests[0].resolve({ ...view, professionals: [] }))
  await act(async () => requests[1].reject(new Error('obsolete')))
  expect(result.current.state).toMatchObject({ status: 'success', selection: { category: 'fitness' }, view })
})

test('failure and repeated retry keep current selections and ready vocabulary', async () => {
  const { source, requests } = controlledSource()
  const { result } = renderHook(() => useProfessionalDirectory(source))
  await waitFor(() => expect(requests).toHaveLength(1))
  await act(async () => requests[0].resolve(view))
  act(() => result.current.select({ category: 'nutrition', affiliation: 'vegan' }))
  await waitFor(() => expect(requests).toHaveLength(2))
  await act(async () => requests[1].reject(new Error('failure')))
  expect(result.current.state.status).toBe('error')
  act(() => result.current.retry())
  await waitFor(() => expect(requests).toHaveLength(3))
  expect(requests[2].selection).toEqual({ category: 'nutrition', affiliation: 'vegan' })
  expect(result.current.state.options).toEqual(sampleOptions)
  await act(async () => requests[2].reject(new Error('again')))
  act(() => result.current.retry())
  await waitFor(() => expect(requests).toHaveLength(4))
  await act(async () => requests[3].resolve(view))
  expect(result.current.state.status).toBe('success')
})

test('Strict Mode execution cleanup invalidates earlier setup even at the same revision', async () => {
  const { source, requests } = controlledSource()
  const { result, unmount } = renderHook(() => useProfessionalDirectory(source), { reactStrictMode: true })
  await waitFor(() => expect(requests.length).toBeGreaterThan(1))
  const latest = requests.at(-1)!
  await act(async () => latest.resolve(view))
  await act(async () => { for (const request of requests.slice(0, -1)) request.reject(new Error('cleaned up')) })
  expect(result.current.state.status).toBe('success')
  act(() => result.current.retry())
  await waitFor(() => expect(requests.at(-1)).not.toBe(latest))
  unmount()
  await act(async () => requests.at(-1)!.resolve(view))
})

test('a synchronous source failure becomes a recoverable error', async () => {
  const source = { load: () => { throw new Error('private detail') } }
  const { result } = renderHook(() => useProfessionalDirectory(source))
  await waitFor(() => expect(result.current.state.status).toBe('error'))
})
