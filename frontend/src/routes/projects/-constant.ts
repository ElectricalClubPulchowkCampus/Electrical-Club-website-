import type { ProjectStatus } from '../../types/project'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: 'Planned',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

// Used to color-code status badges consistently across the card, filters,
// and detail page.
export const STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  planned: 'bg-muted text-foreground',
  'in-progress': 'bg-primary/10 text-primary',
  completed: 'bg-green-500/10 text-green-600',
}
