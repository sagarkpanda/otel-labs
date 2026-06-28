FROM node:26-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

FROM node:26-alpine

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.opencontainers.image.title="node-frontend"
LABEL org.opencontainers.image.description="Node.js frontend service for OpenTelemetry learning lab"
LABEL org.opencontainers.image.authors="Sagar Panda"
LABEL org.opencontainers.image.vendor="Sagar Panda"
LABEL org.opencontainers.image.source="https://github.com/sagarkpanda/otel-labs"