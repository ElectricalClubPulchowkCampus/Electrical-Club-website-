import { membersCollection } from '../strapiClient'
import type { Member } from '../../types/member'
// shared position order 
export const POSITION_ORDER: Record<string, number> = {
  'President': 1,
  'Vice President': 2,
  'Secretary': 3,
  'Treasurer': 4,
  'Deputy Secretary': 5,
  'Member': 10,
}

// top positions./collections/membersCollectio
export const TOP_POSITIONS = [
  'President',
  'Vice President',
  'Secretary',
  'Treasurer',
  'Deputy Secretary',
]

export const MemberService = {
  async getMembers() {
    // Pass the query configuration object containing your populate rules
    const response = await membersCollection.find({
      populate: {
        profile_pic: true,
        team: true,
        socialLinks: true,
        
      }

    })
    
    const members = response.data as Member[]
    return members
  },
  async getMemberById(id: string) {
  const response = await membersCollection.findOne(id, {
    populate: {
      profile_pic: true,
      team: true,
      socialLinks: true,
      projects: {
        populate: {
          cover_img: true,
          leader:true,
          members:true
        },
      },
      led_projects: {
        populate: {
          cover_img: true,
          leader:true,
          members:true
        },
      },
    },
  });
    const member = response.data as Member | null
    return member
  },
  async getMemberBySlug(slug: string) {
  const response = await membersCollection.find({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      profile_pic: true,
      team: true,
      socialLinks: true,
      projects: {
        populate: {
          cover_img: true,
          leader: true,
          members: true
        },
      },
      led_projects: {
        populate: {
          cover_img: true,
          leader: true,
          members: true
        },
      },
    },
  });

  const members = response.data as Member[]
  if (!members.length) {
    throw new Error('Member not found')
  }
  return members[0]
}
}