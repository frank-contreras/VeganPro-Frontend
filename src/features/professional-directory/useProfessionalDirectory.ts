import { useEffect, useReducer } from 'react'
import { directoryReducer, initialState } from './directoryState'
import type { DirectorySource, Selection } from './model'

export function useProfessionalDirectory(source: DirectorySource) {
  const [state, dispatch] = useReducer(directoryReducer, initialState)
  const { revision, selection } = state

  useEffect(() => {
    let active = true
    // The wrapper catches both a source's synchronous throw and Promise rejection.
    void Promise.resolve().then(() => source.load(selection)).then(
      (view) => { if (active) dispatch({ type: 'success', revision, view }) },
      () => { if (active) dispatch({ type: 'failure', revision }) },
    )
    return () => { active = false }
  }, [source, revision, selection])

  return {
    state,
    select: (next: Selection) => dispatch({ type: 'select', selection: next }),
    clear: () => dispatch({ type: 'clear' }),
    retry: () => dispatch({ type: 'retry' }),
  }
}
