// Generate local .env files with fresh secrets. Run once per clone.
// Usage: node scripts/init-env.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const rand = () => crypto.randomBytes(16).toString("base64");

const strapiEnv = path.join(ROOT, "my-strapi-project/.env");
const frontendEnv = path.join(ROOT, "frontend/.env.local");

if (fs.existsSync(strapiEnv)) {
  console.log("skip (exists):", strapiEnv);
} else {
  const body = `# Server
HOST=0.0.0.0
PORT=1337

# Secrets (auto-generated)
APP_KEYS=${rand()},${rand()},${rand()},${rand()}
API_TOKEN_SALT=${rand()}
ADMIN_JWT_SECRET=${rand()}
TRANSFER_TOKEN_SALT=${rand()}
JWT_SECRET=${rand()}
ENCRYPTION_KEY=${rand()}

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
DATABASE_FILENAME=
`;
  fs.writeFileSync(strapiEnv, body);
  console.log("created:", strapiEnv);
}

if (fs.existsSync(frontendEnv)) {
  console.log("skip (exists):", frontendEnv);
} else {
  fs.writeFileSync(frontendEnv, `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337\n`);
  console.log("created:", frontendEnv);
}

console.log("\nDone. Next:\n  docker compose up -d");
