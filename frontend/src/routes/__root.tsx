import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { SettingsService } from '../lib/services/settingService'

export const Route = createRootRoute({
  loader: async () => {
    const details = await SettingsService.getClubSettings()
    return { details }
  },
  staleTime: Infinity, // fetch once, never treat as stale for the session
  component: RootComponent,
})
function RootComponent() {
  const { details } = Route.useLoaderData()

  return (
    <>
     <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer socials={details?.Electrical_club_socials} />
    </div>
    </>
  )
}