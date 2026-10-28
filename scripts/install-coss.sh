#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! command -v npm >/dev/null; then echo "Node.js e npm necessários." >&2; exit 1; fi

# Registros oficiais: atualizam arquivos locais em src/components/ui/.
# Não usar o preset @coss/style de Next.js, pois ele pode presumir app/layout.tsx.
echo 'Instalando os componentes COSS usados pela demonstração e tokens neutros...'
npx --yes shadcn@latest add @coss/button @coss/card @coss/input @coss/colors-neutral
printf '\nComponentes COSS instalados. Execute npm run dev e npm run layout:audit.\n'
