import { describe, expect, it } from 'vitest'
import { planLayout } from './intent'
import registration from '@/layout-intents/registration.json'

describe('planejamento de layout', () => {
  it('interpreta a intenção de cadastro', () => {
    const result = planLayout(registration)
    expect(result.formMaxWidth).toBe('44rem')
    expect(result.densityClass).toBe('density-comfortable')
    expect(result.targetViewports).toEqual([390, 768, 1440])
  })
  it('preserva tarefa, estados e variações de conteúdo', () => {
    const result = planLayout(registration)
    expect(result.intent.task?.successCriteria).toContain('Campos válidos')
    expect(result.intent.states).toContain('content-stress')
  })
  it('não aceita ação principal ausente', () => {
    expect(() => planLayout({ ...registration, primaryAction: '' })).toThrow()
  })
  it('mantém diferentes composições disponíveis', () => {
    const result = planLayout({ ...registration, layout: { ...registration.layout, desktop: 'dashboard' } })
    expect(result.composition).toBe('dashboard')
  })
})
