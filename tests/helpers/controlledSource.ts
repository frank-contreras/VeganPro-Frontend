import { deferred } from './deferred'
import type { DirectorySource, DirectoryView, Selection } from '../../src/features/professional-directory/model'

export function controlledSource() {
  const requests: Array<ReturnType<typeof deferred<DirectoryView>> & { selection: Selection }> = []
  const source: DirectorySource = {
    load: (selection) => {
      const request = { ...deferred<DirectoryView>(), selection: { ...selection } }
      requests.push(request)
      return request.promise
    },
  }
  return { source, requests }
}
