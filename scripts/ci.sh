#!/usr/bin/env bash
# The deployment pipeline, run by .github/workflows/ci.yml and locally from the repository root: the
# commit stage, the deploy of the one production image to a production-like environment, then the
# acceptance stage against it. Docker Compose reads POSTGRES_HOST_PORT and APP_HOST_PORT from the
# environment or the root .env.
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi
deployed_app_url="http://localhost:${APP_HOST_PORT:-8080}"

echo '--- commit stage'
yarn install --immutable
yarn build
yarn eslint .
yarn test
docker compose up --detach --wait
yarn test:contract

echo '--- deploy'
docker compose --file docker-compose.production.yml up --build --detach --wait --remove-orphans

echo '--- acceptance stage'
DEPLOYED_APP_URL="$deployed_app_url" yarn test:skeleton
yarn test:bdd
