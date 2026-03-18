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

## Backend API (Following RWA)

**Stack:**
- `express` - HTTP server
- `lowdb` - JSON file database
- `passport` + `passport-local` - Authentication
- `express-session` - Session management
- `bcryptjs` - Password hashing
- `uuid` - Unique IDs
- `express-validator` - Input validation
- `morgan` - Request logging
- `cors` - Cross-origin requests

**Install:**
```bash
npm install express passport passport-local express-session bcryptjs uuid express-validator morgan
npm install --save-dev @types/express @types/passport @types/passport-local @types/express-session @types/bcryptjs @types/uuid @types/morgan
```

**File Structure:**
```
backend/
  ├── app.ts              - Express server setup (middleware, routes)
  ├── database.ts         - lowdb initialization + data access functions
  ├── auth.ts             - Passport config + auth routes (/login, /logout, /checkAuth)
  ├── user-routes.ts      - User CRUD routes (POST /users, GET /users/:id, PATCH /users/:id)
  ├── helpers.ts          - Middleware (ensureAuthenticated, validateMiddleware)
  └── validators.ts       - Input validation schemas (express-validator)
```

**Build Order:**
1. Install dependencies
2. Setup `database.ts` - lowdb adapter, User table, CRUD functions
3. Create `helpers.ts` - ensureAuthenticated middleware
4. Create `validators.ts` - user input validation
5. Create `user-routes.ts` - POST /users (signup)
6. Create `auth.ts` - Passport LocalStrategy, login/logout routes
7. Wire up `app.ts` - middleware stack, mount routes
8. Test with frontend

**RWA Patterns:**
- **Passport LocalStrategy** - username/password auth
- **serializeUser/deserializeUser** - session management
- **bcrypt.compareSync** - password verification
- **express-session** - cookie-based sessions
- **ensureAuthenticated** - protect routes

**Database Schema:**
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "password": "bcrypt hash",
      "firstName": "string",
      "lastName": "string"
    }
  ]
}
```

**Implementation Notes:**
(Add details as we build)

## Backlog
- Backend setup (Express + lowdb)
- User authentication API
- Transactions feature
- Bank accounts
- Notifications
- Social layer (likes/comments)


