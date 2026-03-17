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

## Frontend Bootstrap

**Entry files:**
- `index.html` - HTML entry point
- `src/main.tsx` - React root render
- `src/App.tsx` - Root component

**Scripts:**
- `npm run dev` - Start dev server
- `npm run build` - Production build

## Routing

**Setup:**
- `src/main.tsx` - BrowserRouter wrapper
- `src/App.tsx` - Routes + navigation
- `src/pages/SignIn.tsx` - Login page placeholder
- `src/pages/SignUp.tsx` - Registration page placeholder
- `src/pages/Home.tsx` - Home page placeholder

**Routes:**
- `/` - Home
- `/signin` - Sign In
- `/signup` - Sign Up

## Auth Forms

**Libraries:**
- `formik` - Form state management
- `yup` - Validation schemas
- `@mui/material` - UI components (TextField, Button)
- `@emotion/react`, `@emotion/styled` - MUI peer deps
- `xstate` - State machine core (v5)
- `@xstate/react` - React hooks for XState
- `axios` - HTTP client

**Install:**
```bash
npm install formik yup @mui/material @emotion/react @emotion/styled
npm install xstate @xstate/react axios
```

**Pattern:**
- Formik wraps form, handles validation
- Yup defines validation rules
- XState manages auth states (unauthorized → loading → authorized)

**XState packages:**
- `xstate` - Core machine logic (createMachine, assign, fromPromise)
- `@xstate/react` - React integration (useActor hook)

## Auth Machine

**File:** `src/machines/authMachine.ts`

**States:**
- `unauthorized` - Not logged in (initial)
- `loading` - API login call in progress
- `authorized` - Logged in
- `logout` - Logging out

**Flow:**
```
unauthorized --LOGIN--> loading --success--> authorized
                           |                      |
                        failure               LOGOUT
                           |                      |
                           v                      v
                     unauthorized <------- logout
```

**Context:** Shared data across states
- `user` - Current user object
- `message` - Error messages

**Services:** Async operations
- `performLogin` - POST /login
- `performLogout` - POST /logout

**Persistence:** State saved to localStorage on transitions

## Current: SignIn Form Component

**Next:** Build `src/components/SignInForm.tsx`
- Use Formik for form state
- Use Yup for validation
- Use MUI components
- Connect to authMachine with useActor hook
- Display errors from machine context

## Backlog
- SignUp form component
- Backend setup (Express + lowdb)
- User authentication API
- Transactions feature
- Bank accounts
- Notifications
- Social layer (likes/comments)


