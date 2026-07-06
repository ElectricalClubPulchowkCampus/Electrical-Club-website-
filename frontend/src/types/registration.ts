import type { Event } from './event'
import type { Venue } from '../types/venue'

export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Registration {
  id: number
  documentId: string
  fullName: string
  email: string
  phone?: number
  Institution?: string
  rollNumber?: string
  notes?: string
  status_registration?: RegistrationStatus
  event?: Event
  venue?: Venue
  createdAt?: string
  updatedAt?: string
  publishedAt?: string
}

// Shape for creating a registration (POST payload) — relations are passed
// as ids/documentIds rather than the full expanded objects above.
export interface RegistrationInput {
  fullName: string
  email: string
  phone?: number
  Institution?: string
  rollNumber?: string
  notes?: string
  event?: string
  venue?: string
  // Numeric id of the uploaded file (from Strapi's /upload endpoint),
  // linked to the `payment` media relation field on the Registration content type.
  payment?: number
}

export interface EventCapacity {
  capacity: number
  registered: number
  isFull: boolean
}