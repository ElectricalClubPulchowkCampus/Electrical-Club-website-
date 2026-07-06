import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { ProjectsService } from '../../../lib/services/projectService'
import { useFilteredProjects } from '../-hooks/useFilteredProjects'
import { ProjectFilters } from '../-components/ProjectFilters'
import { ProjectList } from '../-components/ProjectList'
import { ProjectsSkeleton } from '../-components/ProjectSkeleton'
import { ProjectsErrorState } from '../-components/ProjectErrorState'
import type { Project, ProjectStatus } from '../../../types/project'

export const Route = createFileRoute('/projects/archive/')({
  loader: async () => {
    return await ProjectsService.getAll()
  },
  component: RouteComponent,
  pendingComponent: ProjectsSkeleton,
  errorComponent: ProjectsErrorState,
  pendingMs: 200,
})

function RouteComponent() {
  const projects = Route.useLoaderData() as Project[]
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | 'all'>('all')
  const [status, setStatus] = useState<ProjectStatus | 'all'>('all')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // "Past" = completed projects only.
  const pastProjects = useMemo(() => {
    return projects.filter((p) => p.status_project === 'completed')
  }, [projects])

  const { filteredProjects, availableCategories, availableStatuses } = useFilteredProjects({
    projects: pastProjects,
    search,
    category,
    status,
    sortOrder,
  })

  const hasActiveFilters = search.trim() !== '' || category !== 'all' || status !== 'all'

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setStatus('all')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Projects
      </Link>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl text-foreground">Completed Projects</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filteredProjects.length} of {pastProjects.length} completed project{pastProjects.length !== 1 ? 's' : ''}
        </p>
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
        onToggleSort={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        onClear={clearFilters}
      />

      <ProjectList projects={filteredProjects} />
    </div>
  )
}
