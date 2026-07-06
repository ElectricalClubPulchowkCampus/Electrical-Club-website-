import ProjectCard from './ProjectCard'
import type { Project } from '../../../types/project'

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 border-t border-border">
        <p className="text-foreground font-medium">No projects found</p>
        <p className="text-sm text-muted-foreground mt-1">
          Try a different search term or clear your filters.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
