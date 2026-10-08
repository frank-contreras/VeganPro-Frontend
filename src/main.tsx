import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'
import { DocumentMetadata } from './localization/DocumentMetadata'
import { LocaleProvider } from './localization/LocaleProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode><LocaleProvider><DocumentMetadata /><App /></LocaleProvider></StrictMode>,
)
