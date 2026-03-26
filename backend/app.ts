import express from "express";
import logger from "morgan";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

// Import DI container
import { container } from "./container";

// Import route factories
import { createAuthRouter } from "./routes/auth-routes";
import { createUserRouter } from "./routes/user-routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOption = {
  origin: "http://localhost:3000",
  credentials: true,
};

// Middleware
app.use(cors(corsOption));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "session-secret-change-this",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Passport initialization (configured in container)
app.use(passport.initialize());
app.use(passport.session());

// Routes with dependency injection
app.get("/", (req, res) => {
  res.send("My Cash App - Backend API (Layered Architecture)");
});

// Mount routers with injected dependencies
const authRouter = createAuthRouter();
const userRouter = createUserRouter(container.userController);

app.use(authRouter);           // Auth routes: /login, /logout, /checkAuth
app.use("/users", userRouter); // User routes: POST /users, GET /users/:id, PATCH /users/:id

// Start server
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
  console.log("Architecture: Repository → Service → Controller → Routes");
});
