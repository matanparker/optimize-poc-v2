# XP-Optimise Prototype - Client

- Dev: `npm install && npm run dev`
- Build: `npm run build && npm run preview`

Uses Vite + React + TypeScript.

Environment:
- Create `.env` in project root to set `VITE_API_BASE` if needed, default proxy to `/api`.

Deployment:
- Netlify/Vercel: build command `npm run build`, publish dir `dist`.
- Ensure backend is deployed separately or use Netlify functions/Vercel rewrites.


