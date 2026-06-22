module go-inventory

go 1.24

require (
	go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp v0.61.0

	go.opentelemetry.io/otel v1.36.0

	go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc v0.10.0
	go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc v1.36.0
	go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc v1.36.0

	go.opentelemetry.io/otel/log v0.10.0

	go.opentelemetry.io/otel/sdk v1.36.0
	go.opentelemetry.io/otel/sdk/log v0.10.0
	go.opentelemetry.io/otel/sdk/metric v1.36.0
)