FROM node:20-alpine AS deps
WORKDIR /app

# Workspace manifests
COPY package*.json ./
COPY core/package*.json core/
COPY common/package*.json common/
COPY scripts/package*.json scripts/
COPY apps/api/package*.json apps/api/
COPY apps/web-client/package*.json apps/web-client/

RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app /app
COPY . .

# Build front-end bundle ahead of time
RUN npm run build --workspace apps/web-client

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    API_PORT=3000 \
    FRONTEND_PORT=4173

COPY --from=build /app /app

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000 4173

ENTRYPOINT ["docker-entrypoint.sh"]

