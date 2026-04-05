# Nantucket Shoe

Full-stack e-commerce site for Nantucket Shoe.

- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion
- **CMS:** Strapi 5 (headless)
- **Database:** PostgreSQL 15
- **Orchestration:** Docker Compose

## Quick start (local dev)

Requirements: Docker Desktop, Node 18+ (only for the helper scripts).

```bash
# 1. Generate local env files with fresh secrets
node scripts/init-env.mjs

# 2. Start everything (Postgres + Strapi + Next.js)
docker compose up -d

# 3. First-time admin setup
#    Open http://localhost:1337/admin and create an admin user

# 4. (Optional) Seed Strapi with starter content + all media
#    Uses admin@nshoe.com / Admin123! by default —
#    override with ADMIN_EMAIL/ADMIN_PASSWORD env vars if needed
node scripts/seed-strapi.mjs
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
