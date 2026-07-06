import { useMemo } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ProjectsService } from '../../lib/services/projectService'
import { useProjectFilterStore } from '../../store/projectStore'
import { useFilteredProjects } from './-hooks/useFilteredProjects'
import { ProjectFilters } from './-components/ProjectFilters'
import { ProjectList } from './-components/ProjectList'
import { ProjectsSkeleton } from './-components/ProjectSkeleton'
import { ProjectsErrorState } from './-components/ProjectErrorState'
import type { Project } from '../../types/project'

export const Route = createFileRoute('/projects/')({
  loader: async () => {
    return await ProjectsService.getAll()
  },
  component: RouteComponent,
  pendingComponent: ProjectsSkeleton,
  errorComponent: ProjectsErrorState,
  pendingMs: 200,
})

function RouteComponent() {
  const allProjects = Route.useLoaderData() as Project[]

  // Only planned/in-progress projects belong here — completed ones live in
  // the /projects/archive page instead.
  const projects = useMemo(() => {
    return allProjects.filter((p) => p.status_project !== 'completed')
  }, [allProjects])

  const {
    search,
    category,
    status,
    sortOrder,
    setSearch,
    setCategory,
    setStatus,
    toggleSortOrder,
    clearFilters,
  } = useProjectFilterStore()

  const { filteredProjects, availableCategories, availableStatuses } = useFilteredProjects({
    projects,
    search,
    category,
    status,
    sortOrder,
  })

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || status !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 sm:mb-8 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl text-foreground">Active Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/projects/archive"
          className="text-sm font-medium text-primary hover:text-primary/80 underline transition-colors whitespace-nowrap"
        >
          View completed projects →
        </Link>
      </div>

      <ProjectFilters
        search={search}
        category={category}
        status={status}
        sortOrder={sortOrder}
        availableCategories={availableCategories}
        availableStatuses={availableStatuses}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onToggleSort={toggleSortOrder}
        onClear={clearFilters}
      />

      <ProjectList projects={filteredProjects} />
    </div>
  )
}
