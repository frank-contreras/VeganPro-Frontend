import type { MessageKey } from './messages'
import { useLocale } from './LocaleProvider'

export function LocalizedText({ messageKey }: { messageKey: MessageKey }) {
  const { message } = useLocale()
  const resolved = message(messageKey)
  return <span lang={resolved.language}>{resolved.text}</span>
}
