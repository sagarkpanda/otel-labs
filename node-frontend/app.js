const express = require("express");

const {
  log,
} = require("./logger");

const {
  metrics,
} = require("@opentelemetry/api");

const app = express();
const PORT = 3000;

const meter =
  metrics.getMeter(
    "node-frontend"
  );

const frontendRequests =
  meter.createCounter(
    "frontend_requests_total"
  );

const frontendOrderRequests =
  meter.createCounter(
    "frontend_order_requests_total"
  );

const frontendErrors =
  meter.createCounter(
    "frontend_errors_total"
  );

app.use(express.static("public"));

function renderPage(title, content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <title>${title}</title>

    <link
      rel="icon"
      type="image/svg+xml"
      href="/favicon.svg"
    >

    <link
      rel="stylesheet"
      href="/style.css"
    >
  </head>

  <body>

    <div class="blob blob1"></div>
    <div class="blob blob2"></div>
    <div class="blob blob3"></div>

    <div class="card">
      ${content}
    </div>

  </body>
  </html>
  `;
}

app.get("/", (req, res) => {

  frontendRequests.add(1);

  log(
    "INFO",
    "Home page viewed"
  );

  res.send(
    renderPage(
      "OTel Lab",
      `
      <h1>🔭 OTel Lab</h1>

      <p class="subtitle">
        Polyglot Observability Demo
      </p>

      <hr>

      <h3>📘 Featured Product</h3>

      <p>
        <strong>Observability Handbook</strong>
      </p>

      <p>
        Learn distributed tracing,
        metrics, logs and OpenTelemetry.
      </p>

      <hr>

      <h3>Request Flow</h3>

      <div class="flow">

        <div class="flow-card">
          🟢 Node Frontend
        </div>

        <div class="arrow">↓</div>

        <div class="flow-card">
          🐍 Python Orders
        </div>

        <div class="arrow">↓</div>

        <div class="flow-card">
          🐹 Go Inventory
        </div>

      </div>

      <a class="button" href="/order">
        Order Book
      </a>
      `
    )
  );
});

app.get("/order", async (req, res) => {

  frontendOrderRequests.add(1);

  log(
    "INFO",
    "Order requested"
  );

  try {

    const response = await fetch(
      "http://python-orders:8000/orders"
    );

    if (!response.ok) {
      throw new Error(
        `Orders API returned ${response.status}`
      );
    }

    const order =
      await response.json();

    if (
      order.status === "failed"
    ) {

      log(
        "WARN",
        "Order failed",
        {
          requestedQuantity:
            order.requestedQuantity,

          availableStock:
            order.inventory.stock,
        }
      );

      return res.send(
        renderPage(
          "Out Of Stock",
          `
          <div class="success">❌</div>

          <h2>Out Of Stock</h2>

          <p class="error">
            ${order.message}
          </p>

          <p>
            <strong>Requested Quantity:</strong>
            ${order.requestedQuantity}
          </p>

          <hr>

          <h3>Inventory Information</h3>

          <p>
            <strong>Product:</strong>
            ${order.inventory.productName}
          </p>

          <p>
            <strong>Product ID:</strong>
            ${order.inventory.productId}
          </p>

          <p>
            <strong>Available Stock:</strong>
            ${order.inventory.stock}
          </p>

          <p class="warning">
            Requested quantity exceeds available inventory.
          </p>

          <p>
            <strong>Shortfall:</strong>
            ${
              order.requestedQuantity -
              order.inventory.stock
            }
          </p>

          <a class="button" href="/order">
            Try Again
          </a>

          <br>

          <a class="button" href="/">
            ← Back to Home
          </a>
          `
        )
      );
    }

    log(
      "INFO",
      "Order created",
      {
        orderId:
          order.orderId,

        requestedQuantity:
          order.requestedQuantity,
      }
    );

    res.send(
      renderPage(
        "Order Created",
        `
        <div class="success">✅</div>

        <h2>Order Created</h2>

        <p>
          <strong>Order ID:</strong>
          ${order.orderId}
        </p>

        <p>
          <strong>Status:</strong>
          ${order.status}
        </p>

        <p>
          <strong>Requested Quantity:</strong>
          ${order.requestedQuantity}
        </p>

        <hr>

        <h3>Inventory Information</h3>

        <p>
          <strong>Product:</strong>
          ${order.inventory.productName}
        </p>

        <p>
          <strong>Product ID:</strong>
          ${order.inventory.productId}
        </p>

        <p>
          <strong>Available Stock:</strong>
          ${order.inventory.stock}
        </p>

        <a class="button" href="/">
          ← Back to Home
        </a>
        `
      )
    );

  } catch (err) {

    frontendErrors.add(1);

    log(
      "ERROR",
      err.message,
      {
        "exception.type":
          err.name,

        "exception.message":
          err.message,

        "exception.stacktrace":
          err.stack,
      }
    );

    res.status(500).send(
      renderPage(
        "Error",
        `
        <div class="success">❌</div>

        <h2>Order Failed</h2>

        <p>${err.message}</p>

        <a class="button" href="/">
          ← Back to Home
        </a>
        `
      )
    );
  }
});

app.listen(PORT, () => {
  console.log(
    `Frontend running on port ${PORT}`
  );
});