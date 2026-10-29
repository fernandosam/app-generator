# Política de estilos — coss UI e Tailwind

Esta orientação aplica-se a novas telas, componentes e correções no **app-generator**. O agente continua livre para determinar a composição do layout; a prioridade é **não reconstruir por CSS os componentes e tokens já existentes**.

## Ordem de decisão

| Prioridade | Preferir | Exemplo |
|---|---|---|
| 1 | Componente oficial coss UI com API/variantes verificadas no código instalado | `<Button variant="outline">Cancelar</Button>`, `<Input type="search" />`, `<Card />` |
| 2 | Utilitários Tailwind v4 diretamente em `className` para **composição**, não para reimplementar controles | `grid gap-4 md:grid-cols-2`, `w-full sm:w-auto`, `p-6` |
| 3 | Tokens do tema global disponíveis em `src/styles/app.css` | `bg-background`, `bg-card`, `text-foreground`, `border-border`, `text-primary` |
| 4 | CSS específico, excepcional, mínimo, localizado e justificado | Efeito ou requisito demonstrável que as três opções anteriores não conseguem expressar |

A sequência não significa criar classes utilitárias próprias para substituir variantes nativas do coss. Antes de estilizar `Button`, `Input`, `Card` ou outros controles, **ler sua implementação em `src/components/ui/`** e manter seus estados de foco, disabled, loading e acessibilidade. Se o componente oficial necessário não estiver instalado, avaliar a incorporação da fonte oficial com revisão de dependências e lockfile, sem inventar uma versão caseira.

### Exemplo preferido

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function SearchPanel() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="gap-3 p-6">
        <CardTitle>Buscar registros</CardTitle>
      </CardHeader>
      <CardPanel className="grid gap-4 p-6 md:grid-cols-[minmax(0,1fr)_auto]">
        <Input type="search" aria-label="Buscar registros" />
        <Button type="button" variant="outline" className="w-full md:w-auto">
          Buscar
        </Button>
      </CardPanel>
    </Card>
  )
}
```

Não criar um arquivo `search-controls.css` para redesenhar input, card e button nem usar seletores globais como `button`, `input` ou sobrescritas coss como `[data-slot=input]` quando as variantes e o Tailwind resolvem a necessidade.

## Quando CSS adicional pode ser aceito

Uma exceção deve registrar no PR:

1. **Necessidade concreta:** comportamento visual ou interação reproduzível que precisa da exceção.
2. **Alternativas avaliadas:** quais componentes/variantes oficiais, utilitários e tokens foram consultados e por que não atenderam.
3. **Localização mínima:** seletor específico do contexto, arquivo já existente quando possível, sem afetar controles globais.
4. **Evidência:** teste e/ou captura real antes e depois, nos viewports pertinentes, verificando estados de foco, erro, disabled e conteúdo longo.

Não introduzir novas cores hexadecimais ou variáveis locais para substituir tokens de tema; diferenças de tema compartilhadas exigem uma proposta explícita para os tokens globais. Um CSS de efeito visual pontual pode ser aceitável, mas nunca justifica recriar a base visual de um controle coss.

## Situação do código preexistente

Há overrides anteriores à política em `src/styles/app.css` e `src/styles/showcase.css`, por exemplo:

- `.form-field input` e `.form-actions .primary-button` na tela de cadastro;
- `.showcase-field [data-slot=input]` e `.showcase-field [data-slot=input-control]` na demonstração;
- `.showcase-form-card [data-slot=card-header]` e `.showcase-result-card [data-slot=card-title]`.

Eles **não são exemplos a replicar**. Sua remoção exige refatoração visual própria, com conversão para variantes/tokens/utilitários e auditoria comparativa, para não alterar as telas existentes incidentalmente. Esta entrega consolida a política para **novas alterações**, sem declarar que o legado já está normalizado.

## Validação

- `npm run test:unit`: verifica presença e consistência das instruções (não é linter CSS).
- `npm run check:static`, `npm run check:harness`, `npm test`, `npm run build`, `npm run typecheck`: mantêm as garantias técnicas.
- `npm run layout:audit`: assegura métricas, estados e screenshots sem afirmar aprovação visual perceptiva.
- Revisão de código: avaliar se CSS adicional foi justificado e se é possível expressá-lo com coss + Tailwind + tokens. **Nenhum teste textual impede sozinho novo CSS paralelo.**
