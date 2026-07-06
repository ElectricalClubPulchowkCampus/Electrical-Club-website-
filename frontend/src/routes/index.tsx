import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
      <p className="text-muted-foreground mt-2">
        Electrical Club, Pulchowk Campus
      </p>
    </div>
  )
}