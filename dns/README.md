# BIND9 authoritative DNS Docker image (Alpine)

This folder contains files to build an Alpine-based Docker image running BIND9 as an authoritative server for the domain `ryzotropik.art.br`.

Files added:
- `Dockerfile` — builds Alpine + bind
- `entrypoint.sh` — starts `named` in foreground
- `named.conf` and `named.conf.options` — BIND configuration
- `zones/ryzotropik.art.br.db` — example zone file (replace placeholder IPs)
- `docker-compose.yml` — quick run helper

Build image:

```bash
docker build -t bind-ryzotropik .
```

Run (Docker):

```bash
docker run --rm -p 53:53/tcp -p 53:53/udp --cap-add=NET_BIND_SERVICE --name bind-ryzotropik bind-ryzotropik
```

Or using docker-compose:

```bash
docker compose up --build
```

Notes:
- Edit `zones/ryzotropik.art.br.db` and set `ns1`/`www` A records to the public IP you control, and bump the SOA serial number accordingly.
- This image is configured as authoritative-only (recursion disabled). If you need recursion, update `named.conf` options.
- For production expose, ensure your host firewall/NAT rules allow UDP/TCP on port 53.
# micelio
daqui pra cima
