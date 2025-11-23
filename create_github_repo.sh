#!/usr/bin/env bash
set -euo pipefail

# Parámetros
REPO_NAME="mejores-amigos-un-amor-imposible"
VISIBILITY="public"   # Cambia a 'private' si lo prefieres

# Obtiene tu usuario de GitHub a través de GH CLI
GH_USER="$(gh api user --jq .login)"

# Crea el repositorio en GitHub y sube el contenido local
gh repo create "${GH_USER}/${REPO_NAME}" \
  --"${VISIBILITY}" \
  --source . \
  --remote origin \
  --push \
  --description "Transmedia: libro, audiolibro y novela visual 'Mejores amigos… un amor imposible' v1.1.0" \
  --homepage "https://github.com/${GH_USER}/${REPO_NAME}" \
  --enable-issues \
  --enable-wiki

echo "Repositorio creado y contenido inicial subido a https://github.com/${hector1-cloud}/${mejores-amigos-un-amor-imposible}"