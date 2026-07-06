import type { Project } from './project'
import type { StrapiMeta, StrapiMedia, StrapiSocialLink } from './strapi'
import type { Team } from './team'
export interface Member extends StrapiMeta {
  name: string
  phone_number: string // Typed string as database bigintegers reliably bypass standard JS limits
  profile_pic?: StrapiMedia | null
  quote?: string
  role?: string
  rollNumber?: string
  email?: string
  order: number
  socialLinks?: StrapiSocialLink[]
  team?: Team | null
  about?: string
  primaryFocus?: string
  clubContribution?: string
  projects?: Project[];
  led_projects:Project[];
  slug:string;
}