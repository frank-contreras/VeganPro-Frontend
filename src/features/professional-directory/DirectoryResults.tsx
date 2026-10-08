import { useLocale } from '../../localization/LocaleProvider'
import type { DirectoryState } from './directoryState'
import { resultKind } from './directoryState'
import { ProfessionalCard } from './ProfessionalCard'
import { DirectoryFeedback } from './DirectoryFeedback'

export function DirectoryResults({ state, onClear, onRetry }: {
  state: DirectoryState; onClear: () => void; onRetry: () => void
}) {
  const { message } = useLocale()
  const label = message('results.label')
  const kind = resultKind(state)
  if (state.status === 'success' && kind === 'populated') {
    return <ul className="professional-list" aria-label={label.text} lang={label.language}>
      {state.view.professionals.map((professional) => <li key={professional.key}>
        <ProfessionalCard professional={professional} />
      </li>)}
    </ul>
  }
  return <DirectoryFeedback kind={kind} onClear={onClear} onRetry={onRetry} />
}
