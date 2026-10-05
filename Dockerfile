# The one production image: the backend, serving the built web app beside its API.
FROM node:26.9.0-alpine AS yarn
WORKDIR /app
# Node 25 and later no longer bundle Corepack; the same version scripts/bootstrap.sh installs.
RUN npm install --global corepack@0.36.0 && corepack enable
COPY . .

FROM yarn AS build
# The web app calls the API on the origin that serves it.
ENV VITE_API_URL=''
RUN yarn install --immutable --mode=skip-build \
  && yarn workspace backend build \
  && yarn workspace frontend build

# From the build's install, so the dependencies are fetched once, not by two installs at the same time.
FROM build AS production-modules
RUN yarn workspaces focus backend --production

FROM node:26.9.0-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-modules /app/node_modules node_modules
COPY --from=production-modules /app/packages/types packages/types
COPY --from=build /app/packages/backend/package.json packages/backend/package.json
COPY --from=build /app/packages/backend/dist packages/backend/dist
COPY --from=build /app/packages/frontend/dist packages/frontend/dist
WORKDIR /app/packages/backend
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
