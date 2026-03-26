import express, { Request, Response } from "express";
import passport from "passport";
import { User } from "../../src/models/user";

/**
 * Auth routes - login, logout, checkAuth
 */
export function createAuthRouter() {
  const router = express.Router();

  // POST /login
  router.post("/login", passport.authenticate("local"), (req: Request, res: Response): void => {
    const user = req.user as User;
    const { password, ...userWithoutPassword } = user;

    res.send({ user: userWithoutPassword });
  });

  // POST /logout
  router.post("/logout", (req: Request, res: Response): void => {
    res.clearCookie("connect.sid");
    req.logout(() => res.sendStatus(200));
  });

  // GET /checkAuth
  router.get("/checkAuth", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "User is unauthorized" });
    }

    const user = req.user as User;
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({ user: userWithoutPassword });
  });

  return router;
}
