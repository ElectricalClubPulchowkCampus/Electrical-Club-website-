import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, User, Users } from 'lucide-react'
import { ProjectsService } from '../../../lib/services/projectService'
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from '../-constant'
import type { Project } from '../../../types/project'
import ProjectDetailSkeleton from './-components/ProjectDetailSkeleton'
import ProjectDetailErrorState from './-components/ProjectDetailErrorState'
import Gallery from '../../-components/Gallery'

export const Route = createFileRoute('/projects/$id/')({
  loader: async ({ params }) => {
    return await ProjectsService.getProjectById(params.id)
  },
  component: RouteComponent,
  pendingComponent: ProjectDetailSkeleton,
  errorComponent: ProjectDetailErrorState,
})

function RouteComponent() {
  const project = Route.useLoaderData() as Project
  
  const formattedStartDate = project.start_date
    ? new Date(project.start_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const formattedEndDate = project.end_date
    ? new Date(project.end_date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const team = [
    ...(project.leader ? [{ ...project.leader, isLeader: true }] : []),
    ...(project.members || []).map((m) => ({ ...m, isLeader: false })),
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={project.status_project === 'completed' ? '/projects/archive' : '/projects'}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {project.status_project === 'completed' ? 'Back to Completed Projects' : 'Back to Projects'}
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden mb-6">
            <img
              src={project.cover_img?.formats?.large?.url ? project.cover_img?.formats?.large?.url:project.cover_img?.url}
              alt={project.title || 'Project cover'}
              className="w-full h-56 sm:h-96 object-cover"
            />
          </div>

          {project.category && (
            <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary mb-3">
              {project.category}
            </span>
          )}

          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-6">{project.title}</h1>

          {project.description && (
            <div className="whitespace-pre-line text-foreground/90">
              {project.description}
            </div>
          )}

          <Gallery
            images={project.gallery}
            driveLink={project.galleryDriveLink}
            title={project.title}
          />
        </div>

        {/* Sidebar: project info + team */}
        <aside className="lg:sticky lg:top-8 rounded-2xl border border-border bg-card p-6 space-y-5">
          {project.status_project && (
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${STATUS_BADGE_CLASSES[project.status_project]}`}
            >
              {STATUS_LABELS[project.status_project]}
            </span>
          )}

          <div className="space-y-4 text-sm">
            {formattedStartDate && (
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-foreground font-medium">{formattedStartDate}</p>
                  {formattedEndDate && (
                    <p className="text-muted-foreground">Ends {formattedEndDate}</p>
                  )}
                </div>
              </div>
            )}

            {project.leader?.name && (
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-foreground">{project.leader.name}</p>
                  <p className="text-muted-foreground">Project Leader</p>
                </div>
              </div>
            )}

            {team.length > 0 && (
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                <p className="text-foreground">
                  {team.length} team member{team.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {team.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h2 className="text-sm font-semibold text-foreground mb-3">Team</h2>
              <ul className="space-y-2">
                {team.map((member, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{member.name}</span>
                    {member.isLeader && (
                      <span className="text-xs text-muted-foreground">Leader</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}