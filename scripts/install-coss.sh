#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

usage() {
  cat <<'HELP'
Uso: npm run ui:install -- @coss/p-<nome>-<numero> [outros itens] [--overwrite]
Instala somente partículas explicitamente selecionadas pelo registry oficial coss UI.
As primitivas oficiais já estão versionadas em src/components/ui/.
Exemplo: npm run ui:install -- @coss/p-button-1
HELP
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if [[ $# -eq 0 ]]; then
  usage >&2
  exit 2
fi

count=0
for arg in "$@"; do
  case "$arg" in
    @coss/p-*)
      if [[ ! "$arg" =~ ^@coss/p-[a-z0-9]+(-[a-z0-9]+)*-[0-9]+$ ]]; then
        echo "Partícula inválida: $arg" >&2
        exit 2
      fi
      count=$((count + 1))
      ;;
    --overwrite) ;;
    *)
      echo "Argumento não suportado: $arg (somente @coss/p-* e --overwrite)" >&2
      exit 2
      ;;
  esac
done

if [[ "$count" -eq 0 ]]; then
  echo "Informe ao menos uma partícula @coss/p-*." >&2
  exit 2
fi

exec npm exec --yes --package=shadcn@4.1.0 -- shadcn add --yes "$@"
