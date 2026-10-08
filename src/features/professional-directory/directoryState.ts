import { defaultSelection, hasFilters, type DirectoryOptions, type DirectoryView, type Selection } from './model'

interface BaseState {
  selection: Selection
  revision: number
  options?: DirectoryOptions
}
export type DirectoryState = BaseState & (
  | { status: 'pending' }
  | { status: 'error' }
  | { status: 'success'; view: DirectoryView }
)
export type DirectoryAction =
  | { type: 'select'; selection: Selection }
  | { type: 'clear' }
  | { type: 'retry' }
  | { type: 'success'; revision: number; view: DirectoryView }
  | { type: 'failure'; revision: number }

export const initialState: DirectoryState = {
  selection: defaultSelection, revision: 0, status: 'pending',
}

function begin(state: DirectoryState, selection: Selection): DirectoryState {
  return { selection, revision: state.revision + 1, options: state.options, status: 'pending' }
}

export function directoryReducer(state: DirectoryState, action: DirectoryAction): DirectoryState {
  switch (action.type) {
    case 'select':
      if (state.selection.category === action.selection.category && state.selection.affiliation === action.selection.affiliation) return state
      return begin(state, action.selection)
    case 'clear':
      return hasFilters(state.selection) ? begin(state, defaultSelection) : state
    case 'retry':
      return begin(state, state.selection)
    case 'success':
      if (action.revision !== state.revision || state.status !== 'pending') return state
      return { ...state, status: 'success', options: action.view.options, view: action.view }
    case 'failure':
      if (action.revision !== state.revision || state.status !== 'pending') return state
      return { ...state, status: 'error' }
  }
}

export function resultKind(state: DirectoryState) {
  if (state.status !== 'success') return state.status
  if (state.view.professionals.length) return 'populated'
  return hasFilters(state.selection) ? 'no-matches' : 'empty'
}
