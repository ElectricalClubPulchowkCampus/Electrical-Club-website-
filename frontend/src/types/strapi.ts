// Shared boilerplate metadata fields generated across all Strapi core types
export interface StrapiMeta {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt?: string | null
}

// Media type parsing Strapi's standard media object schemas
export interface StrapiMedia {
  id: number
  name: string
  alternativeText?: string | null
  caption?: string | null
  width?: number
  height?: number
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large: { url: string }
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl?: string | null
  provider: string
  createdAt: string
  updatedAt: string
}



// Component structure: "component": "shared.social-link"
export interface StrapiSocialLink {
  id: number
  platform: string
  url: string
}