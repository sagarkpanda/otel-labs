from opentelemetry import trace
from opentelemetry import metrics

from opentelemetry.sdk.resources import Resource

from opentelemetry.sdk.trace import TracerProvider

from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor
)

from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import (
    OTLPSpanExporter
)

from opentelemetry.sdk.metrics import (
    MeterProvider
)

from opentelemetry.sdk.metrics.export import (
    PeriodicExportingMetricReader
)

from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import (
    OTLPMetricExporter
)


resource = Resource.create(
    {
        "service.name": "python-orders"
    }
)

#
# Traces
#

provider = TracerProvider(
    resource=resource
)

processor = BatchSpanProcessor(
    OTLPSpanExporter(
        endpoint="otel-collector:4317",
        insecure=True
    )
)

provider.add_span_processor(
    processor
)

trace.set_tracer_provider(
    provider
)

#
# Metrics
#

metric_reader = (
    PeriodicExportingMetricReader(
        OTLPMetricExporter(
            endpoint="otel-collector:4317",
            insecure=True
        ),
        export_interval_millis=10000
    )
)

meter_provider = MeterProvider(
    resource=resource,
    metric_readers=[
        metric_reader
    ]
)

metrics.set_meter_provider(
    meter_provider
)

print(
    "OpenTelemetry initialized"
)