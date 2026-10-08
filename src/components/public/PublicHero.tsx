import { LocalizedText } from '../../localization/LocalizedText'

export function PublicHero({ directoryId, onDiscover }: { directoryId: string; onDiscover: () => void }) {
  return <section className="intro" aria-labelledby="directory-title">
    <p className="eyebrow"><LocalizedText messageKey="hero.eyebrow" /></p>
    <h1 id="directory-title"><LocalizedText messageKey="hero.title" /></h1>
    <p className="intro-description"><LocalizedText messageKey="hero.description" /></p>
    <a className="discovery-action" href={`#${directoryId}`} onClick={onDiscover}><LocalizedText messageKey="hero.action" /><span aria-hidden="true"> ↗</span></a>
    <p className="sample-notice"><strong><LocalizedText messageKey="sample.title" /></strong> <LocalizedText messageKey="sample.disclosure" /></p>
  </section>
}
