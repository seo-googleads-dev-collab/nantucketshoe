// Seed Strapi with home-page, about-page, rando-page content + media + shoes.
// Usage: node scripts/seed-strapi.mjs
// Requires: Strapi running at http://localhost:1337, admin user admin@nshoe.com / Admin123!

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nshoe.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!";

const IMAGES_DIR = path.join(ROOT, "frontend/public/images");
const VIDEOS_DIR = path.join(ROOT, "frontend/public/videos");

let token = "";

const log = (...a) => console.log("[seed]", ...a);
const err = (...a) => console.error("[seed:ERR]", ...a);

async function adminLogin() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Admin login failed: ${res.status} ${await res.text()}`);
  const j = await res.json();
  token = j.data.token;
  log("admin login OK");
}

function contentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  return (
    {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".webm": "video/webm",
    }[ext] || "application/octet-stream"
  );
}

// Upload a single file and return the created media object.
async function uploadFile(filePath) {
  const name = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);
  const blob = new Blob([buffer], { type: contentType(name) });
  const fd = new FormData();
  fd.append("files", blob, name);
  const res = await fetch(`${STRAPI_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  if (!res.ok) throw new Error(`Upload ${name} failed: ${res.status} ${await res.text()}`);
  const arr = await res.json();
  const rec = Array.isArray(arr) ? arr[0] : arr;
  log(`  uploaded ${name} (id=${rec.id})`);
  return rec;
}

