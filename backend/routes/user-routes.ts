import express from "express";
import { UserController } from "../controllers/user-controller";
import { ensureAuthenticated, validateMiddleware } from "../middleware/auth-middleware";
import { isUserValidator } from "../middleware/validators";

/**
 * User routes - routing only
 * Controller is injected via DI container
 */
export function createUserRouter(userController: UserController) {
  const router = express.Router();

  // POST /users - Create new user (signup)
  router.post(
    "/",
    validateMiddleware(isUserValidator),
    userController.create
  );

  // GET /users/:userId - Get user by ID
  router.get(
    "/:userId",
    ensureAuthenticated,
    userController.getById
  );

  // PATCH /users/:userId - Update user
  router.patch(
    "/:userId",
    ensureAuthenticated,
    validateMiddleware(isUserValidator),
    userController.update
  );

  return router;
}
