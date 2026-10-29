# Publicação de app-generator (repositório público)

O repositório já existe em [fernandosam/app-generator](https://github.com/fernandosam/app-generator). Não publicar `.env` ou `node_modules/`.

## Validação e publicação de mudanças

A única toolchain de aplicação é **Vite+**, instalada localmente como `vite-plus`. Node.js deve cumprir `^22.18.0 || ^24.11.0 || >=26.0.0`. Executar desenvolvimento, testes e build pelos scripts `vp` definidos no `package.json`.

1. Trabalhar em uma branch de tarefa associada à sua issue; seguir [AGENTS.md](../AGENTS.md).
2. Executar `npm ci --no-audit --no-fund`. Todas as primitivas coss estão no Git. Se uma tela precisar de partícula, usar `npm run ui:install -- @coss/p-button-1` (nome real confirmado) manualmente; nunca instalar o catálogo inteiro em build ou CI.
3. Executar `npm run check` (contratos, independência de harness, testes, build e `vp check` com formatação, lint e tipos) e `npm run layout:audit`. Se necessário, isolar o diagnóstico TypeScript com `npm run typecheck`.
4. Abrir PR para `main` utilizando o harness/cliente Git de sua escolha. Nenhum serviço de IA roda dentro do repositório.
5. Conferir os workflows **CI** e **Layout Audit**, os relatórios e screenshots publicados.
6. Manter o bloqueio de merge para falhas reais. Publicação da aplicação e hospedagem de produção são atividades separadas.

Todas as primitivas coss estão versionadas localmente. O CLI oficial instala somente partículas selecionadas; não baixar fontes em CI. Revisar diff, dependências, lockfile, SSR e checks antes de abrir PR.
