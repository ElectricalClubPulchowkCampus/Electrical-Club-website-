import { createFileRoute, Link } from '@tanstack/react-router'
  import { ArrowLeft, MapPin, CalendarDays, User, Users, ExternalLink, Wallet, Clock } from 'lucide-react'
  import { EventsService } from '../../../lib/services/eventService'
  import { CATEGORY_LABELS, STATUS_LABELS } from '../-constant'
  import type { Event } from '../../../types/event'
import EventDetailSkeleton from './-components/EventDetailSkeleton'
import EventDetailErrorState from './-components/EventDetailErrorState'
import Gallery from '../../-components/Gallery'

  export const Route = createFileRoute('/events/$id/')({
    loader: async ({ params }) => {
      return await EventsService.getEventById(params.id)
    },
    component: RouteComponent,
    pendingComponent: EventDetailSkeleton,
    errorComponent: EventDetailErrorState,
  })

  function isPastEvent(event: Event) {
    if (event.status_event === 'completed' || event.status_event === 'cancelled') return true
    if (!event.status_event) {
      return event.startDate ? new Date(event.startDate).getTime() < Date.now() : false
    }
    return false
  }

  // Formats a Strapi "time" string (HH:mm:ss.SSS) into a readable 12-hour time
  function formatTime(time?: string) {
    if (!time) return null
    const [hoursStr, minutesStr] = time.split(':')
    const hours = Number(hoursStr)
    const minutes = Number(minutesStr)
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  function RouteComponent() {
    const event = Route.useLoaderData() as Event


    const past = isPastEvent(event)

    const formattedDate = event.startDate
      ? new Date(event.startDate).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      : null


    const sameDay =
      event.startDate &&
      event.endDate &&
      new Date(event.startDate).toDateString() === new Date(event.endDate).toDateString()

   
    const formattedEndDate =
      event.endDate && !sameDay
        ? new Date(event.endDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : null

    const shifts = event.shifts?? []

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to={past ? '/events/archive' : '/events'}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {past ? 'Back to Past Events' : 'Back to Events'}
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden mb-6">
              <img
                src={event.coverImage?.url}
                alt={event.title || 'Event image'}
                className="w-full h-56 sm:h-96 object-cover"
              />
            </div>

            {event.category && (
              <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-3">
                {CATEGORY_LABELS[event.category]}
              </span>
            )}

            <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-6">{event.title}</h1>

            {event.description && (
  <div className="whitespace-pre-line text-foreground/90">
    {event.description}
  </div>
)}

            <Gallery
              images={event.gallery}
              driveLink={event.galleryDriveLink}
              title={event.title}
            />
          </div>

          {/* Sidebar: event info + registration */}
          <aside className="lg:sticky lg:top-8 rounded-2xl border border-border bg-card p-6 space-y-5">
            {event.status_event && (
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-muted text-foreground">
                {STATUS_LABELS[event.status_event]}
              </span>
            )}

            <div className="space-y-4 text-sm">
              {formattedDate && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-foreground font-medium">{formattedDate}</p>
                    
                     
                    {formattedEndDate && (
                      <p className="text-muted-foreground">Ends {formattedEndDate}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-foreground">{event.venue?.name || 'Location TBD'}</p>
                  {event.venue?.address && (
                    <p className="text-muted-foreground">{event.venue.address}</p>
                  )}
                  {event.venue?.maplink && (
                    <a href={event.venue.maplink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 mt-0.5">

                      View on map <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wallet className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <p className="text-foreground">
                  {event.fee && event.fee > 0 ? `Rs. ${event.fee}` : 'Free'}
                </p>
              </div>

              {(typeof event.venue?.capacity === 'number' || event.registrations?.length) ? (
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <p className="text-foreground">
                    {typeof event.venue?.capacity === 'number' && event.registrations
                      ? `${event.registrations.length} of ${event.venue.capacity} registered`
                      : typeof event.venue?.capacity === 'number'
                      ? `Capacity: ${event.venue.capacity}`
                      : `${event.registrations?.length} registered`}
                  </p>
                </div>
              ) : null}

              {event.organizer?.name && (
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-foreground">{event.organizer.name}</p>
                    {event.organizer.category && (
                      <p className="text-muted-foreground">{event.organizer.category}</p>
                    )}
                  </div>
                </div>
              )}

              {shifts.length > 0 && (
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <p className="text-foreground font-medium">
                      {shifts.length > 1 ? 'Schedule' : 'Timing'}
                    </p>
                    {shifts.map((shift, index) => {
                      const start = formatTime(shift.startTime)
                      const end = formatTime(shift.endTime)
                      return (
                        <div
                          key={shift.id ?? index}
                          className={
                            shifts.length > 1
                              ? 'pb-3 border-b border-border last:border-0 last:pb-0'
                              : ''
                          }
                        >
                          <p className="text-foreground">
                            {shift.label || `Shift ${index + 1}`}
                          </p>
                          {(start || end) && (
                            <p className="text-muted-foreground">
                              {start}
                              {start && end && ' – '}
                              {end}
                            </p>
                          )}
                          {shift.venue?.name && (
                            <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              {shift.venue.name}
                            </p>
                          )}
                          {typeof shift.capacity === 'number' && (
                            <p className="text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Users className="h-3 w-3 flex-shrink-0" />
                              Capacity: {shift.capacity}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              {past ? (
                <button
                  disabled
                  className="w-full mt-4 bg-muted text-muted-foreground font-semibold py-2.5 rounded-lg cursor-not-allowed"
                >
                  Event Ended
                </button>
              ) : (
                <Link
                  to="/events/$id/register"
                  params={{ id: event.documentId }}
                  className="block w-full mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
                >
                  Register Now
                </Link>
              )}
            </div>
          </aside>
        </div>
      </div>
    )
  }