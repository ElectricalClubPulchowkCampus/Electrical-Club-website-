import type { Member } from "../../../../types/member";
import { Link } from "@tanstack/react-router";
import ProjectCard from "../../../projects/-components/ProjectCard";

interface ProjectsSectionProps {
  member: Member;
}

const ProjectsSection = ({ member }: ProjectsSectionProps) => {
  // Both are now arrays because a member can lead multiple projects
  const ledProjects = member.led_projects || [];
  const joinedProjects = member.projects || [];

  const hasNoProjects = ledProjects.length === 0 && joinedProjects.length === 0;

  return (
    <section className="mt-12 space-y-10">
      {/* Top Header Section */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-foreground">
          Project Involvement
        </h2>
        <Link
          to="/projects"
          className="text-primary font-semibold underline hover:text-primary/80 transition-colors"
        >
          All Projects →
        </Link>
      </div>

      {hasNoProjects ? (
        <p className="text-muted-foreground">No project involvements found.</p>
      ) : (
        <div className="space-y-10">
          
          {/* 1. Led Initiatives (Maps beautifully over multiple items now) */}
          {ledProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                👑 Led Initiatives ({ledProjects.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {ledProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* 2. Contributed Projects */}
          {joinedProjects.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                🤝 Contributed Projects ({joinedProjects.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {joinedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
          
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;