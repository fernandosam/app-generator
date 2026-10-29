import { z } from 'zod'

/**
 * Descreve a tarefa e suas expectativas sem prescrever componentes, grid ou regiões.
 * A composição visual é decisão do harness e deve ser validada pelo resultado.
 */
export const layoutIntentSchema = z.object({
  screen: z.string().regex(/^[a-z0-9-]+$/),
  purpose: z.string().min(1),
  primaryAction: z.string().min(1),
  task: z
    .object({
      userGoal: z.string().min(1),
      audience: z.string().min(1),
      successCriteria: z.array(z.string().min(1)).min(1),
    })
    .optional(),
  states: z.array(z.string().min(1)).default(['default']),
  dataVariations: z.array(z.string().min(1)).default([]),
  groups: z.array(z.object({ id: z.string().min(1), label: z.string().min(1) })).default([]),
  density: z.enum(['compact', 'comfortable', 'spacious']).default('comfortable'),
  // Campo legado opcional para ler intenções antigas sem impor enums de composição.
  layout: z.unknown().optional(),
})

export type LayoutIntent = z.infer<typeof layoutIntentSchema>

export function planLayout(raw: unknown) {
  const intent = layoutIntentSchema.parse(raw)
  return {
    intent,
    densityClass: `density-${intent.density}`,
    targetViewports: [390, 768, 1440] as const,
  }
}
