const {
  NodeSDK,
} = require(
  "@opentelemetry/sdk-node"
);

const {
  getNodeAutoInstrumentations,
} = require(
  "@opentelemetry/auto-instrumentations-node"
);

const {
  OTLPTraceExporter,
} = require(
  "@opentelemetry/exporter-trace-otlp-http"
);

const {
  OTLPMetricExporter,
} = require(
  "@opentelemetry/exporter-metrics-otlp-http"
);

const {
  OTLPLogExporter,
} = require(
  "@opentelemetry/exporter-logs-otlp-http"
);

const {
  BatchLogRecordProcessor,
} = require(
  "@opentelemetry/sdk-logs"
);

const {
  PeriodicExportingMetricReader,
} = require(
  "@opentelemetry/sdk-metrics"
);

const traceExporter =
  new OTLPTraceExporter({
    url:
      "http://otel-collector:4318/v1/traces",
  });

const metricExporter =
  new OTLPMetricExporter({
    url:
      "http://otel-collector:4318/v1/metrics",
  });

const logExporter =
  new OTLPLogExporter({
    url:
      "http://otel-collector:4318/v1/logs",
  });

const metricReader =
  new PeriodicExportingMetricReader({
    exporter:
      metricExporter,
    exportIntervalMillis:
      10000,
  });

const sdk =
  new NodeSDK({
    serviceName:
      "node-frontend",

    traceExporter,

    metricReader,

    logRecordProcessors: [
      new BatchLogRecordProcessor(
        logExporter
      ),
    ],

    instrumentations: [
      getNodeAutoInstrumentations(),
    ],
  });

sdk.start();

console.log(
  "OpenTelemetry initialized"
);