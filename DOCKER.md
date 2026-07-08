# Docker Deployment

The portfolio ships with a ready-to-run Docker Compose setup. The same code
runs unchanged in local development and inside Docker — the only difference is
where JSON data and uploaded files are stored, controlled by the `DATA_DIR`
environment variable.

## Architecture

```
                  Browser
                     │
                     ▼
        ┌────────────────────────┐
        │  frontend (nginx:80)   │
        │  Vue SPA + reverse     │
        │  proxy for /api,       │
        │  /uploads              │
        └────────────┬───────────┘
                     │ http://backend:3001
                     ▼
        ┌────────────────────────┐
        │  backend (node:20)     │
        │  Express on port 3001  │
        └────────────┬───────────┘
                     │
       ┌─────────────┴─────────────┐
       ▼                           ▼
  portfolio-data              backend-uploads
  /app/data                   /app/uploads
  (JSON files)                (profile, project, cv.pdf)
```

## Requirements

- Docker Engine 20.10+
- Docker Compose v2 (`docker compose` CLI)

## Quick start

From the project root:

```bash
# Build and start both services in the background
docker compose up -d --build

# Tail logs
docker compose logs -f

# Stop
docker compose down
```

After the build finishes:

- Frontend: <http://localhost>
- Backend API: <http://localhost:3001/api/health>

The frontend's nginx proxies `/api/*` and `/uploads/*` to the backend
container, so the SPA only needs to know its own origin.

## Volumes

| Volume        | Mount point (in container) | Contents                              |
| ------------- | -------------------------- | ------------------------------------- |
| `portfolio-data`   | `/app/data`           | JSON files: `projects.json`, `skills.json`, `settings.json`, `about.json`, `contact.json` |
| `backend-uploads`  | `/app/uploads`        | Uploaded profile photo, project thumbnails, `cv.pdf` |

Both volumes are **named volumes** managed by Docker — they survive
`docker compose down` and `docker compose up`. To wipe persistent data:

```bash
docker compose down -v
```

## Configuration

All backend configuration is via environment variables in `docker-compose.yml`:

| Variable      | Default in compose | Purpose                                                |
| ------------- | ------------------ | ------------------------------------------------------ |
| `DATA_DIR`    | `/app/data`        | Directory where JSON files are read/written.           |
| `PORT`        | `3001`             | Port the Express server listens on.                    |
| `CORS_ORIGIN` | `http://localhost` | Comma-separated list of allowed CORS origins.          |
| `JWT_SECRET`  | `change_me_in_production` | Secret used to sign admin JWTs. **Must be overridden in production** via a `.env` file or your orchestrator's secret store. If unset, the backend prints a warning at startup. |

For local dev (`npm run dev` in `backend/`), `DATA_DIR` defaults to
`backend/data/` relative to the backend folder (handled by
`backend/lib/dataPath.js`), so no environment variables are required.

## Useful commands

```bash
# Rebuild only the backend after code changes
docker compose build backend

# Open a shell inside the backend container
docker compose exec backend sh

# Inspect persisted data
docker volume inspect cvwebsite_portfolio-data
docker volume inspect cvwebsite_backend-uploads

# View backend logs only
docker compose logs -f backend

# Restart a single service
docker compose restart backend
```

## How it works

- `backend/Dockerfile` uses `node:20-alpine`, installs production deps only,
  and pre-creates `/app/data` and `/app/uploads` so volume mounts land on
  existing directories.
- `frontend/Dockerfile` is a two-stage build: `node:20-alpine` runs
  `npm run build`, then `nginx:alpine` serves the static `dist/` output and
  proxies `/api/` and `/uploads/` to the `backend` service.
- `backend/lib/dataPath.js` already respects `process.env.DATA_DIR`, so
  existing routes (`settings`, `about`, `contact`, `projects`, `skills`)
  need no changes when `DATA_DIR=/app/data`.

## Production notes

- Frontend port `80` may conflict with a host web server. Change the host
  mapping in `docker-compose.yml` (`"80:80"` → e.g. `"8080:80"`) if needed.
- Put a reverse proxy with TLS (Caddy, Traefik, nginx on the host, or a
  cloud load balancer) in front of the `frontend` service for HTTPS.
- For backup, snapshot the two named volumes regularly:
  `docker run --rm -v cvwebsite_portfolio-data:/data -v $PWD:/backup \
   alpine tar czf /backup/portfolio-data.tgz -C /data .`

## HTTPS with Let's Encrypt

The frontend container can obtain and renew a Let's Encrypt certificate
automatically using `certbot --nginx` (HTTP-01 challenge).

### Prerequisites

- A DNS `A` (or `AAAA`) record pointing `DOMAIN` to this host's public IP.
- TCP ports `80` and `443` open on the host firewall and reachable from the
  internet. Port `80` is required for the HTTP-01 challenge even after the
  certificate is issued.
- No other process on the host listening on `:80` or `:443` (or remap the
  ports in `docker-compose.yml`).

### Configuration

Add the following to a `.env` file at the project root (see `.env.example`):

```bash
DOMAIN=myportfolio.sopanha.digital
EMAIL=your-email@example.com
```

`EMAIL` is sent to Let's Encrypt for expiry notices and recovery. It is
**not** used for marketing.

### How it works

On container start, `frontend/entrypoint.sh`:

1. Verifies that `DOMAIN` and `EMAIL` are set; exits with an error otherwise.
2. If no certificate exists at `/etc/letsencrypt/live/$DOMAIN`, runs
   `certbot --nginx -d $DOMAIN` to issue one and have the nginx plugin
   inject the `listen 443 ssl` server block into `nginx.conf`.
3. Starts nginx in the background.
4. Loops every 12 hours, running `certbot renew --quiet --nginx`.

Certificates are stored in the `letsencrypt` named volume and survive
`docker compose down` / `up`. To rotate the certificate from scratch, run:

```bash
docker compose down
docker volume rm cvwebsite_letsencrypt
docker compose up -d
```
