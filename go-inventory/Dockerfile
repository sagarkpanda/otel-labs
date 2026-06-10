FROM golang:1.24-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod tidy

RUN go build -o inventory .

FROM alpine:3.22

WORKDIR /app

COPY --from=builder /app/inventory .

EXPOSE 8080

CMD ["./inventory"]