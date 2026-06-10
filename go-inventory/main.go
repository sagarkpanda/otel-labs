package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"

	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"

	"go.opentelemetry.io/otel"
	metricapi "go.opentelemetry.io/otel/metric"
)

type InventoryResponse struct {
	ProductID   string `json:"productId"`
	ProductName string `json:"productName"`
	Stock       int    `json:"stock"`
}

var (
	inventoryRequests metricapi.Int64Counter
	inStockCounter    metricapi.Int64Counter
	outOfStockCounter metricapi.Int64Counter
)

func logJSON(
	level string,
	message string,
) {
	log.Println(
		fmt.Sprintf(
			`{"service":"go-inventory","level":"%s","message":"%s"}`,
			level,
			message,
		),
	)
}

func inventoryHandler(
	w http.ResponseWriter,
	r *http.Request,
) {

	ctx := context.Background()

	inventoryRequests.Add(
		ctx,
		1,
	)

	inStock := rand.Intn(10) < 8

	stock := 0

	if inStock {

		inStockCounter.Add(
			ctx,
			1,
		)

		logJSON(
			"INFO",
			"Inventory available",
		)

		stock = rand.Intn(6) + 5

	} else {

		outOfStockCounter.Add(
			ctx,
			1,
		)

		logJSON(
			"WARN",
			"Out of stock",
		)
	}

	response := InventoryResponse{
		ProductID:   "P-1001",
		ProductName: "Observability Handbook",
		Stock:       stock,
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(
		response,
	)
}

func main() {

	shutdown := initTracer()
	defer shutdown()

	meter := otel.Meter(
		"go-inventory",
	)

	var err error

	inventoryRequests, err =
		meter.Int64Counter(
			"inventory_requests_total",
		)

	if err != nil {
		log.Fatal(err)
	}

	inStockCounter, err =
		meter.Int64Counter(
			"inventory_in_stock_total",
		)

	if err != nil {
		log.Fatal(err)
	}

	outOfStockCounter, err =
		meter.Int64Counter(
			"inventory_out_of_stock_total",
		)

	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()

	mux.Handle(
		"/inventory",
		otelhttp.NewHandler(
			http.HandlerFunc(
				inventoryHandler,
			),
			"GET /inventory",
		),
	)

	logJSON(
		"INFO",
		"Service started",
	)

	log.Println(
		"Go inventory running on :8080",
	)

	if err := http.ListenAndServe(
		":8080",
		mux,
	); err != nil {
		log.Fatal(err)
	}
}