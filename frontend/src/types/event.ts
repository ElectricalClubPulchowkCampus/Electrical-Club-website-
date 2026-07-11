import type { StrapiMeta, StrapiMedia } from './strapi'
import type { Venue } from './venue'
import type { Team } from './team'
import type { Registration } from './registration'
import type { Shift } from './Shift'
export type EventCategory = 'workshop' | 'seminar' | 'competition' | 'cultural' | 'sports' | 'other'
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'


export interface Event extends StrapiMeta {
  title?: string
  slug?: string
  description?: string
  summary?: string
  coverImage?: StrapiMedia | null
  gallery?: StrapiMedia[] | null // Schema defined multiple: false, behaves as singular media field
  startDate?: string // format: YYYY-MM-DD
  endDate?: string
  category?: EventCategory
  status_event?: EventStatus
  order?: number
  venue?: Venue | null
  organizer?: Team | null
  registrations?: Registration[] | null
  fee?: number | null
  shifts?: Shift[] | null // repeatable component
  galleryDriveLink:string
}