const {
  logs,
  SeverityNumber,
} = require(
  "@opentelemetry/api-logs"
);

const {
  context,
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
      service:
        "node-frontend",

      ...attributes,
    },

    context:
      context.active(),
  });
}

module.exports = {
  log,
};