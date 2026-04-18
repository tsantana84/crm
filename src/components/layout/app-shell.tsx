import { NavLinks } from './nav-links'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="hidden w-60 shrink-0 border-r md:block">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-lg font-semibold">CRM</h1>
        </div>
        <div className="mt-4">
          <NavLinks />
        </div>
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 md:hidden">
          <MobileNav />
          <h1 className="ml-3 text-lg font-semibold">CRM</h1>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

function MobileNav() {
  return (
    <div className="flex gap-1 md:hidden">
      <NavLinks />
    </div>
  )
}
