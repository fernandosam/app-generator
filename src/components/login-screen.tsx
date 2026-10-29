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
      <div className="grid min-w-0 items-stretch gap-6 md:grid-cols-2">
        <aside className="flex min-w-0 flex-col justify-center rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12" data-layout-group="context">
          <span className="mb-8 grid size-14 place-items-center rounded-2xl border border-primary-foreground/30 bg-primary-foreground/10">
            <LockKeyhole size={24} aria-hidden="true" />
          </span>
          <h2 className="max-w-md text-3xl font-semibold tracking-tight">A simplicidade também é segurança.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/80">Rótulos claros, foco visível e estados de validação ajudam a concluir a tarefa sem distrações.</p>
          <div className="mt-10 flex items-center gap-2 border-t border-primary-foreground/25 pt-5 text-xs leading-5">
            <ShieldCheck size={18} aria-hidden="true" className="shrink-0" /> Somente demonstração local — sem autenticação real.
          </div>
        </aside>
        <section className="min-w-0" aria-labelledby="login-panel-title" data-layout-group="login-form">
          <Card className="h-full">
            <CardHeader>
              <CardTitle id="login-panel-title">Entrar no espaço de trabalho</CardTitle>
              <CardDescription>Insira dados fictícios para testar o fluxo.</CardDescription>
            </CardHeader>
            <CardPanel>
              {submitted ? (
                <div className="flex flex-col items-start gap-5 py-6" role="status" aria-live="polite" data-testid="login-success">
                  <CheckCircle2 size={30} className="text-success" aria-hidden="true" />
                  <h2 className="text-xl font-semibold">Validação concluída</h2>
                  <p className="break-words text-sm leading-7 text-muted-foreground">O e-mail {submitted} foi validado localmente. Nenhuma sessão foi iniciada.</p>
                  <Button type="button" variant="outline" onClick={() => setSubmitted(null)}>Voltar ao formulário</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex min-w-0 flex-col gap-2" data-layout-field>
                    <label htmlFor="login-email" className="text-sm font-medium">E-mail</label>
                    <Input id="login-email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" size="lg" required />
                  </div>
                  <div className="flex min-w-0 flex-col gap-2" data-layout-field>
                    <label htmlFor="login-password" className="text-sm font-medium">Senha</label>
                    <Input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Pelo menos 8 caracteres" minLength={8} size="lg" required />
                    <p className="text-xs text-muted-foreground">Use uma senha fictícia para esta demonstração.</p>
                  </div>
                  <Button type="submit" size="xl" data-layout-primary-action className="w-full">Continuar <ArrowRight size={17} aria-hidden="true" /></Button>
                  <p className="text-center text-xs leading-5 text-muted-foreground">Não armazene senhas reais nesta demonstração.</p>
                </form>
              )}
            </CardPanel>
          </Card>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Primeira visita? <Link to="/" className="font-medium text-foreground underline underline-offset-4">Explore o cadastro</Link>.
          </p>
        </section>
      </div>
    </DemoShell>
  )
}
