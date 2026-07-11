import type { Event } from './event'
import type { Registration } from './registration'
import type { Venue } from './venue'

export interface Shift {
  id: number
  documentId: string
  label: string
  startTime: string // format: HH:mm:ss.SSS
  endTime: string // format: HH:mm:ss.SSS
  capacity?: number | null
  event?: Event | null
  venue?: Venue | null
  registrations?: Registration[] | null
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

export interface ShiftCapacityResponse {
  capacity: number | null
  registered: number
  isFull: boolean
  spotsLeft: number | null
}