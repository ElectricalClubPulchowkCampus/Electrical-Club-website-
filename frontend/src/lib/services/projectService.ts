import type { Project } from '../../types/project'

const baseUrl = import.meta.env.VITE_BACKEND_URL

// Mirrors the shape of `EventsService` — adjust the populate/query params
// below to match whatever your actual EventsService sends to Strapi
// (e.g. specific field selection, pagination, sort order).
export const ProjectsService = {
  async getAll(): Promise<Project[]> {
    const res = await fetch(
      `${baseUrl}/api/projects?populate[leader]=true&populate[members]=true&populate[cover_img]=true`
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch projects (${res.status})`)
    }
    const json = await res.json()
    return json.data as Project[]
  },

  async getProjectById(id: string): Promise<Project> {
    const res = await fetch(
      `${baseUrl}/api/projects/${id}?populate[leader]=true&populate[members]=true&populate[cover_img]=true`
    )
    if (!res.ok) {
      throw new Error(`Failed to fetch project (${res.status})`)
    }
    const json = await res.json()
    return json.data as Project
  },
}
