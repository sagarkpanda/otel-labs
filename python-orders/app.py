from fastapi import FastAPI
import uuid
import requests
import random
import logging
import json

from tracing import provider

from opentelemetry import metrics

from opentelemetry.instrumentation.fastapi import (
    FastAPIInstrumentor
)

from opentelemetry.instrumentation.requests import (
    RequestsInstrumentor
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

logging.basicConfig(
    level=logging.INFO,
    format="%(message)s"
)

logger = logging.getLogger(
    "python-orders"
)


def log(
    level,
    message,
    **kwargs
):
    payload = {
        "service":
            "python-orders",
        "level":
            level,
        "message":
            message,
        **kwargs
    }

    logger.info(
        json.dumps(payload)
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
            "message": "Insufficient inventory",
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
        orderId=order_id,
        requestedQuantity=
            requested_quantity
    )

    return {
        "orderId": order_id,
        "status": "created",
        "requestedQuantity":
            requested_quantity,
        "inventory":
            inventory
    }