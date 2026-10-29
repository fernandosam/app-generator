# Validação e revisão de evidências — E06 (0.3.0)

## Execução verificável

- PR: [#13](https://github.com/fernandosam/app-generator/pull/13), issues #8–#12.
- Workflow CI: [40918418186](https://github.com/fernandosam/app-generator/actions/runs/40918418186) — concluído com sucesso (dependências travadas, testes unitários, Vitest, build e TypeScript).
- Workflow Layout Audit: [40918418404](https://github.com/fernandosam/app-generator/actions/runs/40918418404) — concluído com sucesso após a correção da sincronização de hidratação SSR.
- Artefato: `layout-evidence-40918418404` (retido por 14 dias), `runId=1793293730633-2828`.
- Relatório: **57/57 combinações executadas**, 4 telas, 19 cenários, 3 viewports, **100/100 pontos mecânicos**, 0 críticos, 0 graves, 0 ausentes e 0 obsoletos.

## Falhas encontradas e corrigidas

1. **Interações antes da hidratação SSR**: a primeira execução [40917573147](https://github.com/fernandosam/app-generator/actions/runs/40917573147) falhou em 20 de 57 cenários. HTML visível não garantia que os event handlers React estivessem ligados; testes passaram a esperar o marcador `html[data-app-hydrated="true"]`. A auditoria seguinte aprovou todos os cenários.
2. **Contador gramatical da busca**: a captura `search-match-mobile.png` mostrava "1 resultados". O componente e a expectativa de teste foram atualizados para singular/plural.
3. **Falsa affordance de links**: rótulos decorativos sem destino pareciam links por causa da seta externa. Foram substituídos por textos não acionáveis de demonstração.

## Inspeção visual efetivamente realizada

Foi feita **inspeção de uma amostra** das capturas reais recuperadas dos artifacts do GitHub Actions, não revisão multimodal de todos os 57 PNGs. Amostras examinadas: estados iniciais das quatro telas em desktop e mobile, além de `login-success-mobile.png`, `search-empty-mobile.png`, `search-match-mobile.png` e `dashboard-month-desktop.png`.

Nas amostras inspecionadas, os agrupamentos, a hierarquia, os controles, o fluxo vertical e as mensagens de estado mostraram-se coerentes; não foi constatado clipping visível. A busca no celular ocupa uma página longa porque apresenta oito cartões, comportamento intencional com rolagem vertical. Este julgamento é limitado à amostra observada.

**Limites:** nota mecânica não certifica UX ou acessibilidade completa. O contrato de revisão visual separado continua externo ao repositório e deve ser usado para inspeções completas. As capturas acima pertencem ao commit anterior aos dois ajustes textuais; os checks do PR devem ser repetidos após o ajuste e seus resultados conferidos antes do merge.
