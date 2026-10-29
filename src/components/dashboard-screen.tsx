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
      <section className="showcase-dashboard-toolbar" data-layout-group="period" aria-labelledby="period-title">
        <div><h2 id="period-title">Resumo de atividades</h2><p data-testid="period-label"><CalendarDays size={15} aria-hidden="true" /> {period === 'week' ? 'Últimos 7 dias' : 'Últimos 30 dias'}</p></div>
        <div className="showcase-toolbar-actions">
          <div className="showcase-period-controls" aria-label="Período dos indicadores">
            <Button type="button" variant={period === 'week' ? 'default' : 'outline'} onClick={() => setPeriod('week')} aria-pressed={period === 'week'}>7 dias</Button>
            <Button type="button" variant={period === 'month' ? 'default' : 'outline'} onClick={() => setPeriod('month')} aria-pressed={period === 'month'}>30 dias</Button>
          </div>
          <Button type="button" variant="outline" data-layout-primary-action className="showcase-refresh" onClick={() => setRefreshed(true)}><RefreshCw size={16} aria-hidden="true" /> Atualizar resumo</Button>
        </div>
      </section>
      <section data-layout-group="metrics" aria-label="Indicadores de demonstração" className="showcase-metrics-grid">
        {metrics[period].map(({ name, value, change, icon: Icon }) => (
          <Card className="showcase-metric-card" key={name}>
            <CardHeader><span className="showcase-metric-label">{name}</span><Icon size={18} aria-hidden="true" /></CardHeader>
            <CardPanel>
              <strong>{value}</strong>
              <span className="showcase-metric-change"><TrendingUp size={14} aria-hidden="true" /> {change} no período</span>
            </CardPanel>
          </Card>
        ))}
      </section>
      {refreshed && <p className="showcase-update-message" data-testid="dashboard-updated" role="status"><CheckCircle2 size={16} aria-hidden="true" /> Resumo atualizado localmente com dados de demonstração.</p>}
      <section className="showcase-activity-grid" data-layout-group="activity" aria-labelledby="activity-title">
        <Card className="showcase-activity-card">
          <CardHeader>
            <div className="showcase-activity-header">
              <div><span className="showcase-eyebrow">HISTÓRICO</span><CardTitle id="activity-title">Atividades recentes</CardTitle></div>
              <Button type="button" variant="outline" aria-pressed={onlyCompleted} onClick={() => setOnlyCompleted(value => !value)}>{onlyCompleted ? 'Mostrar todas' : 'Somente concluídas'}</Button>
            </div>
          </CardHeader>
          <CardPanel>
            <ul className="showcase-activity-list">
              {shownActivity.map(item => (
                <li key={item.id} data-testid="dashboard-activity">
                  <span className="showcase-activity-icon"><ClipboardList size={17} aria-hidden="true" /></span>
                  <div><strong>{item.label}</strong><p>{item.project}</p></div>
                  <time>{item.time}</time>
                </li>
              ))}
            </ul>
          </CardPanel>
        </Card>
        <aside className="showcase-tip-card">
          <span className="showcase-eyebrow">SOBRE ESTE EXEMPLO</span>
          <h2>Dados para explorar, não para armazenar.</h2>
          <p>Este painel usa números fictícios para demonstrar estados, responsividade e hierarquia visual sem conectar serviços.</p>
          <span className="showcase-tip-foot">Sem integração externa</span>
        </aside>
      </section>
    </DemoShell>
  )
}
