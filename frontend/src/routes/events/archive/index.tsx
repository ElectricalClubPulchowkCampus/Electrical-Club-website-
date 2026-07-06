import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { EventsService } from '../../../lib/services/eventService'
import { useFilteredEvents } from '../-hooks/useFilteredEvents'
import { EventFilters } from '../-components/EventFilters'
import { EventList } from '../-components/EventList'
import { EventsSkeleton } from '../-components/EventSkeleton'
import { EventsErrorState } from '../-components/EventErrorState'
import type { Event, EventCategory, EventStatus } from '../../../types/event'

export const Route = createFileRoute('/events/archive/')({
  loader: async () => {
    return await EventsService.getAll()
  },
  component: RouteComponent,
  pendingComponent: EventsSkeleton,
  errorComponent: EventsErrorState,
  pendingMs: 200,
})

function RouteComponent() {
  const events = Route.useLoaderData() as Event[]
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<EventCategory | 'all'>('all')
  const [status, setStatus] = useState<EventStatus | 'all'>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // "Past" = anything no longer upcoming/ongoing: completed or cancelled status,
  // falling back to startDate already having passed if status is missing.
  const pastEvents = useMemo(() => {
    const now = Date.now()
    return events.filter((e) => {
      if (e.status_event === 'completed' || e.status_event === 'cancelled') return true
      if (!e.status_event) {
        return e.startDate ? new Date(e.startDate).getTime() < now : false
      }
      return false
    })
  }, [events])

  const { filteredEvents, availableCategories, availableStatuses } = useFilteredEvents({
    events: pastEvents,
    search,
    category,
    status,
    sortOrder,
  })

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || status !== 'all'

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setStatus('all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Events
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl text-foreground">Past Events</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredEvents.length} of {pastEvents.length} archived event{pastEvents.length !== 1 ? 's' : ''}
        </p>
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
        onToggleSort={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        onClear={clearFilters}
      />

      <EventList events={filteredEvents} isPast />
    </div>
  )
}