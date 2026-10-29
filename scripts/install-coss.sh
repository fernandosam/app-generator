#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Componentes coss UI versionados em src/components/ui/ (Button, Card, Input, Spinner)." 
echo "Para atualizar, consulte a origem oficial em https://github.com/cosscom/ui e revise o diff antes de commitar."
echo "Não execute atualização mutável durante build e CI."
