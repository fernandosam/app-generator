import { z } from 'zod'

export const layoutIntentSchema = z.object({
  screen: z.string().min(1),
  task: z.object({
    userGoal: z.string().min(1),
    audience: z.string().min(1),
    successCriteria: z.array(z.string().min(1)).min(1),
  }).optional(),
  states: z.array(z.string().min(1)).default(['default']),
  dataVariations: z.array(z.string().min(1)).default([]),
  purpose: z.string().min(1),
  density: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
  priority: z.enum(['form', 'content', 'navigation', 'data']).default('form'),
  primaryAction: z.string().min(1),
  groups: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) })).min(1),
  layout: z.object({
    mobile: z.enum(['single_column']),
    desktop: z.enum(['centered_form', 'split', 'dashboard']),
    maxWidth: z.enum(['sm', 'md', 'lg', 'xl']),
  }),
})

export type LayoutIntent = z.infer<typeof layoutIntentSchema>

const widths = { sm: '28rem', md: '34rem', lg: '44rem', xl: '60rem' } as const

/** Intenção validada -> decisões simples de composição; não restringe APIs de componentes. */
export function planLayout(raw: unknown) {
  const intent = layoutIntentSchema.parse(raw)
  return {
    intent,
    formMaxWidth: widths[intent.layout.maxWidth],
    densityClass: `density-${intent.density}`,
    composition: intent.layout.desktop,
    targetViewports: [390, 768, 1440] as const,
  }
}
