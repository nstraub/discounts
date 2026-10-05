# The one production image: the backend, serving the built web app beside its API.
FROM node:26.9.0-alpine AS dependencies
WORKDIR /app
# Node 25 and later no longer bundle Corepack; the same version scripts/bootstrap.sh installs.
RUN npm install --global corepack@0.36.0 && corepack enable
# The manifests alone, so the install layer is rebuilt only when the dependencies change.
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/backend/package.json packages/backend/
COPY packages/frontend/package.json packages/frontend/
COPY packages/sut/package.json packages/sut/
COPY packages/types/package.json packages/types/
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn install --immutable --mode=skip-build

FROM dependencies AS build
# The web app calls the API on the origin that serves it.
ENV VITE_API_URL=''
COPY . .
RUN yarn workspace backend build && yarn workspace frontend build

FROM dependencies AS production-modules
RUN --mount=type=cache,target=/root/.yarn/berry/cache yarn workspaces focus backend --production

FROM node:26.9.0-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-modules /app/node_modules node_modules
COPY --from=build /app/packages/types packages/types
COPY --from=build /app/packages/backend/package.json packages/backend/package.json
COPY --from=build /app/packages/backend/dist packages/backend/dist
COPY --from=build /app/packages/backend/src/discounts/infra/migrations packages/backend/src/discounts/infra/migrations
COPY --from=build /app/packages/frontend/dist packages/frontend/dist
WORKDIR /app/packages/backend
USER node
EXPOSE 3000
# Each deploy brings the database to the latest schema before the app starts.
CMD ["sh", "-c", "node dist/migrate.js && exec node dist/main.js"]
