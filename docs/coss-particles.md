# Composições coss UI prioritárias

Cinco composições derivadas do [registry oficial coss UI](https://github.com/cosscom/ui), revisão `890a79a5368b3cdebbdd860aa1908f2843fd7ddc` (licença MIT em `src/components/ui/LICENSE.coss`). Fonte rastreada nos comentários de cada arquivo. As **primitivas** continuam em `src/components/ui/`; estas composições ficam em `src/components/particles/`. Não há catálogo paralelo.

| Partícula original | Composição local | Contrato principal |
| --- | --- | --- |
| `@coss/p-form-2` | `ValidatedForm` | `fields`, `schema` (Zod), `onSubmit`, `submitLabel` |
| `@coss/p-dialog-1` | `EditDialog` | `children` (campos reais), `onSubmit(FormData)`, `title`, `description` |
| `@coss/p-empty-1` | `EmptyState` | `title`, `description`, `icon`, `action`, `secondaryAction` |
| `@coss/p-table-4` | `DataTable` | `data`, `columns`, `pageSize`, `getRowId` |
| `@coss/p-toast-2` | `notify` | `type`, `title`, `description` |

**Diferença intencional da origem:** exemplos oficiais de nomes, voos, alertas e esperas simuladas não estão em produção. Dados, campos e ações são sempre passados pelos chamadores. `ValidatedForm` recebe schema Zod (usar `z.coerce.number()` para entradas numéricas) e captura erros de campo e falhas de envio; `EditDialog` só fecha após o callback assíncrono resolver. Para `DataTable`, usar `DataTableColumn<T>` com a API **TanStack Table v9** e prever células responsivas; a seleção só aparece quando explicitamente definida nas colunas. Estado vazio e paginação são tratados pela composição.

O `ToastProvider` oficial é montado uma única vez em `src/routes/__root.tsx`. O agente pode chamar `notify({type: 'success', title: 'Alterações salvas'})` após uma operação real; não enviar informações sensíveis em notificações.

O exemplo abaixo pode ser reutilizado por um harness sem impor um layout fixo:

```tsx
import { EmptyState } from '@/components/particles/empty-state'
import { notify } from '@/components/particles/notifications'

<EmptyState
  title="Sem resultados"
  description="Tente outros filtros."
  action={{ label: 'Limpar filtros', onClick: clearFilters }}
/>
notify({ type: 'info', title: 'Busca atualizada' })
```

**Validação:** `npm run verify` e `npm run layout:audit`. As partículas não são importadas pelas telas de demonstração automaticamente; isso evita alterações desnecessárias na avaliação visual existente. Novas partículas seguem `npm run ui:install -- @coss/p-...`, com revisão explícita de imports, dependências e SSR.
