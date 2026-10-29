import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutGrid, Search, ShieldCheck, UserPlus, LogIn } from 'lucide-react'

const links = [
  { to: '/', title: 'Cadastro', icon: UserPlus },
  { to: '/login', title: 'Login', icon: LogIn },
  { to: '/search', title: 'Busca', icon: Search },
  { to: '/dashboard', title: 'Dashboard', icon: LayoutGrid },
] as const

export function DemoShell({
  screen,
  eyebrow,
  title,
  description,
  children,
}: {
  screen: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div
      className="flex min-h-svh flex-col bg-background text-foreground"
      data-layout-root
      data-screen={screen}
    >
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-lg font-bold tracking-tight text-foreground no-underline"
            aria-label="Layout Lab — cadastro"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <LayoutGrid size={19} aria-hidden="true" />
            </span>
            <span>
              layout <span className="font-normal text-muted-foreground">/ lab</span>
            </span>
          </Link>
          <nav aria-label="Telas de demonstração" className="flex flex-wrap items-center gap-1">
            {links.map(({ to, title: label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                activeProps={{
                  className:
                    'inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground',
                }}
              >
                <Icon size={15} aria-hidden="true" /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 pb-16 pt-10 sm:px-6 sm:pt-16">
        <div className="mb-10 max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </span>
          <h1
            className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl"
            data-layout-heading
          >
            {title}
            <span className="text-muted-foreground">.</span>
          </h1>
          <p
            className="mt-4 max-w-2xl break-words text-sm leading-7 text-muted-foreground"
            data-layout-content
          >
            {description}
          </p>
        </div>
        {children}
      </main>

      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6">
        <span>Layout Lab · TanStack Start + coss UI</span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck size={14} aria-hidden="true" /> Demonstrações locais, sem serviços externos
        </span>
      </footer>
    </div>
  )
}
