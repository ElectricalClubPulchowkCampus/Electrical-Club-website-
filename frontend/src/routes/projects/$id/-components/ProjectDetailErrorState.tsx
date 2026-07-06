import { Link } from '@tanstack/react-router'

export default function ProjectDetailErrorState({ error }: { error: Error }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="p-5 border rounded-lg max-w-2xl mx-auto bg-destructive/10 border-destructive/30 shadow-sm">
        <h3 className="font-bold text-xl text-destructive tracking-tight">
          Could not load this project
        </h3>
        <p className="text-sm mt-1 text-foreground/80">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <Link
          to="/projects"
          className="inline-block mt-4 text-sm font-medium text-primary hover:text-primary/80 underline"
        >
          Back to Projects
        </Link>
      </div>
    </div>
  )
}
