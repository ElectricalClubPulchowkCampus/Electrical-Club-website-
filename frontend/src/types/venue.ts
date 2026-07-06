import type { StrapiMeta, StrapiMedia } from './strapi'
import type { Event } from './event'
import type { Registration } from './registration'

export interface Venue extends StrapiMeta {
  name?: string
  address?: string
  maplink?: string
  capacity?: number
  image?: StrapiMedia[] // Schema specifies multiple: true array structure
  events?: Event[]
  registrations?: Registration[] // Assuming a registration type exists; adjust as necessary
}