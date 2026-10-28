#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# São arquivos de instrução para agentes; não substituem dependências de runtime.
npx --yes skills add cosscom/ui
npx --yes skills add jakubkrehel/skills --skill better-layout
# A skill layout recomenda carregar a base impeccable antes da auditoria.
npx --yes skills add pbakaus/impeccable --skill impeccable
npx --yes skills add pbakaus/impeccable --skill layout
