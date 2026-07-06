    import type { EventCategory, EventStatus } from '../../types/event'

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  workshop: 'Workshop',
  seminar: 'Seminar',
  competition: 'Competition',
  cultural: 'Cultural',
  sports: 'Sports',
  other: 'Other',
}

export const STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
}