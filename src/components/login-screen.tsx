import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DemoShell } from './demo-shell'

export function LoginScreen() {
  const [submitted, setSubmitted] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setSubmitted(String(values.get('email') ?? ''))
  }

  return (
    <DemoShell screen="login" eyebrow="01 / ACESSO" title="Acesse sua conta"
      description="Uma experiência de acesso clara, com validação de campos e confirmação simulada. Nenhuma credencial é enviada para um servidor.">
      <div className="showcase-login-layout">
        <aside className="showcase-feature" data-layout-group="context">
          <div className="showcase-feature-icon"><LockKeyhole size={24} aria-hidden="true" /></div>
          <h2>A simplicidade também é segurança.</h2>
          <p>Rótulos claros, foco visível e estados de validação ajudam a concluir a tarefa sem distrações.</p>
          <div className="showcase-feature-note"><ShieldCheck size={18} aria-hidden="true" /> Somente demonstração local — sem autenticação real.</div>
        </aside>
        <section aria-labelledby="login-panel-title" data-layout-group="login-form">
          <Card className="showcase-form-card">
            <CardHeader>
              <CardTitle id="login-panel-title">Entrar no espaço de trabalho</CardTitle>
              <CardDescription>Insira dados fictícios para testar o fluxo.</CardDescription>
            </CardHeader>
            <CardPanel>
              {submitted ? (
                <div className="showcase-success" role="status" aria-live="polite" data-testid="login-success">
                  <CheckCircle2 size={30} aria-hidden="true" />
                  <h2>Validação concluída</h2>
                  <p>O e-mail {submitted} foi validado localmente. Nenhuma sessão foi iniciada.</p>
                  <Button type="button" variant="outline" onClick={() => setSubmitted(null)}>Voltar ao formulário</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="showcase-form">
                  <div className="showcase-field" data-layout-field>
                    <label htmlFor="login-email">E-mail</label>
                    <Input id="login-email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" size="lg" required />
                  </div>
                  <div className="showcase-field" data-layout-field>
                    <label htmlFor="login-password">Senha</label>
                    <Input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Pelo menos 8 caracteres" minLength={8} size="lg" required />
                    <p className="showcase-hint">Use uma senha fictícia para esta demonstração.</p>
                  </div>
                  <Button type="submit" data-layout-primary-action className="showcase-cta">Continuar <ArrowRight size={17} aria-hidden="true" /></Button>
                  <p className="showcase-form-note">Não armazene senhas reais nesta demonstração.</p>
                </form>
              )}
            </CardPanel>
          </Card>
          <p className="showcase-under-card">Primeira visita? <Link to="/">Explore o cadastro</Link>.</p>
        </section>
      </div>
    </DemoShell>
  )
}
