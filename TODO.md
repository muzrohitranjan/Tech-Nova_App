# Deploy to Netlify + Render

## Phase 1: Code Changes
- [x] Update `src/api.js` to use `REACT_APP_API_BASE` env var
- [x] Create `netlify.toml` with SPA redirects
- [x] Create `public/_redirects` for Netlify SPA routing
- [x] Update `backend/package.json` with engines field
- [x] Commit & push all changes to GitHub

## Phase 2: Backend on Render
- [ ] Create Web Service on Render.com
- [ ] Set root directory to `backend/`
- [ ] Deploy and copy live URL

## Phase 3: Frontend on Netlify
- [ ] Run `netlify login`
- [ ] Run `netlify init` to create site
- [ ] Set `REACT_APP_API_BASE` env var
- [ ] Deploy production build

## Phase 4: Verification
- [ ] Test live app

