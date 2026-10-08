import { samplePortraits } from './samplePortraits'
import type { DirectoryOptions, Professional } from './model'

// All people, membership, vocabulary and statuses below are fictional.
// Eligibility is explicit fixture setup, independent of displayed affiliation.
export interface SampleProfessional extends Professional {
  eligible: boolean
  categoryValue?: string
}
export const sampleOptions: DirectoryOptions = {
  categories: [
    { value: 'nutrition', label: 'Nutrition', labelKey: 'category.nutrition' },
    { value: 'fitness', label: 'Fitness', labelKey: 'category.fitness' },
    { value: 'wellbeing', label: 'Wellbeing', labelKey: 'category.wellbeing' },
  ],
  affiliations: [
    { value: 'vegan', label: 'Vegan', labelKey: 'affiliation.vegan' },
    { value: 'vegan-friendly', label: 'Vegan-friendly', labelKey: 'affiliation.veganFriendly' },
  ],
}
export const sampleProfessionals: readonly SampleProfessional[] = [
  { key: 'sample-ada', image: samplePortraits['sample-ada'], eligible: true, name: 'Ada Green', category: 'Nutrition', categoryLabelKey: 'category.nutrition', categoryValue: 'nutrition', affiliation: 'vegan', verification: 'verified', location: 'Bristol · United Kingdom', locationLabelKey: 'location.bristol' },
  { key: 'sample-leo', image: samplePortraits['sample-leo'], eligible: true, name: 'Leo Fields', category: 'Nutrition', categoryLabelKey: 'category.nutrition', categoryValue: 'nutrition', affiliation: 'vegan-friendly', verification: 'not-verified', location: 'Remote', locationLabelKey: 'location.remote' },
  { key: 'sample-maya', image: samplePortraits['sample-maya'], eligible: true, name: 'Maya River', category: 'Fitness', categoryLabelKey: 'category.fitness', categoryValue: 'fitness', affiliation: 'vegan', verification: 'unavailable', location: 'Portland · United States', locationLabelKey: 'location.portland' },
  { key: 'sample-noah', image: samplePortraits['sample-noah'], eligible: true, name: 'Noah Grove', category: 'Wellbeing', categoryLabelKey: 'category.wellbeing', categoryValue: 'wellbeing', affiliation: 'vegan-friendly', verification: 'verified', location: 'Remote', locationLabelKey: 'location.remote' },
  { key: 'sample-robin', image: samplePortraits['sample-robin'], eligible: true, name: 'Robin Meadow', category: 'Wellbeing', categoryLabelKey: 'category.wellbeing', categoryValue: 'wellbeing', affiliation: 'unavailable', verification: 'unavailable' },
  { key: 'sample-incomplete', eligible: true, affiliation: 'vegan-friendly', verification: 'unavailable' },
]
