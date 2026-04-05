# Nantucket Shoe

Full-stack e-commerce site for Nantucket Shoe.

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion
- **CMS:** Strapi 5 (headless)
- **Database:** PostgreSQL 15
- **Orchestration:** Docker Compose

## Quick start (local dev)

```bash
# 1. Copy env templates
cp my-strapi-project/.env.example my-strapi-project/.env
cp frontend/.env.example frontend/.env.local

# 2. Generate Strapi secrets and paste into my-strapi-project/.env
#    APP_KEYS, API_TOKEN_SALT, ADMIN_JWT_SECRET, TRANSFER_TOKEN_SALT,
#    JWT_SECRET, ENCRYPTION_KEY — use `openssl rand -base64 32` per value

# 3. Start everything
docker compose up -d

# 4. First-time admin setup
#    Open http://localhost:1337/admin and create an admin user
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Strapi admin | http://localhost:1337/admin |
| Postgres | localhost:5433 |

## Editing site content

Open Strapi admin → **Content Manager**:

- **Single Types**
  - **Home Page** — hero image, videos, section texts, images
  - **About Page** — hero image, founder story, artist list
  - **Rando Page** — hero image, intro, item grid
- **Collection Types**
  - **Shoe** — product catalog

Publish changes to make them visible on the live site.

## Project structure

```
.
├── frontend/              # Next.js app
├── my-strapi-project/     # Strapi CMS
├── docker-compose.yml     # Local dev orchestration
└── README.md
```

## Deployment

- **Frontend → Vercel:** import this repo, set root to `frontend/`, add `NEXT_PUBLIC_STRAPI_URL` env var pointing to your deployed Strapi URL.
- **Strapi + Postgres → Railway / Render / Fly.io:** deploy `my-strapi-project/` as a Node service, provision a Postgres DB, set all env vars from `.env.example`.
