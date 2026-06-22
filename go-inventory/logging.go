package main

import (
	"context"

	"go.opentelemetry.io/otel/log"
	"go.opentelemetry.io/otel/log/global"
)

func logOtel(
	ctx context.Context,
	level string,
	message string,
) {

	logger := global.GetLoggerProvider().Logger(
		"go-inventory",
	)

	var severity log.Severity

	switch level {
	case "WARN":
		severity = log.SeverityWarn
	case "ERROR":
		severity = log.SeverityError
	default:
		severity = log.SeverityInfo
	}

	record := log.Record{}

	record.SetSeverity(
		severity,
	)

	record.SetSeverityText(
		level,
	)

	record.SetBody(
		log.StringValue(
			message,
		),
	)

	logger.Emit(
		ctx,
		record,
	)
}