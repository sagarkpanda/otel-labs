from fastapi import FastAPI
import uuid
import requests
import random

from tracing import provider

from opentelemetry import metrics

from opentelemetry.instrumentation.fastapi import (
    FastAPIInstrumentor
)

from opentelemetry.instrumentation.requests import (
    RequestsInstrumentor
)

from opentelemetry._logs import (
    get_logger
)

from opentelemetry._logs.severity import (
    SeverityNumber
)

app = FastAPI()

FastAPIInstrumentor.instrument_app(app)
RequestsInstrumentor().instrument()

meter = metrics.get_meter(
    "python-orders"
)

orders_created = (
    meter.create_counter(
        "orders_created_total"
    )
)

orders_failed = (
    meter.create_counter(
        "orders_failed_total"
    )
)

inventory_requests = (
    meter.create_counter(
        "inventory_requests_total"
    )
)

otel_logger = get_logger(
    "python-orders"
)

SEVERITIES = {
    "INFO":
        SeverityNumber.INFO,

    "WARN":
        SeverityNumber.WARN,

    "ERROR":
        SeverityNumber.ERROR,
}


def log(
    level,
    message,
    **kwargs
):

    otel_logger.emit(
        severity_number=
            SEVERITIES.get(
                level,
                SeverityNumber.INFO
            ),

        severity_text=
            level,

        body=
            message,

        attributes={
            "service":
                "python-orders",

            **kwargs
        }
    )


@app.get("/")
def health():

    log(
        "INFO",
        "Health check"
    )

    return {
        "service": "python-orders",
        "status": "healthy"
    }


@app.get("/orders")
def create_order():

    inventory_requests.add(1)

    log(
        "INFO",
        "Order request received"
    )

    inventory = requests.get(
        "http://go-inventory:8080/inventory"
    ).json()

    requested_quantity = random.randint(
        1,
        10
    )

    if (
        inventory["stock"]
        < requested_quantity
    ):

        orders_failed.add(1)

        log(
            "WARN",
            "Order failed",
            requestedQuantity=
                requested_quantity,
            availableStock=
                inventory["stock"]
        )

        return {
            "status": "failed",
            "message":
                "Insufficient inventory",
            "requestedQuantity":
                requested_quantity,
            "inventory":
                inventory
        }

    orders_created.add(1)

    order_id = (
        f"ORD-{str(uuid.uuid4())[:8].upper()}"
    )

    log(
        "INFO",
        "Order created",
        orderId=
            order_id,
        requestedQuantity=
            requested_quantity
    )

    return {
        "orderId":
            order_id,
        "status":
            "created",
        "requestedQuantity":
            requested_quantity,
        "inventory":
            inventory
    }