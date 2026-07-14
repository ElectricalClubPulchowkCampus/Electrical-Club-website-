import { eventsCollection } from '../strapiClient'
import type { Event } from '../../types/event'

export const EventsService = {
  async getAll(): Promise<Event[]> {
  const response = await eventsCollection.find({
    populate: {
      coverImage: true,
      venue: true,
      organizer: true,
    },
    sort: ['order:asc'],
  })
  return response.data as Event[]
},

async getEventById(id: string): Promise<Event | null> {
  const response = await eventsCollection.findOne(id, {
    populate: {
      coverImage: true,
      venue: true,
      organizer: true,
      shifts: {
        populate: {
          venue: true,
        
        },
      },
      gallery:true
    },
    sort: ['order:asc'],
  })
  return response.data as Event
},
async getEventBySlug(slug: string): Promise<Event | null> {
  const response = await eventsCollection.find({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      coverImage: true,
      venue: true,
      organizer: true,
      shifts: {
        populate: {
          venue: true,
        
        },
      },
      gallery:true
    },
    sort: ['order:asc'],
  })
  const events=response.data as Event[]
  if (!events.length) {
    throw new Error('Member not found')
  }
  return events[0] as Event
  
},

}