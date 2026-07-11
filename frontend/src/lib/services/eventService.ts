import { eventsCollection } from '../strapiClient'
import type { Event } from '../../types/event'

export const EventsService = {
  async getAll(): Promise<Event[]> {
    const response = await eventsCollection.find({
      populate: {
        coverImage: true,
        venue: true,
        organizer: true,
        shifts:true
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
        shifts:true
      },
      sort: ['order:asc'],
    })

    return response.data as Event
  }

}