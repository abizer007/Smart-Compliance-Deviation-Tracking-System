# Smart Compliance – Frontend

Standalone frontend (no backend required). Mock auth and demo data for deployment.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy on Vercel

1. In Vercel, set **Root Directory** to `client` (if the repo root is the whole monorepo).
2. Build Command: `npm run build` (default)
3. Output Directory: `dist` (default)
4. No environment variables needed for the mock/demo version.

Auth and dashboard use in-memory/localStorage only until you connect a backend.
