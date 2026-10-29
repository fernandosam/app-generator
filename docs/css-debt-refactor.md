# Refatoração da dívida CSS legado

## Motivação

O projeto mantinha dois conjuntos paralelos de estilos: `src/styles/app.css` combinava tokens com estilos rígidos do formulário, e `src/styles/showcase.css` estilizada as telas de login, busca e dashboard, incluindo sobrescritas internas de coss. Com isso, o UI podia divergir das props, variantes e tokens oficiais.

## Mudanças

- **Cadastro:** substituição de estilos `.form-field input`, `.form-actions .primary-button`, `.registration-card` e classes de layout por Tailwind direto nos elementos. Mantidas rotas, atributos `data-layout-*`, estados de validação e sucesso.
- **Login/Busca/Dashboard:** remoção de regras `[data-slot]` e `.showcase-*`; composição por Tailwind e uso das variantes reais Button/Input/Card.
- **Layout compartilhado:** `DemoShell` passa a declarar layout responsivo localmente; `showcase.css` removido de `__root.tsx` e do repositório.
- **Tema:** `app.css` mantém tokens de cor, raio e tipografia, incluindo `@theme inline`; não recria controles.
- **Select de filtro:** controle HTML nativo, pois coss Select não está instalado; usa tokens e utilitários locais, sem nova dependência.

## Verificação

`npm run check:static`, `npm run check:harness`, `npm run test:unit`, `npm test`, `npm run build`, `npm run typecheck` e `npm run layout:audit`.

A auditoria Playwright inclui **4 telas, 19 cenários em 3 viewports** (390, 768 e 1440px); requer a inspeção das imagens produzidas para afirmar revisão visual efetiva. O CI não valida pixels e não equivale a uma aprovação de UX.
