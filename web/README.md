# p5.js static sites (Docker)

This folder contains a minimal Docker-based static server for p5.js projects. It's intended as a base image that can be used for multiple domains; site files are mounted into the container at `/usr/share/nginx/html`.

Structure:
- `Dockerfile` — builds an nginx-based static server
- `nginx.conf` — simple server config
- `ryzotropik/` — sample p5.js page for `ryzotropik.art.br` (index.html + sketch.js)
- `arriscada/` — sample p5.js page for `arriscada.com.br` (index.html + sketch.js)
- `docker-compose.yml` — example to run two containers (one per domain) mounting the folders

Quick start (build & run both site containers):

```bash
cd web
docker compose up --build
```

Notes:
- Each service mounts the corresponding folder into the image: edit files locally and refresh the page to see changes.
- The `webserver` reverse-proxy can be configured to route `www.ryzotropik.art.br` and `www.arriscada.com.br` to these containers (names `ryzotropik_app` and `arriscada_app`).
- p5.js is loaded from CDN in the examples. For offline use, add the library to each folder.
