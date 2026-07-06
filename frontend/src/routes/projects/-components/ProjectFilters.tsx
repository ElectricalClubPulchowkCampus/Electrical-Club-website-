import { Search, X, ArrowUpDown } from 'lucide-react'
import { STATUS_LABELS } from '../-constant'
import type { ProjectStatus } from '../../../types/project'

interface ProjectFiltersProps {
  search: string
  category: string | 'all'
  status: ProjectStatus | 'all'
  sortOrder: 'asc' | 'desc'
  availableCategories: string[]
  availableStatuses: ProjectStatus[]
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string | 'all') => void
  onStatusChange: (value: ProjectStatus | 'all') => void
  onToggleSort: () => void
  onClear: () => void
}

export function ProjectFilters({
  search,
  category,
  status,
  sortOrder,
  availableCategories,
  availableStatuses,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onToggleSort,
  onClear,
}: ProjectFiltersProps) {
  return (
    <div className="mb-8 space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, leader, or category"
            className="w-full pl-10 pr-3 py-2.5 rounded-md border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors"
          />
        </div>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring transition-colors"
        >
          <option value="all">All categories</option>
          {availableCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={onToggleSort}
          className="flex items-center justify-center gap-1.5 rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground hover:border-primary transition-colors whitespace-nowrap"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {sortOrder === 'asc' ? 'Soonest first' : 'Latest first'}
        </button>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {availableStatuses.map((s) => (
          <button
            key={s}
            onClick={() => onStatusChange(s)}
            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
              status === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 ml-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
