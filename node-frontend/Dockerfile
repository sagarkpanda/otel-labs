FROM node:25-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

FROM node:25-alpine

WORKDIR /app

RUN addgroup -S -g 1001 nodeappuser && \
    adduser -S -u 1001 -G nodeappuser nodeappuser

COPY --from=deps --chown=1001:1001 /app/node_modules ./node_modules
COPY --chown=1001:1001 . .

USER 1001

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.opencontainers.image.title="node-frontend"
LABEL org.opencontainers.image.description="Node.js frontend service for OpenTelemetry learning lab"
LABEL org.opencontainers.image.authors="Sagar Panda"
LABEL org.opencontainers.image.vendor="Sagar Panda"
LABEL org.opencontainers.image.source="https://github.com/sagarkpanda/otel-labs"