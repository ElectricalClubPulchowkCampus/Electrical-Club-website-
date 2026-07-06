import { useMemo } from 'react'
import type { Project, ProjectStatus } from '../../../types/project'

interface UseFilteredProjectsParams {
  projects: Project[]
  search: string
  category: string | 'all'
  status: ProjectStatus | 'all'
  sortOrder: 'asc' | 'desc'
}

export function useFilteredProjects({
  projects,
  search,
  category,
  status,
  sortOrder,
}: UseFilteredProjectsParams) {
  const availableCategories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category).filter(Boolean) as string[])
    return Array.from(set)
  }, [projects])

  const availableStatuses = useMemo(() => {
    const set = new Set(projects.map((p) => p.status_project).filter(Boolean) as ProjectStatus[])
    return Array.from(set)
  }, [projects])

  const filteredProjects = useMemo(() => {
    let result = projects

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.leader?.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      )
    }

    if (category !== 'all') {
      result = result.filter((p) => p.category === category)
    }

    if (status !== 'all') {
      result = result.filter((p) => p.status_project === status)
    }

    return [...result].sort((a, b) => {
      const aDate = a.start_date ? new Date(a.start_date).getTime() : 0
      const bDate = b.start_date ? new Date(b.start_date).getTime() : 0
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate
    })
  }, [projects, search, category, status, sortOrder])

  return { filteredProjects, availableCategories, availableStatuses }
}
