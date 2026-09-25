# Ritik Karak — Video Editor & Web Developer Portfolio (MERN)

An animated, dark, cinema-style portfolio built with the **MERN stack** (MongoDB · Express · React · Node) plus
**Three.js** (react-three-fiber), **Framer Motion**, **GSAP ScrollTrigger** and **Lenis** smooth scrolling.

**Pages:** Home (video-reel hero + 3D film reel, work grid with hover-play & category tabs) · Showreel (per-category reels) ·
Work · Project detail · About · Services · Contact (inquiry form → MongoDB / email).

---

## 1. Quick start

```bash
# 1) install everything (root + client + server)
npm run install:all

# 2) (optional) configure the backend
cp server/.env.example server/.env      # add MONGODB_URI / SMTP if you want them

# 3) run client + server together
npm run dev
#   client → http://localhost:5173   (Vite, proxies /api to the server)
#   server → http://localhost:5000
```

> The site works **without MongoDB**: projects are served from `client/src/data/projects.js`
> and contact messages are logged/emailed. Add `MONGODB_URI` when you want messages stored in a database.

Production-style run (Express serves the built React app):

```bash
npm run build   # builds client/dist
npm start       # http://localhost:5000
```

## 2. Folder structure

```
ritik-portfolio/
├─ client/                     React + Vite frontend
│  ├─ public/
│  │  ├─ videos/               reel-loop.mp4 (hero) + preview-*.mp4 (hover previews)  ← placeholders
│  │  └─ images/               put ritik.jpg (portrait), project posters, client logos here
│  └─ src/
│     ├─ components/           Navbar, Footer, VideoPlayer, ProjectCard, ReelModal, Preloader, cursor…
│     │  └─ three/             HeroScene (3D film reel), OrbScene (page-header orb), shared lights/dust
│     ├─ pages/                Home, Work, Project, Showreel, About, Services, Contact, NotFound
│     ├─ data/
│     │  ├─ siteConfig.js      ★ name, contact, socials, bio, skills, services, awards, reels
│     │  └─ projects.js        ★ all portfolio projects
│     ├─ hooks/  lib/  styles/
│     └─ App.jsx, main.jsx
├─ server/                     Express API
│  └─ src/
│     ├─ index.js, app.js      boot + middleware (helmet, cors, compression, static client)
│     ├─ routes/api.js         /api/health, /api/projects, /api/projects/:slug, /api/contact
│     ├─ controllers/, models/ Project + Inquiry (Mongoose)
│     ├─ data/projects.js      fallback/seed data (copy of the client file)
│     └─ scripts/seed.js       npm run seed → loads projects into MongoDB
├─ Dockerfile  render.yaml  .github/workflows/ci.yml
└─ .gitignore  .dockerignore  .editorconfig  .nvmrc
```

## 3. Make it Ritik's (checklist)

Everything personal lives in **two files** — no digging through components:

| What | Where |
|------|-------|
| Name, tagline, email, phone, availability, social links | `client/src/data/siteConfig.js` → `site` |
| Bio, skills, education, awards, languages, services | `client/src/data/siteConfig.js` |
| Portfolio projects | `client/src/data/projects.js` |
| Portrait photo | save as `client/public/images/ritik.jpg` (4:5 ratio) |
| Hero background reel | replace `client/public/videos/reel-loop.mp4` (8–15 s, 1080p, < 8 MB, no audio needed) |
| Full showreel + category reels | `showreelUrl` / `showreels[]` in `siteConfig.js` → YouTube, Vimeo or `.mp4` |
| Social links | fill the URLs in `site.socials` (empty ones are hidden automatically) |
| Client logos | add to `clients` in `siteConfig.js` (section is hidden while empty) |

**⚠ Placeholders shipped so the site looks complete:** the 9 projects in `projects.js` are **samples**
(they show an amber “Sample” tag) and every video is a generated placeholder loop. For each real project set
`videoUrl` (YouTube/Vimeo/mp4), optional `previewUrl` (3–6 s muted loop for hover), optional `poster` image,
the real client/role/year — and delete `sample: true`. Then run `npm run sync:data` to copy the file to the server.

Video links supported by the player: `https://youtu.be/…`, `https://www.youtube.com/watch?v=…`,
`https://vimeo.com/…`, or a file path like `/videos/my-cut.mp4`. Videos load only when a visitor presses play (fast page loads).

## 4. MongoDB (optional but recommended)

1. Create a free cluster on **MongoDB Atlas** → copy the connection string.
2. Put it in `server/.env` as `MONGODB_URI=…` (network access: allow your host / `0.0.0.0/0` for testing).
3. `npm run seed` loads the projects into the database. After that the API serves projects from MongoDB
   and stores every contact-form inquiry in the `inquiries` collection.

**Email notifications (optional):** fill `SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS` (Gmail app-password, Brevo, Resend SMTP…).
Inquiries are emailed to `CONTACT_TO` (defaults to rockykarak0@gmail.com).

## 5. Deploy

### Option A — one service (easiest): Render / Railway / any Node host
The Express server serves the built React app **and** the API from one URL.

*Render:* New → **Blueprint** → select the repo (uses `render.yaml`) → set `MONGODB_URI` (+ SMTP vars) → deploy.
Manual settings: Build `npm install --prefix client --include=dev && npm run build --prefix client && npm install --prefix server`, Start `npm start --prefix server`, health check `/api/health`.

### Option B — split: Vercel (frontend) + Render (API)
1. Deploy `server/` on Render (Root directory `server`, build `npm install`, start `npm start`), set `CLIENT_URL=https://your-site.vercel.app`.
2. Deploy `client/` on Vercel (Root directory `client`, framework Vite — `vercel.json` already handles SPA routing).
   Add env var `VITE_API_URL=https://your-api.onrender.com`.

### Option C — Docker
```bash
docker build -t ritik-portfolio .
docker run -p 5000:5000 -e MONGODB_URI="…" ritik-portfolio
```

### Git
```bash
git init && git add . && git commit -m "Initial commit"
git branch -M main && git remote add origin <your-repo-url> && git push -u origin main
```
`.gitignore` already excludes `node_modules`, `dist`, and all `.env` files (only `.env.example` is committed).

## 6. Tech notes

- **3D:** `client/src/components/three/` — a procedurally-built film reel with a scrolling film strip and dust particles;
  loaded lazily, paused when off-screen, lighter on phones, and skipped for `prefers-reduced-motion` or devices without WebGL.
- **Performance:** route-level code splitting, click-to-load video players, hover/in-view preview loops (`preload="none"`),
  long-term caching headers for hashed assets, gzip via `compression`.
- **Mobile:** stacked layouts, horizontally scrollable filter tabs, preview videos auto-play when a card is in view (muted + `playsInline`), custom cursor disabled on touch.
- **Security:** Helmet CSP (YouTube/Vimeo embeds allowed), CORS allow-list via `CLIENT_URL`, rate-limited contact endpoint, honeypot field, server-side validation.
- **API:** `GET /api/health` · `GET /api/projects?category=&featured=` · `GET /api/projects/:slug` · `POST /api/contact`.

## 7. Scripts

| Command | What it does |
|---------|--------------|
| `npm run install:all` | install root, client and server dependencies |
| `npm run dev` | client (5173) + server (5000) with hot reload |
| `npm run build` | production build of the client → `client/dist` |
| `npm start` | start the Express server (serves API + built client) |
| `npm run seed` | load `projects.js` into MongoDB |
| `npm run sync:data` | copy `client/src/data/projects.js` → `server/src/data/projects.js` |
