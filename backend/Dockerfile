# ── Stage 1: Build Go binary ───────────────────────────────
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install build deps
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o heart-predict-api .

# ── Stage 2: Runtime image ─────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install Python deps for inference
RUN pip install --no-cache-dir scikit-learn==1.4.0 numpy==1.26.4

# Copy Go binary
COPY --from=builder /app/heart-predict-api .

# Copy ML artifacts
COPY ml/ ./ml/

# Expose port
EXPOSE 8080

ENV PORT=8080
ENV PYTHON_PATH=python3
ENV ML_DIR=./ml
ENV GIN_MODE=release

CMD ["./heart-predict-api"]
