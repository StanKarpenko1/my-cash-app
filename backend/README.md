# Backend Architecture

## Layered Architecture (Repository → Service → Controller → Routes)

```
┌─────────────────────────────────────────────────┐
│                   Routes Layer                   │
│  (HTTP routing, middleware mounting)             │
│  routes/user-routes.ts, routes/auth-routes.ts   │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│               Controller Layer                   │
│  (HTTP request/response, error handling)         │
│  controllers/user-controller.ts                  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│                Service Layer                     │
│  (Business logic, validation, orchestration)     │
│  services/user-service.ts                        │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│              Repository Layer                    │
│  (Data access, database operations)              │
│  repositories/lowdb-user-repository.ts           │
└───────────────────┬─────────────────────────────┘
                    │
                Database
            (LowDB - JSON file)
```

## Directory Structure

```
backend/
├── app.ts                      # Express app setup, middleware, route mounting
├── container.ts                # DI container (manual dependency wiring)
├── database.ts                 # Legacy - to be deprecated
├── types.d.ts                  # Express type extensions
│
├── types/                      # TypeScript types and DTOs
│   └── user-types.ts           # PublicUser, CreateUserDTO, UpdateUserDTO
│
├── repositories/               # Data access layer
│   ├── user-repository.ts      # IUserRepository interface
│   └── lowdb-user-repository.ts # LowDB implementation
│
├── services/                   # Business logic layer
│   └── user-service.ts         # User business logic
│
├── controllers/                # HTTP handling layer
│   └── user-controller.ts      # User request/response handling
│
├── routes/                     # Routing layer
│   ├── auth-routes.ts          # Auth routes (/login, /logout, /checkAuth)
│   └── user-routes.ts          # User routes (/users/*)
│
└── middleware/                 # Express middleware
    ├── auth-middleware.ts      # ensureAuthenticated, validateMiddleware
    ├── passport.ts             # Passport configuration
    └── validators.ts           # express-validator schemas
```

## Dependency Injection Flow

```typescript
// 1. Container initializes dependencies
container = new Container()
  └─> userRepository = new LowDBUserRepository()
  └─> userService = new UserService(userRepository)  // DI
  └─> userController = new UserController(userService) // DI
  └─> configurePassport(userRepository) // DI

// 2. Routes receive controllers
const userRouter = createUserRouter(container.userController)

// 3. Router mounts controller methods
router.post("/", controller.create)  // Method already bound to controller instance
```

## Benefits of This Architecture

### 1. **Testability**
```typescript
// Mock repository for testing
const mockRepo = {
  create: jest.fn(),
  findById: jest.fn()
}

// Test service in isolation
const service = new UserService(mockRepo)
service.create(userData)
expect(mockRepo.create).toHaveBeenCalled()
```

### 2. **Flexibility**
```typescript
// Swap LowDB for PostgreSQL without changing service
const pgRepo = new PostgreSQLUserRepository()
const service = new UserService(pgRepo) // Same interface!
```

### 3. **Reusability**
```typescript
// REST uses service
class UserController {
  create() { return this.userService.create() }
}

// GraphQL uses same service
const resolvers = {
  createUser: () => container.userService.create()
}

// Business logic written ONCE, used by both!
```

### 4. **Single Responsibility**
- **Repository**: Talk to database only
- **Service**: Business logic only
- **Controller**: HTTP handling only
- **Routes**: Routing only

## Request Flow Example

```
POST /users
    │
    ▼
routes/user-routes.ts
    │ (validates, routes request)
    ▼
controllers/user-controller.ts
    │ (handles req/res, extracts data)
    ▼
services/user-service.ts
    │ (checks business rules, validates)
    ▼
repositories/lowdb-user-repository.ts
    │ (saves to database)
    ▼
database.json
```

## Adding New Features

### Example: Add Bank Accounts

1. **Create types**
```typescript
// types/bank-account-types.ts
export type PublicBankAccount = Omit<BankAccount, 'sensitiveData'>
export interface CreateBankAccountDTO { ... }
```

2. **Create repository**
```typescript
// repositories/bank-account-repository.ts
export interface IBankAccountRepository {
  create(account: BankAccount): BankAccount
}

// repositories/lowdb-bank-account-repository.ts
export class LowDBBankAccountRepository implements IBankAccountRepository {
  create(account: BankAccount) { /* LowDB logic */ }
}
```

3. **Create service**
```typescript
// services/bank-account-service.ts
export class BankAccountService {
  constructor(private repo: IBankAccountRepository) {}

  create(userId: string, data: CreateBankAccountDTO) {
    // Business rules: max 5 accounts
    const existing = this.repo.findByUserId(userId)
    if (existing.length >= 5) throw new Error("Max accounts")

    return this.repo.create(data)
  }
}
```

4. **Create controller**
```typescript
// controllers/bank-account-controller.ts
export class BankAccountController {
  constructor(private service: BankAccountService) {}

  create = async (req, res) => {
    const account = this.service.create(req.user.id, req.body)
    res.json({ account })
  }
}
```

5. **Create routes**
```typescript
// routes/bank-account-routes.ts
export function createBankAccountRouter(controller: BankAccountController) {
  router.post("/", controller.create)
  return router
}
```

6. **Wire up in container**
```typescript
// container.ts
this.bankAccountRepo = new LowDBBankAccountRepository()
this.bankAccountService = new BankAccountService(this.bankAccountRepo)
this.bankAccountController = new BankAccountController(this.bankAccountService)
```

7. **Mount in app.ts**
```typescript
// app.ts
const bankAccountRouter = createBankAccountRouter(container.bankAccountController)
app.use("/bankAccounts", bankAccountRouter)
```

## Notes

- **database.ts** is legacy - gradually migrate to repositories
- **Container** is simple manual DI - consider libraries for larger apps (tsyringe, InversifyJS)
- **Error handling** should be centralized (add error middleware later)
- **Logging** should be service-level (add logger service later)
