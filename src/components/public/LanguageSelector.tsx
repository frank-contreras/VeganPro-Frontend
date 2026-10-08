import { useId } from 'react'
import { useLocale } from '../../localization/LocaleProvider'
import { localeRegistry, type Locale } from '../../localization/resolveMessage'
import { LocalizedText } from '../../localization/LocalizedText'

export function LanguageSelector() {
  const id = useId()
  const { locale, setLocale } = useLocale()
  return <div className="language-selector">
    <label htmlFor={id}><LocalizedText messageKey="language" /></label>
    <select id={id} value={locale} onChange={(event) => setLocale(event.target.value)}>
      {(Object.keys(localeRegistry) as Locale[]).map((code) =>
        <option key={code} value={code} lang={code}>{localeRegistry[code].name}</option>)}
    </select>
  </div>
}
