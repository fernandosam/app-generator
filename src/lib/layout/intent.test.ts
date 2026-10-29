import { describe, expect, it } from 'vitest'
import { planLayout } from './intent'
import registration from '@/layout-intents/registration.json'

describe('layout-intent orientado à tarefa, não à composição', () => {
  it('interpreta cadastro sem exigir grid ou largura predeterminados', () => {
    const plan = planLayout(registration)
    expect(plan.intent.screen).toBe('registration')
    expect(plan.densityClass).toBe('density-comfortable')
    expect(plan.targetViewports).toEqual([390, 768, 1440])
    expect('composition' in plan).toBe(false)
  })
  it('aceita intenção mínima e deixa composição livre', () => {
    const plan = planLayout({ screen: 'search', purpose: 'Encontrar registros', primaryAction: 'Buscar' })
    expect(plan.intent.groups).toEqual([])
    expect(plan.intent.states).toEqual(['default'])
    expect(plan.intent.layout).toBeUndefined()
  })
  it('aceita indicação legada sem aplicá-la ao layout', () => {
    const legacy = { ...registration, layout: { desktop: 'split', mobile: 'single_column', maxWidth: 'lg' } }
    expect(planLayout(legacy).intent.layout).toEqual(legacy.layout)
    const free = { ...registration, layout: { desktop: 'custom-masonry' } }
    expect(planLayout(free).intent.layout).toEqual(free.layout)
  })
  it('preserva contexto e estados sem preencher com dados inventados', () => {
    const result = planLayout(registration)
    expect(result.intent.task?.successCriteria).toContain('Campos válidos')
    expect(result.intent.states).toContain('content-stress')
  })
  it('rejeita identificação ou ação principal inválidas', () => {
    expect(() => planLayout({ ...registration, primaryAction: '' })).toThrow()
    expect(() => planLayout({ ...registration, screen: '../registration' })).toThrow()
  })
})
