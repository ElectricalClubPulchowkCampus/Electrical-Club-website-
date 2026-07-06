// services/galleryService.ts
export interface GalleryItem {
  id: string
  title: string
  imageUrl: string
  description?: string
}

export const GalleryService = {
  getAll: async (): Promise<GalleryItem[]> => {
    const res = await fetch('https://api.example.com/gallery')

    if (!res.ok) {
      // The error thrown here will be caught by TanStack Router's errorComponent
      throw new Error(`Failed to fetch gallery items: ${res.statusText}`)
    }

    return res.json()
  },
}