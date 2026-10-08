import { useId } from 'react'
import { ALL, type DirectoryOptions, type Selection } from './model'
import { useLocale } from '../../localization/LocaleProvider'
import { LocalizedText } from '../../localization/LocalizedText'

interface Props {
  selection: Selection
  options?: DirectoryOptions
  onSelect: (selection: Selection) => void
  onClear: () => void
}
export function DirectoryFilters({ selection, options, onSelect, onClear }: Props) {
  const id = useId()
  const { message } = useLocale()
  const region = message('filters.label')
  return <section className="filters" aria-label={region.text} lang={region.language}>
    <div className="filter-field">
      <label htmlFor={`${id}-category`}><LocalizedText messageKey="filters.category" /></label>
      <select id={`${id}-category`} value={selection.category} disabled={!options}
        onChange={(event) => onSelect({ ...selection, category: event.target.value })}>
        <option value={ALL} lang={message('filters.allCategories').language}>{message('filters.allCategories').text}</option>
        {options?.categories.map((option) => {
          const label = option.labelKey ? message(option.labelKey) : { text: option.label, language: undefined }
          return <option key={option.value} value={option.value} lang={label.language}>{label.text}</option>
        })}
      </select>
    </div>
    <div className="filter-field">
      <label htmlFor={`${id}-affiliation`}><LocalizedText messageKey="filters.affiliation" /></label>
      <select id={`${id}-affiliation`} value={selection.affiliation} disabled={!options}
        onChange={(event) => onSelect({ ...selection, affiliation: event.target.value })}>
        <option value={ALL} lang={message('filters.allAffiliations').language}>{message('filters.allAffiliations').text}</option>
        {options?.affiliations.map((option) => {
          const label = option.labelKey ? message(option.labelKey) : { text: option.label, language: undefined }
          return <option key={option.value} value={option.value} lang={label.language}>{label.text}</option>
        })}
      </select>
    </div>
    <button type="button" className="clear-button" onClick={onClear}><LocalizedText messageKey="filters.clear" /></button>
  </section>
}
