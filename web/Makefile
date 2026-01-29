.PHONY: help build up down restart logs clean ps

help:
	@echo "Web Applications Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build       - Build Docker images for web applications"
	@echo "  up          - Start web application containers"
	@echo "  down        - Stop web application containers"
	@echo "  restart     - Restart web application containers"
	@echo "  logs        - View container logs"
	@echo "  ps          - Show running containers"
	@echo "  clean       - Remove containers and images"
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

shell-ryzo:
	docker-compose exec ryzotropik_app /bin/sh

shell-arr:
	docker-compose exec arriscada_app /bin/sh
