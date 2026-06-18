# CineVerse X — Development Makefile
# Usage: make <target>

.PHONY: help up down build logs test-backend frontend clean pull

GITHUB_OWNER ?= Jatinjk2a

help:            ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Local (build from source) ─────────────────────────────────────────────────

up:              ## Start full stack from source (builds images)
	docker compose up --build -d

down:            ## Stop all containers
	docker compose down

build:           ## Build all Docker images without starting
	docker compose build

logs:            ## Tail all service logs
	docker compose logs -f

logs-%:          ## Tail logs for a specific service (e.g. make logs-auth-service)
	docker compose logs -f $*

restart-%:       ## Restart a specific service
	docker compose restart $*

# ── Pull from GHCR ────────────────────────────────────────────────────────────

pull:            ## Pull latest images from GHCR and start
	GITHUB_OWNER=$(GITHUB_OWNER) docker compose -f docker-compose.ghcr.yml pull
	GITHUB_OWNER=$(GITHUB_OWNER) docker compose -f docker-compose.ghcr.yml up -d

pull-down:       ## Stop GHCR stack
	docker compose -f docker-compose.ghcr.yml down

# ── Testing ───────────────────────────────────────────────────────────────────

test-backend:    ## Run all backend tests
	@for svc in auth-service movie-service booking-service notification-service gateway-service; do \
		echo "\n▶ Testing $$svc..."; \
		cd backend/$$svc && mvn -B test -q && cd ../..; \
	done

test-frontend:   ## Run frontend type-check + build
	cd frontend && npm ci && npx tsc --noEmit && npm run build

# ── Frontend dev ──────────────────────────────────────────────────────────────

frontend:        ## Start frontend dev server
	cd frontend && npm run dev

# ── Infra only ────────────────────────────────────────────────────────────────

infra:           ## Start only postgres, mongodb, redis, rabbitmq
	docker compose up -d postgres mongodb redis rabbitmq

infra-down:      ## Stop infra containers
	docker compose stop postgres mongodb redis rabbitmq

# ── Cleanup ───────────────────────────────────────────────────────────────────

clean:           ## Remove all containers and volumes (destructive!)
	docker compose down -v --remove-orphans

prune:           ## Prune unused Docker resources
	docker system prune -f
