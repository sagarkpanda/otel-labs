# OTel Labs – OpenTelemetry on EKS for End to End Observability

Next Repo => <a href="https://github.com/sagarkpanda/otel-labs-platform">Repo with K8s, Terraform config</a>

<img src="images/o11y.png" alt="Screenshot" width="600">

## Overview

OTel Labs is a hands-on observability project built to learn OpenTelemetry across multiple programming languages and deployment environments.

The project consists of three microservices:

- Node.js Frontend
- Python Orders Service
- Go Inventory Service

Each service is instrumented with OpenTelemetry and exports telemetry data to a centralized OpenTelemetry Collector.

The collector forwards traces, metrics, and logs to New Relic for visualization and analysis.

### Architecture

```mermaid
graph TD
    A[Node Frontend] --> B[Python Orders]
    B --> C[Go Inventory]
    C --> D[OpenTelemetry Collector]
    D --> E[New Relic]
```
## Features

### Distributed Tracing

Track requests as they flow through multiple services.

Example:

```
node-frontend
      ↓
python-orders
      ↓
go-inventory

```
### Metrics

Collect application and runtime metrics including:

- Request counts
- Request duration
- Custom business metrics
- Runtime metrics

### Logs

Export structured logs through OpenTelemetry.

Vendor Neutral Instrumentation

Applications use standard OpenTelemetry SDKs and are not tied to any observability vendor.

Only the collector configuration changes when switching backends.

Backends tested during development:

- New Relic
- Honeycomb
- Datadog
  
But others will also work as otel is vendor neutral.

## Tech Stack

### Applications

- Node.js
- Python
- Go

### Observability

- OpenTelemetry SDKs
- OpenTelemetry Collector

### Containerization

- Docker
- Docker Compose

### CI/CD

- GitHub Actions
- GitHub Container Registry (GHCR)
- Argo CD
  
### Observability Backend

- New Relic
- Honeycomb.io (limited use, only for claude mcp)

### Container Orchestration 
- AWS EKS
- Traefik ingress
- Hasicorp Vault for secret

## Local Development

Start the entire stack:

docker compose up --build

| Service                  | Port       |
|--------------------------|------------|
| Node Frontend            | 3000       |
| Python Orders            | 8000       |
| Go Inventory             | 8080       |
| OpenTelemetry Collector  | 4317 / 4318 |

Environment Variables

Create a ".env" file:

```
NR_KEY=<your_new_relic_license_key>

GHCR_OWNER=<your gh username>
IMAGE_TAG=local
```
The collector reads this value and uses it to export telemetry to New Relic.

Do not commit the ".env" file to source control.

## GitHub Actions

A GitHub Actions workflow automatically:

1. Builds application images
2. Builds using Docker Compose
3. Pushes images to GitHub Container Registry (GHCR)
4. Updates the image tag in the manifest of the otel-labs-platform repo.

Resulting images:

ghcr.io/<github-user>/node-frontend
ghcr.io/<github-user>/python-orders
ghcr.io/<github-user>/go-inventory

Current Learning Goals

- OpenTelemetry fundamentals
- Distributed tracing
- Metrics and logging
- OpenTelemetry Collector configuration
- Multi-language instrumentation
- Docker-based deployments
- GitHub Actions CI/CD
- Container image publishing

Planned Roadmap

Phase 1 – Completed

- Node.js instrumentation
- Python instrumentation
- Go instrumentation
- OpenTelemetry Collector
- New Relic integration
- Docker Compose setup
- GitHub Actions build and push

Phase 2 – Completed

- GitHub Container Registry (GHCR)
- Kubernetes manifests
- Kustomize-based image updates

Phase 3 – Completed

- Amazon EKS deployment
- ArgoCD GitOps workflow
- Automated image promotion
- Kubernetes observability

Phase 4 – Planned

- Kubernetes node telemetry
- Pod telemetry
- Container telemetry
- Deployment metadata
- End-to-end observability on EKS
- New Relic Kubernetes monitoring


Disclaimer

This repository is intended as a learning project for exploring OpenTelemetry, observability practices, Kubernetes, and GitOps workflows.
