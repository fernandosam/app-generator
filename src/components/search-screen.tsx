import { useState, type FormEvent } from 'react'
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DemoShell } from './demo-shell'

type Item = { id: number; title: string; category: 'Design' | 'Engenharia' | 'Operações'; summary: string; tag: string }
const items: Item[] = [
  { id: 1, title: 'Fundamentos de interfaces', category: 'Design', summary: 'Princípios de hierarquia visual e composição contextual.', tag: 'Guia' },
  { id: 2, title: 'Padrões de formulários', category: 'Design', summary: 'Campos agrupados, feedback e validação acessível.', tag: 'Padrão' },
  { id: 3, title: 'Componentes reutilizáveis', category: 'Engenharia', summary: 'Interfaces consistentes com componentes oficiais.', tag: 'Implementação' },
  { id: 4, title: 'Testes de responsividade', category: 'Engenharia', summary: 'Cenários reproduzíveis em diferentes tamanhos de tela.', tag: 'Teste' },
  { id: 5, title: 'Evidências de qualidade', category: 'Operações', summary: 'Como documentar auditorias sem inventar aprovação visual.', tag: 'Processo' },
  { id: 6, title: 'Planejamento de jornada', category: 'Design', summary: 'Organização de tarefas e fluxos orientados ao usuário.', tag: 'Referência' },
  { id: 7, title: 'Estratégias de entrega', category: 'Operações', summary: 'Revisões incrementais e rastreabilidade de mudanças.', tag: 'Guia' },
  { id: 8, title: 'Rotas e navegação', category: 'Engenharia', summary: 'Navegação com TanStack Router e estados de interface.', tag: 'Código' },
]
export function SearchScreen() {
  const [draft, setDraft] = useState('')
  const [draftCategory, setDraftCategory] = useState('all')
  const [filters, setFilters] = useState({ query: '', category: 'all' })

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFilters({ query: draft.trim().toLocaleLowerCase('pt-BR'), category: draftCategory })
  }
  const results = items.filter(item => {
    const matchCategory = filters.category === 'all' || item.category === filters.category
    const text = [item.title, item.summary, item.tag, item.category].join(' ').toLocaleLowerCase('pt-BR')
    return matchCategory && text.includes(filters.query)
  })

  return (
    <DemoShell screen="search" eyebrow="02 / DESCOBERTA" title="Encontre o que importa"
      description="Uma busca contextual com filtros funcionais, estado vazio e resultados responsivos. Os dados desta demonstração são locais e fictícios.">
      <section data-layout-group="filters" aria-labelledby="search-filters-title" className="showcase-search-panel">
        <div className="showcase-section-title">
          <div><h2 id="search-filters-title">Explorar biblioteca</h2><p>Use palavras-chave ou filtre por área de interesse.</p></div>
          <SlidersHorizontal size={19} aria-hidden="true" />
        </div>
        <form className="showcase-search-form" onSubmit={handleSearch}>
          <div className="showcase-field" data-layout-field>
            <label htmlFor="catalog-query">Buscar conteúdo</label>
            <Input id="catalog-query" type="search" size="lg" placeholder="Ex.: formulários, testes, componentes" value={draft} onChange={event => setDraft(event.target.value)} />
          </div>
          <div className="showcase-field" data-layout-field>
            <label htmlFor="catalog-category">Categoria</label>
            <select id="catalog-category" value={draftCategory} onChange={event => setDraftCategory(event.target.value)}>
              <option value="all">Todas as categorias</option>
              <option value="Design">Design</option>
              <option value="Engenharia">Engenharia</option>
              <option value="Operações">Operações</option>
            </select>
          </div>
          <Button type="submit" className="showcase-search-submit" data-layout-primary-action><SearchIcon size={17} aria-hidden="true" /> Buscar</Button>
        </form>
      </section>
      <section className="showcase-results-section" data-layout-group="results" aria-labelledby="search-results-title">
        <div className="showcase-results-heading">
          <div><span className="showcase-eyebrow">CATÁLOGO LOCAL</span><h2 id="search-results-title">Resultados encontrados</h2></div>
          <span className="showcase-counter" role="status" aria-live="polite" data-testid="search-count">{results.length} {results.length === 1 ? 'resultado' : 'resultados'}</span>
        </div>
        {results.length ? (
          <div className="showcase-result-grid">
            {results.map(item => (
              <Card className="showcase-result-card" key={item.id} data-testid="search-result">
                <CardHeader>
                  <div className="showcase-card-meta"><span>{item.category}</span><span>{item.tag}</span></div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.summary}</CardDescription>
                </CardHeader>
                <CardPanel><span className="showcase-card-footer">Conteúdo ilustrativo do catálogo</span></CardPanel>
              </Card>
            ))}
          </div>
        ) : (
          <div className="showcase-empty" role="status" data-testid="search-empty">
            <SearchIcon size={28} aria-hidden="true" />
            <h3>Nenhum resultado encontrado</h3>
            <p>Experimente outro termo ou escolha todas as categorias.</p>
          </div>
        )}
      </section>
    </DemoShell>
  )
}
