import { PublicHero } from '../../components/public/PublicHero'
import { PublicFooter } from '../../components/public/PublicFooter'
import { LanguageSelector } from '../../components/public/LanguageSelector'
import { LocalizedText } from '../../localization/LocalizedText'
import { useId, useRef } from 'react'
import type { DirectorySource } from './model'
import { useProfessionalDirectory } from './useProfessionalDirectory'
import { DirectoryResults } from './DirectoryResults'
import { DirectoryFilters } from './DirectoryFilters'
import { resultKind } from './directoryState'
import { statusMessage } from './DirectoryFeedback'

export function ProfessionalDirectoryPage({ source }: { source: DirectorySource }) {
  const { state, select, clear, retry } = useProfessionalDirectory(source)
  const directoryHeading = useRef<HTMLHeadingElement>(null)
  const headingId = useId()
  const heading = useRef<HTMLHeadingElement>(null)
  const recover = (action: () => void) => {
    heading.current?.focus()
    action()
  }
  return <>
    <a className="skip-link" href="#main-content"><LocalizedText messageKey="skip" /></a>
    <header className="site-header"><span className="wordmark">vegan<span>pro</span><span className="brand-dot">.</span></span><span className="prototype-label"><LocalizedText messageKey="prototype" /></span><LanguageSelector /></header>
    <main id="main-content">
      <PublicHero directoryId="professional-directory" onDiscover={() => directoryHeading.current?.focus()} />
      <h2 id="professional-directory" className="directory-heading" tabIndex={-1} ref={directoryHeading}><LocalizedText messageKey="directory.heading" /></h2>
      <DirectoryFilters selection={state.selection} options={state.options} onSelect={select} onClear={clear} />
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true"><LocalizedText messageKey={statusMessage(resultKind(state))} /></p>
      <section className="results-section" aria-labelledby={headingId}>
        <h2 id={headingId} ref={heading} tabIndex={-1}><LocalizedText messageKey="results.heading" /></h2>
        <div aria-busy={state.status === 'pending'}><DirectoryResults state={state} onClear={() => recover(clear)} onRetry={() => recover(retry)} /></div>
      </section>
    </main>
    <PublicFooter />
  </>
}
