import { expect, test } from 'vitest'
import { directoryReducer, initialState, resultKind } from './directoryState'
import { sampleOptions, sampleProfessionals } from './fixtures'
import { ALL } from './model'

test('selection and revision update atomically; stale outcomes before cleanup cannot win', () => {
  const next = directoryReducer(initialState, { type: 'select', selection: { category: 'nutrition', affiliation: ALL } })
  expect(next).toMatchObject({ status: 'pending', revision: 1, selection: { category: 'nutrition' } })
  expect(directoryReducer(next, { type: 'success', revision: 0, view: { options: sampleOptions, professionals: sampleProfessionals } })).toBe(next)
  expect(directoryReducer(next, { type: 'failure', revision: 0 })).toBe(next)
})

test('pending removes cards, retry retains selections/options and empty states stay distinct', () => {
  const loaded = directoryReducer(initialState, { type: 'success', revision: 0, view: { options: sampleOptions, professionals: sampleProfessionals } })
  const next = directoryReducer(loaded, { type: 'select', selection: { category: 'fitness', affiliation: 'vegan-friendly' } })
  expect('view' in next).toBe(false)
  const failed = directoryReducer(next, { type: 'failure', revision: next.revision })
  const retry = directoryReducer(failed, { type: 'retry' })
  expect(retry.selection).toEqual(next.selection)
  expect(retry.options).toEqual(sampleOptions)
  expect(retry.revision).toBe(next.revision + 1)
  const empty = directoryReducer(retry, { type: 'success', revision: retry.revision, view: { options: sampleOptions, professionals: [] } })
  expect(resultKind(empty)).toBe('no-matches')
  const clear = directoryReducer(empty, { type: 'clear' })
  expect(resultKind(directoryReducer(clear, { type: 'success', revision: clear.revision, view: { options: sampleOptions, professionals: [] } }))).toBe('empty')
  expect(directoryReducer(clear, { type: 'clear' })).toBe(clear)
})
