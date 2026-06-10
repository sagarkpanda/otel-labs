FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

LABEL org.opencontainers.image.title="node-frontend"
LABEL org.opencontainers.image.description="Node.js frontend service for OpenTelemetry learning lab"
LABEL org.opencontainers.image.authors="Sagar Panda"
LABEL org.opencontainers.image.vendor="Sagar Panda"
LABEL org.opencontainers.image.source="https://github.com/sagarkpanda/otel-labs"
