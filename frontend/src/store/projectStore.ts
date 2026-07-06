import { create } from 'zustand'
import type { ProjectStatus } from '../types/project'

interface ProjectFilterState {
  search: string
  category: string | 'all'
  status: ProjectStatus | 'all'
  sortOrder: 'asc' | 'desc'
  setSearch: (value: string) => void
  setCategory: (value: string | 'all') => void
  setStatus: (value: ProjectStatus | 'all') => void
  toggleSortOrder: () => void
  clearFilters: () => void
}

// Mirrors `useEventFilterStore` — if that store persists filters, syncs with
// the URL, or has additional fields, bring the same behavior over here.
export const useProjectFilterStore = create<ProjectFilterState>((set) => ({
  search: '',
  category: 'all',
  status: 'all',
  sortOrder: 'asc',
  setSearch: (value) => set({ search: value }),
  setCategory: (value) => set({ category: value }),
  setStatus: (value) => set({ status: value }),
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' })),
  clearFilters: () => set({ search: '', category: 'all', status: 'all' }),
}))
