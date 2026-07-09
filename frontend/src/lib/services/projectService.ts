import { projectsCollection } from '../strapiClient'
import type { Project } from '../../types/project'

export const ProjectsService = {
  async getAll(): Promise<Project[]> {
    const response = await projectsCollection.find({
      populate: {
        leader: true,
        members: true,
        cover_img: true,
      },
      
    })

    return response.data as Project[]
  },

  async getProjectById(id: string): Promise<Project | null> {
    const response = await projectsCollection.findOne(id, {
      populate: {
        leader: true,
        members: true,
        cover_img: true,
      },
    })

    return response.data as Project
  },
}