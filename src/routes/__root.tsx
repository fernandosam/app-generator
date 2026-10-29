import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import '../styles/app.css'
import '../styles/showcase.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Coss Layout Lab · TanStack Start' },
      { name: 'description', content: 'TanStack Start + coss UI, geração de interfaces guiada por intenção e auditoria visual.' },
    ],
  }),
  component: Root,
})

function Root() {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
