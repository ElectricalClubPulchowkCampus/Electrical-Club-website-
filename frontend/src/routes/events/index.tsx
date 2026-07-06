import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { EventsService } from '../../lib/services/eventService'
import { useEventFilterStore } from '../../store/eventStore'
import { useFilteredEvents } from './-hooks/useFilteredEvents'
import { EventFilters } from './-components/EventFilters'
import { EventList } from './-components/EventList'
import { EventsSkeleton } from './-components/EventSkeleton'
import { EventsErrorState } from './-components/EventErrorState'
import type { Event } from '../../types/event'

export const Route = createFileRoute('/events/')({
  loader: async () => {
    return await EventsService.getAll()
  },
  component: RouteComponent,
  pendingComponent: EventsSkeleton,
  errorComponent: EventsErrorState,
  pendingMs: 200,
})

function RouteComponent() {
  const allEvents = Route.useLoaderData() as Event[]

  // Only upcoming/ongoing events belong here — completed and cancelled
  // ones live in the /events/archive page instead.
  const events = useMemo(() => {
    const now = Date.now()
    return allEvents.filter((e) => {
      if (e.status_event === 'completed' || e.status_event === 'cancelled') return false
      if (!e.status_event) {
        return e.startDate ? new Date(e.startDate).getTime() >= now : true
      }
      return true
    })
  }, [allEvents])

  const {
    search,
    category,
    status,
    sortOrder,
    setSearch,
    setCategory,
    setStatus,
    toggleSortOrder,
    clearFilters,
  } = useEventFilterStore()

  const { filteredEvents, availableCategories, availableStatuses } = useFilteredEvents({
    events,
    search,
    category,
    status,
    sortOrder,
  })

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || status !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 sm:mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground">Upcoming Events</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredEvents.length} of {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/events/archive"
          className="text-sm font-medium text-primary hover:text-primary/80 underline transition-colors whitespace-nowrap"
        >
          View past events →
        </Link>
      </div>

      <EventFilters
        search={search}
        category={category}
        status={status}
        sortOrder={sortOrder}
        availableCategories={availableCategories}
        availableStatuses={availableStatuses}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onToggleSort={toggleSortOrder}
        onClear={clearFilters}
      />

      <EventList events={filteredEvents} />
    </div>
  )
}