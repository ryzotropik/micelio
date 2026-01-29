.PHONY: help build up down restart logs clean ps

help:
	@echo "DNS Server Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  build       - Build Docker image for DNS server"
	@echo "  up          - Start DNS server container"
	@echo "  down        - Stop DNS server container"
	@echo "  restart     - Restart DNS server container"
	@echo "  logs        - View container logs"
	@echo "  ps          - Show running containers"
	@echo "  clean       - Remove containers and images"
	@echo "  shell       - Open shell in container"

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

shell:
	docker-compose exec bind /bin/bash
