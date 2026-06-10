const {
  logs,
  SeverityNumber,
} = require(
  "@opentelemetry/api-logs"
);

const {
  context,
  trace,
} = require(
  "@opentelemetry/api"
);

const SEVERITY_MAP = {
  DEBUG:
    SeverityNumber.DEBUG,

  INFO:
    SeverityNumber.INFO,

  WARN:
    SeverityNumber.WARN,

  ERROR:
    SeverityNumber.ERROR,

  FATAL:
    SeverityNumber.FATAL,
};

function log(
  severityText,
  message,
  attributes = {}
) {

  const logger =
    logs.getLogger(
      "node-frontend"
    );

  const activeContext =
    context.active();

  const span =
    trace.getSpan(
      activeContext
    );

  const spanContext =
    span?.spanContext();

  logger.emit({
    severityNumber:
      SEVERITY_MAP[
        severityText
      ] ??
      SeverityNumber.INFO,

    severityText,

    body:
      message,

    attributes: {
      ...attributes,

      ...(spanContext && {
        trace_id:
          spanContext.traceId,

        span_id:
          spanContext.spanId,
      }),
    },

    context:
      activeContext,
  });
}

module.exports = {
  log,
};