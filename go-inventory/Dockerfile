FROM golang:1.24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY . .

RUN go mod tidy

RUN go build -o inventory .

FROM alpine:3.22

WORKDIR /app

COPY --from=builder /app/inventory .

EXPOSE 8080

CMD ["./inventory"]

LABEL org.opencontainers.image.title="go-inventory"
LABEL org.opencontainers.image.description="Go inventory service for OpenTelemetry learning lab"
LABEL org.opencontainers.image.authors="Sagar Panda"
LABEL org.opencontainers.image.vendor="Sagar Panda"
LABEL org.opencontainers.image.source="https://github.com/sagarkpanda/otel-labs"