import { useState, type CSSProperties, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import registration from '@/layout-intents/registration.json'
import { planLayout } from '@/lib/layout/intent'

const plan = planLayout(registration)

type Submitted = { name: string; email: string }

export function RegistrationScreen() {
  const [submitted, setSubmitted] = useState<Submitted | null>(null)
  const formStyle = { '--form-max': plan.formMaxWidth } as CSSProperties

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setSubmitted({
      name: `${values.get('firstName') ?? ''} ${values.get('lastName') ?? ''}`.trim(),
      email: String(values.get('email') ?? ''),
    })
  }

  return (
    <div className={cn('app-shell', plan.densityClass)} data-layout-root data-screen="registration" style={formStyle}>
      <header className="site-header">
        <a href="/" className="brand" aria-label="Coss Layout Lab — início">
          <span className="brand-icon"><Layers3 size={19} strokeWidth={2.25} aria-hidden="true" /></span>
          <span className="brand-name">coss<span className="brand-suffix"> / layout lab</span></span>
        </a>
        <div className="header-meta"><span className="status-dot" /> Exemplo com TanStack Start</div>
      </header>

      <main className="main-layout">
        <section className="story-panel" aria-labelledby="story-title">
          <div className="story-topline"><span className="story-index">01 — EXPERIÊNCIA</span><span>COMPOSIÇÃO INTENCIONAL</span></div>
          <div className="story-content">
            <div className="eyebrow"><Sparkles size={14} aria-hidden="true" /> Experiências melhores começam pela estrutura</div>
            <h1 id="story-title">Interfaces que <em>fazem sentido.</em></h1>
            <p data-layout-content>Um bom layout conecta intenção, conteúdo e comportamento. A biblioteca fornece as peças. A composição dá significado ao conjunto.</p>
            <div className="story-badges" aria-label="Tecnologias utilizadas">
              <span>coss UI</span><span>TanStack Start</span><span>Tailwind v4</span>
            </div>
          </div>
          <div className="story-bottom">
            <div className="story-orbit" aria-hidden="true"><div className="orbit-ring orbit-ring-one"/><div className="orbit-ring orbit-ring-two"/><div className="orbit-core"><Layers3 size={24} /></div></div>
            <p>Planejar <span>→</span> Gerar <span>→</span> Avaliar <span>→</span> Refinar</p>
          </div>
        </section>

        <section className="form-panel" aria-labelledby="form-title">
          <div className="form-intro">
            <p className="section-marker">DEMONSTRAÇÃO / CADASTRO</p>
            <h2 data-layout-heading>Crie sua conta<span className="heading-period">.</span></h2>
            <p>Uma composição clara, responsiva e feita com componentes coss UI.</p>
          </div>

          <Card className="registration-card">
            <CardHeader>
              <CardTitle id="form-title">Comece por aqui</CardTitle>
              <CardDescription>Preencha os dados abaixo para visualizar a validação do formulário.</CardDescription>
            </CardHeader>
            <CardPanel>
              {submitted ? (
                <div className="confirmation" role="status" aria-live="polite" data-testid="confirmation">
                  <div className="confirmation-icon"><CheckCircle2 size={23} aria-hidden="true" /></div>
                  <h3 data-layout-heading>Dados validados!</h3>
                  <p>Prévia concluída para <strong>{submitted.name}</strong> ({submitted.email}). Nenhuma conta foi criada e nenhum dado foi enviado a um servidor.</p>
                  <Button type="button" variant="outline" className="w-full" onClick={() => setSubmitted(null)}>Editar informações</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="registration-form" noValidate={false}>
                  <div className="form-sections">
                    <section className="field-section" data-layout-group="identity" aria-labelledby="identity-title">
                      <div className="group-header"><span className="group-number">01</span><h3 id="identity-title">Informações pessoais</h3></div>
                      <div className="field-grid two-cols">
                        <div className="form-field" data-layout-field><label htmlFor="firstName">Nome</label><Input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="Seu nome" required /></div>
                        <div className="form-field" data-layout-field><label htmlFor="lastName">Sobrenome</label><Input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="Seu sobrenome" required /></div>
                      </div>
                    </section>
                    <section className="field-section" data-layout-group="credentials" aria-labelledby="credentials-title">
                      <div className="group-header"><span className="group-number">02</span><h3 id="credentials-title">Acesso à conta</h3></div>
                      <div className="field-grid">
                        <div className="form-field" data-layout-field><label htmlFor="email">E-mail</label><Input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required /></div>
                        <div className="form-field" data-layout-field><label htmlFor="password">Senha</label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Pelo menos 8 caracteres" required /><p className="field-hint">Use no mínimo 8 caracteres.</p></div>
                      </div>
                    </section>
                  </div>
                  <div className="form-actions">
                    <Button type="submit" className="w-full primary-button" data-layout-primary-action>
                      Continuar <ArrowRight size={17} aria-hidden="true" />
                    </Button>
                    <p>Este é um exemplo de interface. Não há armazenamento de dados.</p>
                  </div>
                </form>
              )}
            </CardPanel>
          </Card>
          <div className="form-assurance"><ShieldCheck size={16} aria-hidden="true" /> Estrutura semântica, layout responsivo e auditoria em múltiplos tamanhos de tela.</div>
        </section>
      </main>

      <footer className="site-footer"><span>Layout Lab <span className="footer-dot">✳</span> 2026</span><span>Exemplo de referência para novas telas</span></footer>
    </div>
  )
}
