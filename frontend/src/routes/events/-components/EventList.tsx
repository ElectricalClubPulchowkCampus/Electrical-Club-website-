import EventCard from './EventCard'
import type { Event } from '../../../types/event'

interface EventListProps {
  events: Event[]
  isPast?: boolean
}

export function EventList({ events, isPast = false }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-16 border-t border-border">
        <p className="text-foreground font-medium">No events found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try a different search term or clear your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} isPast={isPast} />
      ))}
    </div>
  )
}