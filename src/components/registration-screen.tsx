import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardPanel } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import registration from '@/layout-intents/registration.json'
import { planLayout } from '@/lib/layout/intent'

const plan = planLayout(registration)
type Submitted = { name: string; email: string }

export function RegistrationScreen() {
  const [submitted, setSubmitted] = useState<Submitted | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const values = new FormData(event.currentTarget)
    setSubmitted({
      name: \`${values.get("firstName") ?? ""} ${values.get("lastName") ?? ""}\`.trim(),
      email: String(values.get('email') ?? ''),
    })
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[1600px] flex-col gap-4 bg-background px-3 text-foreground sm:px-6 xl:px-12" data-layout-root data-screen={plan.intent.screen}>
      <header className="flex min-h-20 items-center justify-between gap-4 py-4">
        <Link to="/" className="inline-flex items-center gap-3 font-semibold text-foreground no-underline" aria-label="Coss Layout Lab — início">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Layers3 size={20} aria-hidden="true" /></span>
          <span className="text-lg tracking-tight">coss <span className="font-normal text-muted-foreground">/ layout lab</span></span>
        </Link>
        <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:inline-flex">
          <span className="size-2 rounded-full bg-success" aria-hidden="true" />
          Exemplo com TanStack Start
        </span>
      </header>

      <main className="grid min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)]">
        <section className="flex min-w-0 flex-col justify-between gap-10 bg-primary p-6 text-primary-foreground sm:p-10 lg:p-12" aria-labelledby="story-title">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold tracking-wider text-primary-foreground/75">
            <span>01 — EXPERIÊNCIA</span><span className="hidden sm:inline">COMPOSIÇÃO INTENCIONAL</span>
          </div>
          <div className="max-w-xl py-4 lg:py-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-2 text-xs">
              <Sparkles size={14} aria-hidden="true" /> Experiências melhores começam pela estrutura
            </span>
            <h1 id="story-title" className="mt-8 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl xl:text-6xl">
              Interfaces que <em className="not-italic text-primary-foreground/65">fazem sentido.</em>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/80" data-layout-content>
              Um bom layout conecta intenção, conteúdo e comportamento. A biblioteca fornece as peças. A composição dá significado ao conjunto.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs" aria-label="Tecnologias utilizadas">
              {['coss UI', 'TanStack Start', 'Tailwind v4'].map(tag => <span key={tag} className="rounded-md border border-primary-foreground/25 px-3 py-2">{tag}</span>)}
            </div>
          </div>
          <p className="border-t border-primary-foreground/25 pt-5 text-xs text-primary-foreground/75">Planejar → Gerar → Avaliar → Refinar</p>
        </section>

        <section className="flex min-w-0 flex-col justify-center p-5 sm:p-9 xl:p-12" aria-labelledby="form-title">
          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Demonstração / Cadastro</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" data-layout-heading>Crie sua conta<span className="text-muted-foreground">.</span></h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">Uma composição clara, responsiva e feita com componentes coss UI.</p>
            </div>

            <Card className="min-w-0">
              <CardHeader className="p-5 sm:p-6">
                <CardTitle id="form-title">Comece por aqui</CardTitle>
                <CardDescription>Preencha os dados abaixo para visualizar a validação do formulário.</CardDescription>
              </CardHeader>
              <CardPanel className="px-5 pb-6 sm:px-6">
                {submitted ? (
                  <div className="flex flex-col items-start gap-4" role="status" aria-live="polite" data-testid="confirmation">
                    <span className="grid size-11 place-items-center rounded-lg bg-success/10 text-success"><CheckCircle2 size={23} aria-hidden="true" /></span>
                    <h3 className="text-lg font-semibold" data-layout-heading>Dados validados!</h3>
                    <p className="min-w-0 break-words text-sm leading-6 text-muted-foreground">
                      Prévia concluída para <strong>{submitted.name}</strong> ({submitted.email}). Nenhuma conta foi criada e nenhum dado foi enviado a um servidor.
                    </p>
                    <Button type="button" variant="outline" className="w-full" onClick={() => setSubmitted(null)}>Editar informações</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-7">
                    <section className="flex min-w-0 flex-col gap-4" data-layout-group="identity" aria-labelledby="identity-title">
                      <div className="flex items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">01</span>
                        <h3 id="identity-title" className="text-sm font-semibold">Informações pessoais</h3>
                      </div>
                      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <div className="flex min-w-0 flex-col gap-2" data-layout-field>
                          <label htmlFor="firstName" className="text-sm font-medium">Nome</label>
                          <Input id="firstName" name="firstName" type="text" autoComplete="given-name" placeholder="Seu nome" size="lg" required />
                        </div>
                        <div className="flex min-w-0 flex-col gap-2" data-layout-field>
                          <label htmlFor="lastName" className="text-sm font-medium">Sobrenome</label>
                          <Input id="lastName" name="lastName" type="text" autoComplete="family-name" placeholder="Seu sobrenome" size="lg" required />
                        </div>
                      </div>
                    </section>
                    <section className="flex min-w-0 flex-col gap-4" data-layout-group="credentials" aria-labelledby="credentials-title">
                      <div className="flex items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">02</span>
                        <h3 id="credentials-title" className="text-sm font-semibold">Acesso à conta</h3>
                      </div>
                      <div className="grid min-w-0 gap-4">
                        <div className="flex min-w-0 flex-col gap-2" data-layout-field>
                          <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                          <Input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" size="lg" required />
                        </div>
                        <div className="flex min-w-0 flex-col gap-2" data-layout-field>
                          <label htmlFor="password" className="text-sm font-medium">Senha</label>
                          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} placeholder="Pelo menos 8 caracteres" size="lg" required />
                          <p className="text-xs text-muted-foreground">Use no mínimo 8 caracteres.</p>
                        </div>
                      </div>
                    </section>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" size="xl" className="w-full" data-layout-primary-action>
                        Continuar <ArrowRight size={17} aria-hidden="true" />
                      </Button>
                      <p className="text-center text-xs leading-5 text-muted-foreground">Este é um exemplo de interface. Não há armazenamento de dados.</p>
                    </div>
                  </form>
                )}
              </CardPanel>
            </Card>
            <p className="mx-auto mt-5 flex max-w-xl items-start justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
              <ShieldCheck size={16} className="shrink-0" aria-hidden="true" /> Estrutura semântica, layout responsivo e auditoria em múltiplos tamanhos de tela.
            </p>
          </div>
        </section>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
        <span>Layout Lab · 2026</span><span>Exemplo de referência para novas telas</span>
      </footer>
    </div>
  )
}