// Check existing media in Strapi — skip re-upload if name matches.
async function getExistingMedia() {
  const res = await fetch(`${STRAPI_URL}/upload/files?pagination[pageSize]=500`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return new Map();
  const j = await res.json();
  const arr = Array.isArray(j) ? j : j.results || [];
  const map = new Map();
  for (const f of arr) {
    const key = (f.name || "").toLowerCase();
    if (key) map.set(key, f);
  }
  return map;
}

async function uploadAll() {
  const existing = await getExistingMedia();
  log(`media library has ${existing.size} files; uploading missing…`);
  const files = [
    ...fs.readdirSync(IMAGES_DIR).map((f) => path.join(IMAGES_DIR, f)),
    ...fs.readdirSync(VIDEOS_DIR).map((f) => path.join(VIDEOS_DIR, f)),
  ].filter((p) => fs.statSync(p).isFile());

  const map = {}; // basename (no ext) -> media record
  for (const fp of files) {
    const name = path.basename(fp);
    const key = name.toLowerCase();
    let rec = existing.get(key);
    if (!rec) rec = await uploadFile(fp);
    map[name] = rec;
    map[path.basename(name, path.extname(name))] = rec;
  }
  return map;
}

// PUT content-manager single type
async function putSingle(uid, data) {
  const res = await fetch(`${STRAPI_URL}/content-manager/single-types/${uid}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`PUT ${uid} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function publishSingle(uid) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${uid}/actions/publish`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    }
  );
  if (!res.ok) throw new Error(`publish ${uid} failed: ${res.status} ${await res.text()}`);
  log(`  published ${uid}`);
}

async function seedHomePage(m) {
  const uid = "api::home-page.home-page";
  log("seeding home-page…");
  await putSingle(uid, {
    hero_image: m["home-hero"]?.id,
    hero_video_1: m["IMG_8201"]?.id,
    hero_video_2: m["IMG_9519"]?.id,
    paisley_image: m["home-paisley"]?.id,
    shoe_small_image: m["home-shoe-small"]?.id,
    beach_image: m["home-beach"]?.id,
    wanderlust_eyebrow: "Nantucket's Wanderlust",
    wanderlust_title: "Like Ink For Your Feet",
    wanderlust_text:
      "Ports attract people with adventure in their hearts: curious, restless, and keenly optimistic. For 400 years, rascals and raconteurs alike have walked Nantucket's docks and cobblestones. Nantucket's seaman were some of the first to venture to the Pacific, chasing whales and discovering wild and strange cultures. Our art shoes tell Nantucket's stories, then and now. Are we selling Nantucket? Nah, who can afford it? Instead we champion Nantucket's wanderlust.",
    limited_edition_eyebrow: "Wandering Nantucket & The Globe",
    limited_edition_title: "Limited Edition Shoes",
    limited_edition_text:
      "Our creative director has partnered with tattoo artists, illustrators and librarians to tell Nantucket's stories. Illustrator Charlemagne Criste from Manila, The Philippines, created the retro 70s Surf Punk shoe. Tattoo artist Chris Harris, of Bristol, England inked The Order of Two Pennies shoe. Only 100 shoes are made, numbered and signed.",
    sandbar_eyebrow: "Getting Off The Sandbar",
    sandbar_title: "29% for Wandering",
    sandbar_text:
      "As the East Coast's most distant island, getting off the island is a bit of work and costly. We are, in fact, 29 miles at sea. Nantucket Shoe donates 29% of profits to help Nantucket High School students tour colleges, pay application fees and attend cultural events. We especially support the children of the island's work force — painters, maids, gardeners, waiters — who make Nantucket magical and support students intrigued by the arts.",
  });
  await publishSingle(uid);
}

async function seedAboutPage(m) {
  const uid = "api::about-page.about-page";
  log("seeding about-page…");
  const artistStory =
    "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard. It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born. Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the art of its illustrators.";
  await putSingle(uid, {
    hero_image: m["about-hero"]?.id,
    founder_story:
      "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born (shoes on the right). Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the genius of its artists, Leighton's role is to coach, cajole and sometimes barks at his illustrators and otherwise keeps the stories behind the shoes true to Nantucket and the crazy people who make a sand bar 25 miles out to sea a home and a crossroads.",
    artists: [
      {
        name: "Charlemange Christe",
        location: "Manilla, Phillippines",
        website: "www.website",
        story: artistStory,
        image: m["surf-punk"]?.id ?? null,
      },
      {
        name: "Chris Harris",
        location: "Bristol, England",
        website: "www.website",
        story: artistStory,
        image: m["no-quarter-shoe"]?.id ?? null,
      },
    ],
  });
  await publishSingle(uid);
}

async function seedRandoPage(m) {
  const uid = "api::rando-page.rando-page";
  log("seeding rando-page…");
  const desc =
    "We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation. We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation.";
  const item = (title) => ({
    title,
    subtitle: "LIMITED EDITION 100",
    description: desc,
    bottom_text: "AMENITIES + POLICIES + Open",
    circular_image: null,
    feature_images: null,
  });
  await putSingle(uid, {
    hero_image: m["rando-hero"]?.id,
    intro_title: "Rando",
    intro_text:
      "Random shoes, random stories, random rewards. Rando is our rotating collection of one-offs, experiments, and collaborations that don't fit anywhere else.",
    items: [
      item("Item One"),
      item("Item Two"),
      item("Item Three"),
    ],
  });
  await publishSingle(uid);
}

async function seedShoes(m) {
  log("seeding shoes…");
  const uid = "api::shoe.shoe";
  const shoes = [
    {
      name: "No Quarter",
      price: 195,
      color: "Black",
      category: "Limited Edition",
      description: "The Order of Two Pennies. Inked by Chris Harris of Bristol, England. Only 100 made, numbered and signed.",
      image: m["shoe-no-quarter"]?.id ?? m["no-quarter-shoe"]?.id,
      sizes: [7, 8, 9, 10, 11, 12],
      inStock: true,
    },
    {
      name: "Surf Punk",
      price: 195,
      color: "Multi",
      category: "Limited Edition",
      description: "Retro 70s Surf Punk shoe illustrated by Charlemagne Criste, Manila, Philippines. Only 100 made, numbered and signed.",
      image: m["shoe-surf-punk"]?.id ?? m["surf-punk"]?.id,
      sizes: [7, 8, 9, 10, 11, 12],
      inStock: true,
    },
    {
      name: "Two Pennies",
      price: 195,
      color: "Cream",
      category: "Limited Edition",
      description: "The Order of Two Pennies shoe. Tattoo art meets canvas.",
      image: m["shoe-two-pennies"]?.id,
      sizes: [7, 8, 9, 10, 11, 12],
      inStock: true,
    },
  ];

  // list existing
  const listRes = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}?pagination[pageSize]=100`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const list = listRes.ok ? await listRes.json() : { results: [] };
  const existingNames = new Set((list.results || []).map((s) => s.name));

  for (const s of shoes) {
    if (existingNames.has(s.name)) {
      log(`  skip existing shoe: ${s.name}`);
      continue;
    }
    const res = await fetch(`${STRAPI_URL}/content-manager/collection-types/${uid}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(s),
    });
    if (!res.ok) {
      err(`create shoe ${s.name}:`, res.status, await res.text());
      continue;
    }
    const doc = await res.json();
    const id = doc.documentId || doc.id;
    // publish
    const pubRes = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/${uid}/${id}/actions/publish`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
      }
    );
    if (pubRes.ok) log(`  created + published: ${s.name}`);
    else err(`publish ${s.name}:`, pubRes.status, await pubRes.text());
  }
}

async function main() {
  log(`Strapi: ${STRAPI_URL}`);
  await adminLogin();
  const media = await uploadAll();
  await seedHomePage(media);
  await seedAboutPage(media);
  await seedRandoPage(media);
  await seedShoes(media);
  log("DONE ✅");
}

main().catch((e) => {
  err(e);
  process.exit(1);
});
