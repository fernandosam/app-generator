import { useState } from 'react'
import { Activity, CalendarDays, CheckCircle2, ClipboardList, RefreshCw, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'
import { DemoShell } from './demo-shell'

const activity = [
  { id: 1, label: 'Revisão de layout concluída', project: 'Página de cadastro', time: '09:42', type: 'Concluído' },
  { id: 2, label: 'Novos cenários registrados', project: 'Interface de busca', time: '08:15', type: 'Atividade' },
  { id: 3, label: 'Verificação de acessibilidade', project: 'Formulário de acesso', time: 'Ontem', type: 'Concluído' },
  { id: 4, label: 'Auditoria de responsividade', project: 'Painel de indicadores', time: 'Ontem', type: 'Atividade' },
]
const metrics = {
  week: [
    { name: 'Sessões de exemplo', value: '1.284', change: '+12,8%', icon: Users },
    { name: 'Fluxos concluídos', value: '86%', change: '+4,2%', icon: CheckCircle2 },
    { name: 'Interações locais', value: '3.540', change: '+8,4%', icon: Activity },
  ],
  month: [
    { name: 'Sessões de exemplo', value: '5.820', change: '+18,1%', icon: Users },
    { name: 'Fluxos concluídos', value: '89%', change: '+6,7%', icon: CheckCircle2 },
    { name: 'Interações locais', value: '14.920', change: '+11,3%', icon: Activity },
  ],
}

export function DashboardScreen() {
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [onlyCompleted, setOnlyCompleted] = useState(false)
  const [refreshed, setRefreshed] = useState(false)
  const shownActivity = onlyCompleted ? activity.filter(item => item.type === 'Concluído') : activity

  return (
    <DemoShell screen="dashboard" eyebrow="03 / VISÃO GERAL" title="Seu espaço de trabalho"
      description="Indicadores ilustrativos, filtros acessíveis e atualizações locais, sem dados reais ou integração com um backend.">
      <section className="flex flex-wrap items-center justify-between gap-5" data-layout-group="period" aria-labelledby="period-title">
        <div>
          <h2 id="period-title" className="text-lg font-semibold">Resumo de atividades</h2>
          <p data-testid="period-label" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays size={15} aria-hidden="true" /> {period === 'week' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2" aria-label="Período dos indicadores">
            <Button size="lg" type="button" variant={period === 'week' ? 'default' : 'outline'} onClick={() => setPeriod('week')} aria-pressed={period === 'week'}>7 dias</Button>
            <Button size="lg" type="button" variant={period === 'month' ? 'default' : 'outline'} onClick={() => setPeriod('month')} aria-pressed={period === 'month'}>30 dias</Button>
          </div>
          <Button size="lg" type="button" variant="outline" data-layout-primary-action onClick={() => setRefreshed(true)}>
            <RefreshCw size={16} aria-hidden="true" /> Atualizar resumo
          </Button>
        </div>
      </section>

      <section data-layout-group="metrics" aria-label="Indicadores de demonstração" className="mt-7 grid min-w-0 gap-4 sm:grid-cols-3">
        {metrics[period].map(({ name, value, change, icon: Icon }) => (
          <Card className="min-w-0" key={name}>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">{name}</span>
              <Icon size={18} className="shrink-0 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardPanel className="flex flex-col gap-2">
              <strong className="text-3xl font-semibold tracking-tight">{value}</strong>
              <span className="inline-flex items-center gap-2 text-xs text-success"><TrendingUp size={14} aria-hidden="true" /> {change} no período</span>
            </CardPanel>
          </Card>
        ))}
      </section>

      {refreshed && (
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-success" data-testid="dashboard-updated" role="status">
          <CheckCircle2 size={16} aria-hidden="true" /> Resumo atualizado localmente com dados de demonstração.
        </p>
      )}

      <section className="mt-7 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)]" data-layout-group="activity" aria-labelledby="activity-title">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Histórico</span>
                <CardTitle className="mt-2" id="activity-title">Atividades recentes</CardTitle>
              </div>
              <Button size="lg" type="button" variant="outline" aria-pressed={onlyCompleted} onClick={() => setOnlyCompleted(value => !value)}>
                {onlyCompleted ? 'Mostrar todas' : 'Somente concluídas'}
              </Button>
            </div>
          </CardHeader>
          <CardPanel>
            <ul className="m-0 list-none divide-y divide-border p-0">
              {shownActivity.map(item => (
                <li key={item.id} data-testid="dashboard-activity" className="grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 py-4">
                  <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <ClipboardList size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <strong className="block break-words text-sm font-medium">{item.label}</strong>
                    <p className="mt-1 text-xs text-muted-foreground">{item.project}</p>
                  </div>
                  <time className="text-xs text-muted-foreground">{item.time}</time>
                </li>
              ))}
            </ul>
          </CardPanel>
        </Card>
        <aside className="flex min-w-0 flex-col justify-center rounded-2xl bg-primary p-8 text-primary-foreground">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Sobre este exemplo</span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight">Dados para explorar, não para armazenar.</h2>
          <p className="mt-4 break-words text-sm leading-7 text-primary-foreground/80">
            Este painel usa números fictícios para demonstrar estados, responsividade e hierarquia visual sem conectar serviços.
          </p>
          <span className="mt-7 text-xs font-medium">Sem integração externa</span>
        </aside>
      </section>
    </DemoShell>
  )
}
