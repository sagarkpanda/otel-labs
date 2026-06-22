package main

import (
	"context"
	"log"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"

	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"

	"go.opentelemetry.io/otel/exporters/otlp/otlplog/otlploggrpc"

	"go.opentelemetry.io/otel/propagation"

	"go.opentelemetry.io/otel/sdk/resource"

	sdklog "go.opentelemetry.io/otel/sdk/log"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"

	"go.opentelemetry.io/otel/log/global"

	semconv "go.opentelemetry.io/otel/semconv/v1.26.0"
)

func initTracer() func() {

	ctx := context.Background()

	res, err := resource.New(
		ctx,
		resource.WithAttributes(
			semconv.ServiceName(
				"go-inventory",
			),
			attribute.String(
				"service.version",
				"1.0.0",
			),
		),
	)

	if err != nil {
		log.Fatal(err)
	}

	//
	// Trace Exporter
	//

	traceExporter, err := otlptracegrpc.New(
		ctx,
		otlptracegrpc.WithEndpoint(
			"otel-collector:4317",
		),
		otlptracegrpc.WithInsecure(),
	)

	if err != nil {
		log.Fatal(err)
	}

	tracerProvider := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(
			traceExporter,
		),
		sdktrace.WithResource(
			res,
		),
	)

	otel.SetTracerProvider(
		tracerProvider,
	)

	//
	// Metric Exporter
	//

	metricExporter, err := otlpmetricgrpc.New(
		ctx,
		otlpmetricgrpc.WithEndpoint(
			"otel-collector:4317",
		),
		otlpmetricgrpc.WithInsecure(),
	)

	if err != nil {
		log.Fatal(err)
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(
			sdkmetric.NewPeriodicReader(
				metricExporter,
				sdkmetric.WithInterval(
					10*time.Second,
				),
			),
		),
		sdkmetric.WithResource(
			res,
		),
	)

	otel.SetMeterProvider(
		meterProvider,
	)

	//
	// Log Exporter
	//

	logExporter, err := otlploggrpc.New(
		ctx,
		otlploggrpc.WithEndpoint(
			"otel-collector:4317",
		),
		otlploggrpc.WithInsecure(),
	)

	if err != nil {
		log.Fatal(err)
	}

	loggerProvider := sdklog.NewLoggerProvider(
		sdklog.WithProcessor(
			sdklog.NewBatchProcessor(
				logExporter,
			),
		),
		sdklog.WithResource(
			res,
		),
	)

	global.SetLoggerProvider(
		loggerProvider,
	)

	otel.SetTextMapPropagator(
		propagation.NewCompositeTextMapPropagator(
			propagation.TraceContext{},
			propagation.Baggage{},
		),
	)

	log.Println(
		"OpenTelemetry initialized",
	)

	return func() {

		_ = loggerProvider.Shutdown(
			context.Background(),
		)

		_ = meterProvider.Shutdown(
			context.Background(),
		)

		_ = tracerProvider.Shutdown(
			context.Background(),
		)
	}
}