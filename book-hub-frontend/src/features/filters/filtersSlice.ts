// Placeholder for a Redux slice managing filters. Replace with @reduxjs/toolkit slice when using Redux.

export type FiltersState = {
  query: string
}

export const initialFiltersState: FiltersState = {
  query: '',
}

export function setQuery(state: FiltersState, q: string) {
  state.query = q
}

export default { initialFiltersState, setQuery }
