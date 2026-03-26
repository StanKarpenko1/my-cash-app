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
- Backend: express, cors, lowdb@7.0.0
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

## SignIn Form Component

**Files:**
- `src/components/SignInForm.tsx` - Form component
- `src/pages/SignIn.tsx` - Page wrapper

**Pattern:**
- Formik handles form state/submission
- Yup validation schema (username required, password min 4 chars)
- MUI components (TextField, Button, Container)
- `useSelector(authService)` - subscribes to machine state (XState v5)
- `authService.send` - sends LOGIN event to machine
- Displays `state.context.message` errors from machine

**Key concept:** Component is pure UI, machine handles business logic

## SignUp Form Component

**Files:**
- `src/components/SignUpForm.tsx` - Form component
- `src/pages/SignUp.tsx` - Page wrapper

**Validation:**
- firstName, lastName, username required
- password min 4 chars
- confirmPassword must match password (using `ref("password")`)

**Flow:**
- SIGNUP event → signup state → POST /users → unauthorized
- Success message displayed, user redirected to sign in

## Auth Forms Complete

**Status:** Frontend forms done
- SignIn form ✅
- SignUp form ✅
- Both connected to authMachine
- Backend APIs not implemented yet (will fail)

**Navigation Pattern:**
- Use `useNavigate()` hook + MUI Link
- Use `onMouseDown` instead of `onClick`
- Add `e.preventDefault()`
- **Why:** Click near form fields triggers blur → validation → DOM shift → navigation fails
- **Solution:** `onMouseDown` fires before blur event

## Backend API - Layered Architecture ✅

**Stack:**
- `express` - HTTP server
- `lowdb@7` - JSON file database
- `passport` + `passport-local` - Authentication
- `express-session` - Session management
- `bcryptjs` - Password hashing
- `uuid` - Unique IDs
- `express-validator` - Input validation
- `morgan` - Request logging
- `cors` - Cross-origin requests

**Architecture Pattern:**
Production-grade layered architecture with dependency injection:
- **Repository** - Data access (swappable DB implementations)
- **Service** - Business logic (reusable by REST + GraphQL)
- **Controller** - HTTP handling (request/response, status codes)
- **Routes** - Routing only (middleware mounting)

**File Structure:**
```
backend/
  ├── app.ts                       - Express setup, DI wiring
  ├── container.ts                 - Manual DI container
  ├── types.d.ts                   - Express type extensions
  ├── database.ts                  - Legacy (migrate to repos)
  │
  ├── types/                       - DTOs, type definitions
  │   └── user-types.ts
  │
  ├── repositories/                - Data access layer
  │   ├── user-repository.ts       - Interface (IUserRepository)
  │   └── lowdb-user-repository.ts - LowDB implementation
  │
  ├── services/                    - Business logic layer
  │   └── user-service.ts          - User business rules
  │
  ├── controllers/                 - HTTP handling layer
  │   └── user-controller.ts       - Req/res, error handling
  │
  ├── routes/                      - Routing layer
  │   ├── auth-routes.ts           - /login, /logout, /checkAuth
  │   └── user-routes.ts           - /users/*
  │
  └── middleware/                  - Express middleware
      ├── auth-middleware.ts       - ensureAuthenticated, validateMiddleware
      ├── passport.ts              - Passport config
      └── validators.ts            - express-validator schemas
```

**DI Flow:**
- Container creates repository instances
- Injects repos into services
- Injects services into controllers
- Routes receive bound controller methods

**Key Benefits:**
- **Testable** - Mock repos/services for unit tests
- **Flexible** - Swap LowDB for PostgreSQL without touching business logic
- **Reusable** - Services shared by REST + GraphQL (future)
- **Type-safe** - `PublicUser = Omit<User, 'password'>` prevents leaks

**Auth Pattern:**
- Passport LocalStrategy with repository injection
- Session-based auth (cookie: connect.sid)
- Middleware: ensureAuthenticated guards protected routes
- Password hashing in repository layer

**Endpoints:**
- `POST /users` - Signup (public)
- `GET /users/:id` - Get user (auth, owner-only)
- `PATCH /users/:id` - Update user (auth, owner-only)
- `POST /login` - Login
- `POST /logout` - Logout
- `GET /checkAuth` - Session check

**Scripts:**
- `npm run start:api` - Run backend once
- `npm run start:api:watch` - Backend with nodemon
- `npm run dev:fullstack` - Frontend + backend concurrently

## Next Steps
- Add bank accounts (REST + GraphQL dual implementation)
- Transactions feature
- Notifications
- Social layer (likes/comments)


