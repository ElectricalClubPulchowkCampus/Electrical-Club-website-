import { Link } from "@tanstack/react-router";
import type { Event } from "../../../types/event";

interface EventCardProps {
  event: Event;
  isPast?: boolean;
}

const EventCard = ({ event, isPast = false }: EventCardProps) => {


  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <Link
        to="/events/$slug"
        params={{ slug:event.slug }}
        className="relative block h-48 w-full overflow-hidden"
      >
        <img
          src={event.coverImage?.formats?.small?.url}
          alt={event.title || "Event image"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Date */}
        {event.startDate && (
          <div className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm">
            {new Date(event.startDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}

        {/* Fee */}
        <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-md">
          {event.fee && event.fee > 0 ? `Rs. ${event.fee}` : "Free"}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <Link
              to="/events/$slug"
              params={{ slug: event.slug }}
              className="min-w-0"
            >
              <h3 className="line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {event.title}
              </h3>
            </Link>

            <Link
              to="/events/$slug"
              params={{ slug :   event.slug }}
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              View →
            </Link>
          </div>

          {event.summary && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {event.summary}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-4 w-4 shrink-0 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
            </svg>

            <span className="truncate">
              {event.venue?.name || "Location TBD"}
            </span>
          </div>
        </div>

        {isPast ? (
          <button
            disabled
            className="mt-6 w-full cursor-not-allowed rounded-xl bg-muted py-3 font-semibold text-muted-foreground"
          >
            Event Ended
          </button>
        ) : (
          <Link
            to="/events/$slug/register"
            params={{ slug: event.slug }}
            className="mt-6 block w-full rounded-xl bg-primary py-3 text-center font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg"
          >
            Register Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default EventCard;