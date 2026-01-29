# Nginx reverse-proxy scaffolding

This folder contains a simple Dockerized nginx reverse-proxy routing `www.ryzotropik.art.br` and `www.arriscada.com.br` to two sample target containers.

Files:
- Dockerfile — builds nginx image including `conf.d/reverse.conf`
- `conf.d/reverse.conf` — proxy rules for the two hostnames
- `html/` — sample site content used by the target containers
- `docker-compose.yml` — runs the proxy and two sample target services

Run locally:

```bash
cd webserver
docker compose up --build
```

Notes:
- Ensure DNS for `www.ryzotropik.art.br` and `www.arriscada.com.br` point to the host running this proxy.
- Replace the sample target containers with your real services by changing `ryzotropik_app` and `arriscada_app` in `docker-compose.yml`.
