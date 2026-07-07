// Strapi v5 components are returned inline (no separate `data`/`attributes`
// wrapper) when populated as part of a parent entity.

export interface SocialLink {
  id: number
  platform: string // e.g. 'facebook' | 'instagram' | 'linkedin' | 'github' — tighten to a union if the field is an enum in Strapi
  url: string
}

export interface ClubPillar {
  id: number
  title: string
  description: string // adjust to `desc` if that's the actual field name in the component
}

export interface Faq {
  id: number
  question: string
  answer: string
}

export interface ClubSetting {
  id: number
  documentId: string
  hero_title: string
  about: string
  mission: string
  phoneNum: number
  Electrical_club_socials: SocialLink[]
  pillars: ClubPillar[]
  faqs: Faq[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}