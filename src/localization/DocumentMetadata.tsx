import { useEffect } from 'react'
import { useLocale } from './LocaleProvider'

export function DocumentMetadata() {
  const { locale, message } = useLocale()
  const title = message('metadata.title')
  const description = message('metadata.description')
  useEffect(() => {
    document.documentElement.lang = locale
    document.title = title.text
    document.querySelector('title')?.setAttribute('lang', title.language)
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.append(meta)
    }
    meta.content = description.text
    meta.lang = description.language
  }, [locale, title.text, title.language, description.text, description.language])
  return null
}
