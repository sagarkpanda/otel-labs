FROM python:3.13.13-slim-trixie

WORKDIR /app

RUN apt-get update && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

RUN addgroup --system --gid 1001 pythonappuser && \
    adduser --system --uid 1001 --gid 1001 pythonappuser

COPY --chown=1001:1001 . .

USER 1001

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

LABEL org.opencontainers.image.title="python-orders"
LABEL org.opencontainers.image.description="Python order service for OpenTelemetry learning lab"
LABEL org.opencontainers.image.authors="Sagar Panda"
LABEL org.opencontainers.image.vendor="Sagar Panda"
LABEL org.opencontainers.image.source="https://github.com/sagarkpanda/otel-labs"