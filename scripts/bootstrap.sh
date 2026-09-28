#!/usr/bin/env bash
# Prepares a fresh machine and clone: Corepack (which provides the pinned Yarn), then yarn install,
# whose postinstall copies the env files and installs the git hooks and the Playwright browser.
# Then it wipes the local databases (their volume) and starts Postgres afresh in the background, waiting
# until it is healthy. Run from the repository root.
set -euo pipefail

# Node 25 and later no longer bundle Corepack; this pins the version CI uses.
if ! command -v corepack >/dev/null; then
  npm install --global corepack@0.36.0
fi
corepack enable
yarn install
docker compose down --volumes
docker compose up --detach --wait
