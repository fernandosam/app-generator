import { describe, expect, it } from 'vite-plus/test'
import { readFileSync, existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { z } from 'zod'
import { EmptyState } from './empty-state'
import { ValidatedForm } from './validated-form'
import { normalizePageSize } from './data-table'

describe('composições oficiais coss com conteúdo parametrizável', () => {
  it('renderiza empty state sem dados fictícios nem botões obrigatórios', () => {
    const html = renderToStaticMarkup(
      createElement(EmptyState, {
        title: 'Sem registros',
        description: 'Defina um filtro para continuar',
      }),
    )
    expect(html).toContain('Sem registros')
    expect(html).toContain('Defina um filtro')
    expect(html).not.toContain('meeting')
    expect(html).not.toContain('<button')
  })

  it('renderiza campos do formulário conforme contrato do chamador', () => {
    const html = renderToStaticMarkup(
      createElement(ValidatedForm, {
        fields: [{ name: 'email', label: 'Email', type: 'email' as const }],
        schema: z.object({ email: z.email() }),
        submitLabel: 'Confirmar',
        onSubmit: async () => {},
      }),
    )
    expect(html).toContain('Email')
    expect(html).toContain('Confirmar')
    expect(html).not.toContain('Enter age')
  })

  it('normaliza paginação inválida de forma previsível', () => {
    expect(normalizePageSize(20)).toBe(20)
    for (const n of [0, -4, 2.5, Infinity, NaN]) expect(normalizePageSize(n)).toBe(10)
  })
})

const read = (path: string) => readFileSync(path, 'utf8')

describe('contratos do conjunto coss sem fontes e fixtures paralelas', () => {
  it('versiona as cinco composições e registra suas origens oficiais', () => {
    const particles = {
      'validated-form.tsx': 'p-form-2',
      'edit-dialog.tsx': 'p-dialog-1',
      'empty-state.tsx': 'p-empty-1',
      'data-table.tsx': 'p-table-4',
      'notifications.ts': 'p-toast-2',
    }
    for (const [name, upstream] of Object.entries(particles)) {
      const path = 'src/components/particles/' + name
      expect(existsSync(path)).toBe(true)
      const source = read(path)
      expect(source).toContain(upstream)
      expect(source).not.toMatch(/@\/registry\/default\//)
      expect(source).not.toMatch(/Margaret Welsh|Los Angeles|flightCode|Create meeting|window\.alert\(/)
    }
  })

  it('usa TanStack v9, paginação e dependências versionadas', () => {
    const source = read('src/components/particles/data-table.tsx')
    expect(source).toContain("from '@tanstack/react-table'")
    expect(source).toContain('getToggleSortingHandler')
    expect(source).toContain('getCanPreviousPage')
    expect(source).toContain('getCanNextPage')
    const pkg = JSON.parse(read('package.json'))
    const lock = JSON.parse(read('package-lock.json'))
    expect(pkg.dependencies['@tanstack/react-table']).toBe('9.2.4')
    expect(lock.packages[''].dependencies['@tanstack/react-table']).toBe('9.2.4')
    expect(lock.packages['node_modules/@tanstack/react-table'].version).toBe('9.2.4')
  })

  it('fornece o ToastProvider global sem nova biblioteca de notificações', () => {
    expect(read('src/routes/__root.tsx')).toContain('<ToastProvider>')
    expect(read('src/components/particles/notifications.ts')).toContain('toastManager.add')
  })
})
