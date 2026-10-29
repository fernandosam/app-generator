import { describe, expect, it } from 'vite-plus/test'
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
