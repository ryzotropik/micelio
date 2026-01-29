.PHONY: help build up down restart logs clean ps

help:
	@echo "Webserver (Reverse Proxy) Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build       - Build Docker images for webserver"
	@echo "  up          - Start webserver containers"
	@echo "  down        - Stop webserver containers"
	@echo "  restart     - Restart webserver containers"
	@echo "  logs        - View container logs"
	@echo "  ps          - Show running containers"
	@echo "  clean       - Remove containers and images"
	@echo "  shell-nginx - Open shell in nginx proxy container"
	@echo "  shell-ryzo  - Open shell in ryzotropik container"
	@echo "  shell-arr   - Open shell in arriscada container"

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart: down up

logs:
	docker-compose logs -f

ps:
	docker-compose ps

clean:
	docker-compose down -v
	docker-compose rmi

shell-nginx:
	docker-compose exec nginx /bin/sh

shell-ryzo:
	docker-compose exec ryzotropik_app /bin/sh

shell-arr:
	docker-compose exec arriscada_app /bin/sh
