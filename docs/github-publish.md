# Publicação de app-generator (repositório público)

O repositório já existe em [fernandosam/app-generator](https://github.com/fernandosam/app-generator). Não publicar `.env` ou `node_modules/`.

## Validação e publicação de mudanças

A única toolchain de aplicação é **Vite+**, instalada localmente como `vite-plus`. Node.js deve cumprir `^22.18.0 || ^24.11.0 || >=26.0.0`. Executar desenvolvimento, testes e build pelos scripts `vp` definidos no `package.json`.

1. Trabalhar em uma branch de tarefa associada à sua issue; seguir [AGENTS.md](../AGENTS.md).
2. Executar `npm ci --no-audit --no-fund`. Se for necessário **adicionar/atualizar todo o catálogo coss**, executar apenas manualmente `npm run ui:install -- --dry-run` e, após revisão, `npm run ui:install`; esta instalação não é etapa de build nem CI.
3. Executar `npm run check` (contratos, independência de harness, testes, build e `vp check` com formatação, lint e tipos) e `npm run layout:audit`. Se necessário, isolar o diagnóstico TypeScript com `npm run typecheck`.
4. Abrir PR para `main` utilizando o harness/cliente Git de sua escolha. Nenhum serviço de IA roda dentro do repositório.
5. Conferir os workflows **CI** e **Layout Audit**, os relatórios e screenshots publicados.
6. Manter o bloqueio de merge para falhas reais. Publicação da aplicação e hospedagem de produção são atividades separadas.

Componentes coss usados pela aplicação já são versionados. O instalador completo utiliza o registry oficial apenas sob demanda; não adicionar download mutável de fontes ao CI. Após instalar, revisar o diff, o lockfile e a compatibilidade das partículas com TanStack Start/SSR antes de abrir PR.
