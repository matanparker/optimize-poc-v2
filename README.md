# XP-Optimise Prototype

Prototype web app with React (Vite) frontend and Python Flask backend. Serves CSV-based simulated data to match PRD and UI mock.

## Structure
- `server`: Flask API reading `demo_data_medium.csv` and `demo_data_small.csv`.
- `client`: React app with pages: Dashboard, Research, Recommendations, Settings.

## Setup
1. Backend
   - `cd server`
   - `python3 -m venv .venv && source .venv/bin/activate`
   - `pip install -r requirements.txt`
   - `export FLASK_APP=app.py && export PORT=5001`
   - `python app.py`

2. Frontend
   - `cd client`
   - `npm install`
   - `npm run dev`

Open http://localhost:5173

## Environment
- Backend: `OPENAI_API_KEY` (optional)
- Frontend: `VITE_API_BASE` (defaults to `/api` for local proxy)

## Deployment
### Frontend (Netlify)
- Build command: `npm run build`
- Publish directory: `dist`
- Redirects: see `client/netlify.toml` and update backend URL

### Frontend (Vercel)
- Uses `client/vercel.json` routes; set backend URL

### Backend
- Deploy Flask separately (Render/Heroku/Fly.io). `server/Procfile` provided. Set `OPENAI_API_KEY` if used.


