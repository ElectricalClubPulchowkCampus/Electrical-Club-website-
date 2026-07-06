    // store/useEventFilterStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EventCategory, EventStatus } from '../types/event'
interface EventFilterState {
  search: string
  category: EventCategory | 'all'
  status: EventStatus | 'all'
  sortOrder: 'asc' | 'desc'
  setSearch: (search: string) => void
  setCategory: (category: EventCategory | 'all') => void
  setStatus: (status: EventStatus | 'all') => void
  setSortOrder: (order: 'asc' | 'desc') => void
  toggleSortOrder: () => void
  clearFilters: () => void
}

const initialState = {
  search: '',
  category: 'all' as const,
  status: 'all' as const,
  sortOrder: 'asc' as const,
}

export const useEventFilterStore = create<EventFilterState>()(
  persist(
    (set) => ({
      ...initialState,
      setSearch: (search) => set({ search }),
      setCategory: (category) => set({ category }),
      setStatus: (status) => set({ status }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      toggleSortOrder: () =>
        set((s) => ({ sortOrder: s.sortOrder === 'asc' ? 'desc' : 'asc' })),
      clearFilters: () => set(initialState),
    }),
    {
      name: 'event-filters', // localStorage key
    }
  )
)