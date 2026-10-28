# Publicação de app-generator (repositório público)

A publicação exige autenticação com uma conta que possa criar repositórios. Não incluir o `.env` nem `node_modules` no Git.

## Método recomendado — GitHub CLI

1. Abra o terminal na raiz do projeto e autentique: `gh auth login`.
2. Se o ZIP não vier com `.git`, execute:

   ```bash
   git init -b main
   git add .
   git commit -m 'feat: initial context-aware app generator with TanStack Start'
   ```

3. Crie e publique: `gh repo create app-generator --public --source=. --remote=origin --push`.
4. Confirme: `gh repo view --web`; inspecione a aba **Actions**.
5. Configure `OPENAI_API_KEY` somente se quiser os workflows manuais de IA; em **Settings → Actions → General** permita que GitHub Actions criem pull requests.
6. Execute **CI** e **Layout audit** manualmente pela aba Actions e corrija problemas reais antes de exigir as verificações em branch protection.

Se o repositório **já estiver criado vazio** em `fernandosam/app-generator`, use `git remote add origin https://github.com/fernandosam/app-generator.git && git push -u origin main` em vez de `gh repo create`.

## Limites

- GitHub Actions **executa testes e gera evidências**, não hospeda a aplicação. Hospedagem de produção depende de escolha e configuração separadas.
- `Generate screen` e `Refine layout` não são acionados por PRs externos, para impedir execução do modelo com secrets em código não confiável.
- Scripts de agente têm acesso apenas ao workspace da execução; revisões e PRs devem passar por revisão de código.
- Os componentes coss são obtidos do registro oficial no bootstrap; gerar e versionar o lockfile e os componentes após uma instalação verificada.
