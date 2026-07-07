import { strapi } from '@strapi/client'

// For SSR: use server-side env var, for client: use build-time env var
const isServer = typeof window === 'undefined'
const baseURL =
  import.meta.env.VITE_STRAPI_URL

export const strapiClient = strapi({
  baseURL,
  auth: import.meta.env.VITE_STRAPI_AUTH_TOKEN,
})



export const membersCollection = strapiClient.collection('members')
export const teamsCollection = strapiClient.collection('teams')
export const eventsCollection = strapiClient.collection('events')
export const venuesCollection = strapiClient.collection('venues')
export const projectsCollection= strapiClient.collection('projects')
export const registrationsCollection = strapiClient.collection('registrations')
export const blogCollection=strapiClient.collection('blog')
export const settingSingle = strapiClient.single('setting')
export const clubSettingSingle= strapiClient.single('club-setting')