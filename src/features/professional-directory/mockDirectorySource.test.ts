import { expect, test } from 'vitest'
import { ALL, defaultSelection } from './model'
import { createMockDirectorySource } from './mockDirectorySource'
import { sampleProfessionals, sampleOptions } from './fixtures'

test('every named public sample has a distinct portrait while the incomplete sample keeps its fallback', () => {
  const named = sampleProfessionals.filter((professional) => professional.name)
  expect(named).toHaveLength(5)
  for (const professional of named) expect(professional.image?.trim()).toBeTruthy()
  expect(new Set(named.map((professional) => professional.image)).size).toBe(5)
  const incomplete = sampleProfessionals.find((professional) => professional.key === 'sample-incomplete')
  expect(incomplete).toBeDefined()
  expect(incomplete?.image).toBeUndefined()
})

test('full sample scope has unique stable keys and no inferred eligibility', async () => {
  const source = createMockDirectorySource([...sampleProfessionals, { ...sampleProfessionals[0], key: 'excluded', eligible: false }])
  const view = await source.load(defaultSelection)
  expect(view.professionals).toHaveLength(6)
  expect(new Set(view.professionals.map((p) => p.key)).size).toBe(6)
  expect(view.professionals.some((p) => p.key === 'excluded')).toBe(false)
  expect(view.professionals.some((p) => p.affiliation === 'unavailable')).toBe(true)
})

test('category, affiliation, AND, All and no matches preserve the vocabulary', async () => {
  const source = createMockDirectorySource()
  const category = await source.load({ category: 'nutrition', affiliation: ALL })
  expect(category.professionals.map((p) => p.name)).toEqual(['Ada Green', 'Leo Fields'])
  const vegan = await source.load({ category: ALL, affiliation: 'vegan' })
  expect(vegan.professionals.map((p) => p.name)).toEqual(['Ada Green', 'Maya River'])
  const both = await source.load({ category: 'nutrition', affiliation: 'vegan-friendly' })
  expect(both.professionals.map((p) => p.name)).toEqual(['Leo Fields'])
  const empty = await source.load({ category: 'fitness', affiliation: 'vegan-friendly' })
  expect(empty.professionals).toEqual([])
  expect(empty.options).toEqual(sampleOptions)
  expect((await source.load(defaultSelection)).professionals).toEqual(sampleProfessionals)
})
