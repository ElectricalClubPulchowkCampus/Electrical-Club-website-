interface EventsErrorStateProps {
  error: any
}

export function EventsErrorState({ error }: EventsErrorStateProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <span className="text-destructive text-lg font-semibold">!</span>
      </div>
      <h3 className="text-xl text-foreground">Couldn't load events</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
        {error?.message || 'Something went wrong while fetching the schedule. Try refreshing the page.'}
      </p>
      <code className="inline-block text-xs bg-muted text-muted-foreground px-2 py-1 rounded mt-4 not-italic">
        {error?.status || '500_FETCH_FAILURE'}
      </code>
    </div>
  )
}