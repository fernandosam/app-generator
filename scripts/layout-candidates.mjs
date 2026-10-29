/** Comparação mecânica conservadora: não substitui uma avaliação visual independente. */
export function chooseCandidate([a, b]) {
  if (!a || !b || !a.complete || !b.complete)
    return {
      winner: null,
      reason: 'Relatórios incompletos; comparação inconclusiva.',
      visualInspectionRequired: true,
    }
  const rank = (x) => [x.criticalCount ?? 0, x.majorCount ?? 0, -(x.score ?? 0)]
  const ka = rank(a)
  const kb = rank(b)
  const firstDifference = ka.findIndex((value, i) => value !== kb[i])
  if (firstDifference < 0)
    return {
      winner: null,
      reason: 'Empate mecânico. Comparar capturas de tela e tarefas.',
      visualInspectionRequired: true,
    }
  const winner = ka[firstDifference] < kb[firstDifference] ? a.label : b.label
  return {
    winner,
    reason: ['Menos falhas críticas.', 'Menos falhas graves.', 'Maior pontuação contextual.'][
      firstDifference
    ],
    visualInspectionRequired: true,
    note: 'A preferência mecânica não significa que a alternativa seja esteticamente melhor.',
  }
}
