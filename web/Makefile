.PHONY: help build up up-watch down restart reload-nginx logs clean ps shell-ryzo shell-arr shell-proxy

help:
	@echo "Web Applications Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build         - Build Docker images for web applications"
	@echo "  up            - Start web application containers (bind mounts: latest site files on refresh)"
	@echo "  up-watch      - Compose v2 only: up with watch (nginx*.conf edits restart containers; see docker-compose.watch.yml)"
	@echo "  down          - Stop web application containers"
	@echo "  restart       - Restart web application containers"
	@echo "  reload-nginx  - nginx -s reload in app + proxy containers (after editing mounted nginx configs)"
	@echo "  logs          - View container logs"
	@echo "  ps            - Show running containers"
	@echo "  clean         - Remove containers and images"
	@echo "  shell-ryzo    - Open shell in ryzotropik container"
	@echo "  shell-arr     - Open shell in arriscada container"
	@echo "  shell-proxy   - Open shell in reverse proxy container"
	@echo ""
	@echo "Reverse proxy (after 'make up'): http://localhost:8080/"
	@echo "  /ryzotropik/  -> ryzotropik_app"
	@echo "  /arriscada/   -> arriscada_app"

build:
	docker-compose build

up:
	docker-compose up -d

up-watch:
	@command -v docker >/dev/null && docker compose version >/dev/null 2>&1 || (echo "up-watch needs Docker Compose v2 (install plugin: docker compose)"; exit 1)
	docker compose -f docker-compose.yml -f docker-compose.watch.yml up -d --watch

down:
	docker-compose down

restart: down up

reload-nginx:
	docker-compose exec -T ryzotropik_app nginx -s reload
	docker-compose exec -T arriscada_app nginx -s reload
	docker-compose exec -T proxy nginx -s reload

logs:
	docker-compose logs -f

ps:
	docker-compose ps

clean:
	docker-compose down -v --rmi local

shell-ryzo:
	docker-compose exec ryzotropik_app /bin/sh

shell-arr:
	docker-compose exec arriscada_app /bin/sh

shell-proxy:
	docker-compose exec proxy /bin/sh
