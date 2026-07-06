// services/blogService.ts
export interface BlogPost {
  id: string
  title: string
  date: string
  excerpt?: string
  author?: string
}

export const BlogService = {
  async getAll(): Promise<Event[]> {
      const response = await blogCollection.find({
        populate: {
          coverImage: true,
          venue: true,
          organizer: true,
        },
      })
  
      return response.data as Event[]
    },
}