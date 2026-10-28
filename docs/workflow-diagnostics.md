# Workflow diagnostics

This repository uses two automated workflows (CI and Layout Audit) and two manual AI workflows.

The PR checks are the authoritative source for the failures that need fixing. Inspect
the failing job and its *first failing step*, then reproduce the same command locally.
Avoid skipping failing tests or turning real failures into warnings.

Current verification commands:

```sh
npm install --no-audit --no-fund
npm run ui:install
npm run check:static
npm run test:unit
npm test
npm run build
npm run typecheck
npx playwright install --with-deps chromium
npm run layout:audit
```

The COSS registry install is a prerequisite to building this starter. Fail early if
the registry or npm is unavailable; do not silently replace coss UI with unrelated components.
