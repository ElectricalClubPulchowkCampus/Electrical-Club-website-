import { Link } from "@tanstack/react-router";
import { STATUS_BADGE_CLASSES } from "../-constant";
import { STATUS_LABELS } from "../-constant";
import type { Project } from "../../../types/project";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const imageUrl = project?.cover_img?.formats?.large?.url
    ? `${baseUrl}${project.cover_img.formats.large.url}`
    : project?.cover_img?.url
      ? `${baseUrl}${project.cover_img.url}`
      : "/default-project.png";

  const memberCount =
    (project.members?.length || 0) + (project.leader ? 1 : 0);

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <Link
        to="/projects/$id/"
        params={{ id: project.documentId }}
        className="relative block h-48 w-full overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={project.title || "Project cover"}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Start date */}
        {project.start_date && (
          <div className="absolute left-4 top-4 rounded-full bg-card/95 px-3 py-1 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm">
            {new Date(project.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        )}

        {/* Status */}
        <div
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold shadow-md ${STATUS_BADGE_CLASSES[project.status_project]}`}
        >
          {STATUS_LABELS[project.status_project]}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-3 flex items-start justify-between gap-3">
            <Link
              to="/projects/$id"
              params={{ id: project.documentId }}
              className="min-w-0"
            >
              <h3 className="line-clamp-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {project.title}
              </h3>
            </Link>

            <Link
              to="/projects/$id"
              params={{ id: project.documentId }}
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              View →
            </Link>
          </div>

          {project.category && (
            <span className="inline-block mb-3 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {project.category}
            </span>
          )}

          {project.description && (
            <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg
              className="h-4 w-4 shrink-0 text-primary"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>

            <span className="truncate">
              {project.leader?.name
                ? `Led by ${project.leader.name}`
                : "Leader TBD"}
              {memberCount > 0 ? ` · ${memberCount} member${memberCount !== 1 ? "s" : ""}` : ""}
            </span>
          </div>
        </div>

        <Link
          to="/projects/$id"
          params={{ id: project.documentId }}
          className="mt-6 block w-full rounded-xl bg-primary py-3 text-center font-semibold text-primary-foreground transition-all duration-300 hover:bg-accent hover:shadow-lg"
        >
          View Project
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
