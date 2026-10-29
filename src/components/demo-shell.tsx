import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutGrid, Search, ShieldCheck, UserPlus, LogIn } from 'lucide-react'

const links = [
  { to: '/', title: 'Cadastro', icon: UserPlus },
  { to: '/login', title: 'Login', icon: LogIn },
  { to: '/search', title: 'Busca', icon: Search },
  { to: '/dashboard', title: 'Dashboard', icon: LayoutGrid },
] as const

export function DemoShell({ screen, eyebrow, title, description, children }: {
  screen: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="showcase-root" data-layout-root data-screen={screen}>
      <header className="showcase-header">
        <div className="showcase-container showcase-header-inner">
          <Link to="/" className="showcase-brand" aria-label="Layout Lab — cadastro">
            <span className="showcase-brand-mark"><LayoutGrid size={19} aria-hidden="true" /></span>
            <span>layout<span className="showcase-brand-light"> / lab</span></span>
          </Link>
          <nav aria-label="Telas de demonstração" className="showcase-nav">
            {links.map(({ to, title: label, icon: Icon }) => (
              <Link key={to} to={to} className="showcase-nav-link" activeProps={{ className: 'showcase-nav-link is-active' }}>
                <Icon size={15} aria-hidden="true" /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="showcase-container showcase-main">
        <div className="showcase-hero">
          <span className="showcase-eyebrow">{eyebrow}</span>
          <h1 data-layout-heading>{title}<span className="showcase-accent">.</span></h1>
          <p data-layout-content>{description}</p>
        </div>
        {children}
      </main>

      <footer className="showcase-container showcase-footer">
        <span>Layout Lab · TanStack Start + coss UI</span>
        <span><ShieldCheck size={14} aria-hidden="true" /> Demonstrações locais, sem serviços externos</span>
      </footer>
    </div>
  )
}
