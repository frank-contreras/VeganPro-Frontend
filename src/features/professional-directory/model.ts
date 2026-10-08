import type { MessageKey } from '../../localization/messages'

// Internal presentation types only. These are not backend DTOs or wire contracts.
export const ALL = '__all__'
export type Affiliation = 'vegan' | 'vegan-friendly' | 'unavailable'
export type Verification = 'verified' | 'not-verified' | 'unavailable'
export interface Selection { category: string; affiliation: string }
export const defaultSelection: Selection = { category: ALL, affiliation: ALL }
export interface FilterOption { value: string; label: string; labelKey?: MessageKey }
export interface DirectoryOptions {
  categories: readonly FilterOption[]
  affiliations: readonly FilterOption[]
}
export interface Professional {
  key: string
  name?: string
  category?: string
  categoryLabelKey?: MessageKey
  affiliation: Affiliation
  verification: Verification
  location?: string
  locationLabelKey?: MessageKey
  image?: string
}
export interface DirectoryView {
  options: DirectoryOptions
  professionals: readonly Professional[]
}
export interface DirectorySource {
  load: (selection: Readonly<Selection>) => Promise<DirectoryView>
}
export function hasFilters(selection: Selection) {
  return selection.category !== ALL || selection.affiliation !== ALL
}
