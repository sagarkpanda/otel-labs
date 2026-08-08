FROM golang:1.24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN go mod tidy && go build -o inventory .

FROM alpine:3.22

WORKDIR /app

RUN addgroup -S -g 1001 goappuser && \
    adduser -S -u 1001 -G goappuser goappuser

COPY --from=builder --chown=1001:1001 /app/inventory .

USER 1001

EXPOSE 8080

CMD ["./inventory"]

LABEL org.opencontainers.image.title="go-inventory"
LABEL org.opencontainers.image.description="Go inventory service for OpenTelemetry learning lab"
LABEL org.opencontainers.image.authors="Sagar Panda"
LABEL org.opencontainers.image.vendor="Sagar Panda"
LABEL org.opencontainers.image.source="https://github.com/sagarkpanda/otel-labs"