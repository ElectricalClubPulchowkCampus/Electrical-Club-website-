import { useMemo } from 'react'
import type { Event, EventCategory, EventStatus } from '../../../types/event'

interface UseFilteredEventsParams {
  events: Event[]
  search: string
  category: EventCategory | 'all'
  status: EventStatus | 'all'
  sortOrder: 'asc' | 'desc'
}

export function useFilteredEvents({
  events,
  search,
  category,
  status,
  sortOrder,
}: UseFilteredEventsParams) {
  const availableCategories = useMemo(() => {
    const set = new Set(events.map((e) => e.category).filter(Boolean) as EventCategory[])
    return Array.from(set)
  }, [events])

  const availableStatuses = useMemo(() => {
    const set = new Set(events.map((e) => e.status_event).filter(Boolean) as EventStatus[])
    return Array.from(set)
  }, [events])

  const filteredEvents = useMemo(() => {
    let result = events

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.summary?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.name?.toLowerCase().includes(q) ||
          e.organizer?.name?.toLowerCase().includes(q)
      )
    }

    if (category !== 'all') {
      result = result.filter((e) => e.category === category)
    }

    if (status !== 'all') {
      result = result.filter((e) => e.status_event === status)
    }

    return [...result].sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate).getTime() : 0
      const bDate = b.startDate ? new Date(b.startDate).getTime() : 0
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate
    })
  }, [events, search, category, status, sortOrder])

  return { filteredEvents, availableCategories, availableStatuses }
}