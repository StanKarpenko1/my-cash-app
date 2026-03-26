import { Request, Response } from "express";
import { UserService } from "../services/user-service";
import { CreateUserDTO, UpdateUserDTO } from "../types/user-types";

/**
 * User Controller - handles HTTP requests/responses
 * Uses dependency injection for service
 */
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * POST /users - Create new user (signup)
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const userDetails: CreateUserDTO = req.body;

      const user = this.userService.create(userDetails);

      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Username already exists") {
          res.status(422).json({ error: error.message });
          return;
        }
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * GET /users/:userId - Get user by ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;

      // Authorization: only resource owner can access
      if (!this.userService.isResourceOwner(req.user!.id, userId)) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      const user = this.userService.getById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  /**
   * PATCH /users/:userId - Update user
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const updates: UpdateUserDTO = req.body;

      // Authorization: only resource owner can update
      if (!this.userService.isResourceOwner(req.user!.id, userId)) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      this.userService.update(userId, updates);

      res.sendStatus(204);
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
