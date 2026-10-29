import { useState, type FormEvent } from 'react'
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DemoShell } from './demo-shell'

type Item = {
  id: number
  title: string
  category: 'Design' | 'Engenharia' | 'Operações'
  summary: string
  tag: string
}
const items: Item[] = [
  {
    id: 1,
    title: 'Fundamentos de interfaces',
    category: 'Design',
    summary: 'Princípios de hierarquia visual e composição contextual.',
    tag: 'Guia',
  },
  {
    id: 2,
    title: 'Padrões de formulários',
    category: 'Design',
    summary: 'Campos agrupados, feedback e validação acessível.',
    tag: 'Padrão',
  },
  {
    id: 3,
    title: 'Componentes reutilizáveis',
    category: 'Engenharia',
    summary: 'Interfaces consistentes com componentes oficiais.',
    tag: 'Implementação',
  },
  {
    id: 4,
    title: 'Testes de responsividade',
    category: 'Engenharia',
    summary: 'Cenários reproduzíveis em diferentes tamanhos de tela.',
    tag: 'Teste',
  },
  {
    id: 5,
    title: 'Evidências de qualidade',
    category: 'Operações',
    summary: 'Como documentar auditorias sem inventar aprovação visual.',
    tag: 'Processo',
  },
  {
    id: 6,
    title: 'Planejamento de jornada',
    category: 'Design',
    summary: 'Organização de tarefas e fluxos orientados ao usuário.',
    tag: 'Referência',
  },
  {
    id: 7,
    title: 'Estratégias de entrega',
    category: 'Operações',
    summary: 'Revisões incrementais e rastreabilidade de mudanças.',
    tag: 'Guia',
  },
  {
    id: 8,
    title: 'Rotas e navegação',
    category: 'Engenharia',
    summary: 'Navegação com TanStack Router e estados de interface.',
    tag: 'Código',
  },
]

export function SearchScreen() {
  const [draft, setDraft] = useState('')
  const [draftCategory, setDraftCategory] = useState('all')
  const [filters, setFilters] = useState({ query: '', category: 'all' })

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFilters({ query: draft.trim().toLocaleLowerCase('pt-BR'), category: draftCategory })
  }
  const results = items.filter((item) => {
    const matchCategory = filters.category === 'all' || item.category === filters.category
    const text = [item.title, item.summary, item.tag, item.category]
      .join(' ')
      .toLocaleLowerCase('pt-BR')
    return matchCategory && text.includes(filters.query)
  })

  return (
    <DemoShell
      screen="search"
      eyebrow="02 / DESCOBERTA"
      title="Encontre o que importa"
      description="Uma busca contextual com filtros funcionais, estado vazio e resultados responsivos. Os dados desta demonstração são locais e fictícios."
    >
      <section
        data-layout-group="filters"
        aria-labelledby="search-filters-title"
        className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
      >
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <h2 id="search-filters-title" className="text-lg font-semibold tracking-tight">
              Explorar biblioteca
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use palavras-chave ou filtre por área de interesse.
            </p>
          </div>
          <SlidersHorizontal
            size={19}
            className="shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <form
          className="grid min-w-0 items-end gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto]"
          onSubmit={handleSearch}
        >
          <div className="flex min-w-0 flex-col gap-2" data-layout-field>
            <label htmlFor="catalog-query" className="text-sm font-medium">
              Buscar conteúdo
            </label>
            <Input
              id="catalog-query"
              type="search"
              size="lg"
              placeholder="Ex.: formulários, testes, componentes"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2" data-layout-field>
            <label htmlFor="catalog-category" className="text-sm font-medium">
              Categoria
            </label>
            {/* O seletor nativo preserva teclado e opções enquanto Select oficial não está instalado. */}
            <select
              id="catalog-category"
              className="h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm text-foreground shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              value={draftCategory}
              onChange={(event) => setDraftCategory(event.target.value)}
            >
              <option value="all">Todas as categorias</option>
              <option value="Design">Design</option>
              <option value="Engenharia">Engenharia</option>
              <option value="Operações">Operações</option>
            </select>
          </div>
          <Button
            type="submit"
            size="xl"
            className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto"
            data-layout-primary-action
          >
            <SearchIcon size={17} aria-hidden="true" /> Buscar
          </Button>
        </form>
      </section>

      <section className="mt-10" data-layout-group="results" aria-labelledby="search-results-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Catálogo local
            </span>
            <h2 id="search-results-title" className="mt-2 text-lg font-semibold tracking-tight">
              Resultados encontrados
            </h2>
          </div>
          <span
            className="rounded-full bg-muted px-4 py-2 text-xs font-medium text-muted-foreground"
            role="status"
            aria-live="polite"
            data-testid="search-count"
          >
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>
        {results.length ? (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <Card key={item.id} className="min-w-0" data-testid="search-result">
                <CardHeader>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
                    <span>{item.category}</span>
                    <span className="rounded-md border border-border px-2 py-1">{item.tag}</span>
                  </div>
                  <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
                  <CardDescription className="mt-1 min-h-16 leading-6">
                    {item.summary}
                  </CardDescription>
                </CardHeader>
                <CardPanel>
                  <span className="block border-t border-border pt-3 text-xs text-muted-foreground">
                    Conteúdo ilustrativo do catálogo
                  </span>
                </CardPanel>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card p-7 text-center"
            role="status"
            data-testid="search-empty"
          >
            <SearchIcon size={28} className="text-muted-foreground" aria-hidden="true" />
            <h3 className="text-lg font-semibold">Nenhum resultado encontrado</h3>
            <p className="text-sm text-muted-foreground">
              Experimente outro termo ou escolha todas as categorias.
            </p>
          </div>
        )}
      </section>
    </DemoShell>
  )
}
