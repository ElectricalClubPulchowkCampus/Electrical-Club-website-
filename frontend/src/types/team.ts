import type { StrapiMeta } from './strapi'
import type { Member } from './member'

export type TeamCategory = 'Committee' | 'Sub-Committee'

export interface Team extends StrapiMeta {
  name?: string
  category?: TeamCategory
  order?: number
  committee_members?: Member[]
}
export interface TeamGroup {
  team: Team | null
  members: Member[]
}

export interface CategoryGroup {
  category: string
  teams: TeamGroup[]
}
