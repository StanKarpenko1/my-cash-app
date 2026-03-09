# RWA Recreation

## Setup

**Init:**
```bash
npm init -y
```

**Structure:**
```
src/      - React frontend
backend/  - Express API
data/     - lowdb JSON files
public/   - Static assets
```

**Dependencies:**
- Frontend: react, react-dom, react-router-dom, vite
- Backend: express, cors, lowdb@1.0.0
- Dev: typescript, nodemon, ts-node, concurrently

**TypeScript:**
- `tsconfig.json` - Frontend (ESNext modules, no emit - Vite handles compilation)
- `tsconfig.backend.json` - Backend (CommonJS, emits to dist/ for production)

**Vite:**
- `vite.config.ts` - Dev server on :3000, proxies /api to :3001


