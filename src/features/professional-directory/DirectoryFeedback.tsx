import type { resultKind } from './directoryState'
import type { MessageKey } from '../../localization/messages'
import { LocalizedText } from '../../localization/LocalizedText'

type Kind = ReturnType<typeof resultKind>
const statusKeys = {
  pending: 'status.pending', populated: 'status.populated', empty: 'status.empty',
  'no-matches': 'status.noMatches', error: 'status.error',
} satisfies Record<Kind, MessageKey>
export function statusMessage(kind: Kind) { return statusKeys[kind] }
export function DirectoryFeedback({ kind, onClear, onRetry }: {
  kind: Kind; onClear: () => void; onRetry: () => void
}) {
  return <div className="feedback">
    <span className="feedback-symbol" aria-hidden="true">{kind === 'pending' ? '◌' : '✳'}</span>
    <h3><LocalizedText messageKey={statusMessage(kind)} /></h3>
    {kind === 'empty' && <p><LocalizedText messageKey="feedback.empty" /></p>}
    {kind === 'no-matches' && <><p><LocalizedText messageKey="feedback.noMatches" /></p><button type="button" onClick={onClear}><LocalizedText messageKey="feedback.clear" /></button></>}
    {kind === 'error' && <><p><LocalizedText messageKey="feedback.error" /></p><button type="button" onClick={onRetry}><LocalizedText messageKey="feedback.retry" /></button></>}
    {kind === 'pending' && <p><LocalizedText messageKey="feedback.pending" /></p>}
  </div>
}
