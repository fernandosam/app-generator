# Publicação de app-generator (repositório público)

O repositório já existe em [fernandosam/app-generator](https://github.com/fernandosam/app-generator). Não publicar `.env` ou `node_modules/`.

## Validação e publicação de mudanças

1. Trabalhar em uma branch de tarefa associada à sua issue; seguir [AGENTS.md](../AGENTS.md).
2. Executar `npm install --no-audit --no-fund` e `npm run ui:install`, se necessário.
3. Executar `npm run check:static`, `npm run check:harness`, `npm run test:unit`, `npm test`, `npm run build`, `npm run typecheck` e `npm run layout:audit`.
4. Abrir PR para `main` utilizando o harness/cliente Git de sua escolha. Nenhum serviço de IA roda dentro do repositório.
5. Conferir os workflows **CI** e **Layout Audit**, os relatórios e screenshots publicados.
6. Manter o bloqueio de merge para falhas reais. Publicação da aplicação e hospedagem de produção são atividades separadas.

Componentes coss são obtidos do registro oficial na preparação local/CI. Versionar os componentes e o lockfile após instalação verificada para maior reprodutibilidade.
