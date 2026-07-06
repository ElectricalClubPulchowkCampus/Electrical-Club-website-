import type { Member } from '../types/member'
import type { TeamGroup, CategoryGroup } from '../types/team'

const UNASSIGNED_CATEGORY = 'Unassigned'
const UNASSIGNED_TEAM_KEY = 'unassigned'

export function groupAndSortByTeam(members: Member[]): CategoryGroup[] {
  // Step 1: group by category -> team
  const categoryMap = new Map<string, Map<string, TeamGroup>>()

  for (const member of members) {
    const team = member.team
    const categoryKey = team?.category ?? UNASSIGNED_CATEGORY
    const teamKey = team ? String(team.id) : UNASSIGNED_TEAM_KEY

    if (!categoryMap.has(categoryKey)) {
      categoryMap.set(categoryKey, new Map())
    }
    const teamMap = categoryMap.get(categoryKey)!

    if (!teamMap.has(teamKey)) {
      teamMap.set(teamKey, { team: team ?? null, members: [] })
    }
    teamMap.get(teamKey)!.members.push(member)
  }

  // Step 2: sort members within each team
  for (const teamMap of categoryMap.values()) {
    for (const group of teamMap.values()) {
      group.members.sort((a, b) => a.order - b.order)
    }
  }

  // Step 3: build CategoryGroup[], sorting teams within category by order
  const categoryGroups: CategoryGroup[] = Array.from(categoryMap.entries()).map(
    ([category, teamMap]) => {
      const teams = Array.from(teamMap.values()).sort((a, b) => {
        const orderA = a.team?.order ?? Infinity
        const orderB = b.team?.order ?? Infinity
        return orderA - orderB
      })
      return { category, teams }
    }
  )

  // Step 4: sort categories alphabetically, Unassigned always last
  categoryGroups.sort((a, b) => {
    if (a.category === UNASSIGNED_CATEGORY) return 1
    if (b.category === UNASSIGNED_CATEGORY) return -1
    return a.category.localeCompare(b.category)
  })

  return categoryGroups
}