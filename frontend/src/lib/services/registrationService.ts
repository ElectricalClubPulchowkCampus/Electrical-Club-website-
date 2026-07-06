import { registrationsCollection } from '../strapiClient'
import type { RegistrationInput } from '../../types/registration'
import type { EventCapacity } from '../../types/registration'
import { STRAPI_URL, extractErrorMessage } from '../httphelper'

export const RegistrationService = {
  async register(payload: RegistrationInput, opts: { signal?: AbortSignal } = {}) {
    try {
      // NOTE: pass opts.signal through here if `registrationsCollection.create`
      // supports a second options argument (check your Strapi client SDK's signature).
      // If it doesn't, requests won't be cancellable and this is a no-op — harmless.
      const response = await registrationsCollection.create(payload, opts as never)
      return response.data
    } catch (error) {
      if (opts.signal?.aborted) {
        throw error // let AbortError propagate as-is so callers can detect cancellation
      }
      const message = await extractErrorMessage(error, 'Registration failed.')
      throw new Error(message)
    }
  },

  async registerForEvent(eventId: string, payload: RegistrationInput, opts: { signal?: AbortSignal } = {}) {
    return this.register(
      {
        ...payload,
        event: eventId,
      },
      opts
    )
  },

  async getEventCapacity(eventId: string, opts: { signal?: AbortSignal } = {}): Promise<EventCapacity> {
    const res = await fetch(`${STRAPI_URL}/events/${eventId}/capacity`, { signal: opts.signal })

    if (!res.ok) {
      const message = await extractErrorMessage({ response: res }, 'Failed to fetch event capacity.')
      throw new Error(message)
    }

    return res.json()
  },
}