import { IUserRepository } from "../repositories/user-repository";
import { PublicUser, CreateUserDTO, UpdateUserDTO } from "../types/user-types";
import { User } from "../../src/models/user";

/**
 * User Service - handles business logic for user operations
 * Uses dependency injection for repository
 */
export class UserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Create new user
   * Business rules:
   * - Username must be unique
   * - Password gets hashed in repository
   */
  create(userDetails: CreateUserDTO): PublicUser {
    // Check if username already exists
    const existingUser = this.userRepository.findByUsername(userDetails.username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Create user (password hashing happens in repository)
    const user = this.userRepository.create(userDetails as User);

    // Return without password
    return this.toPublicUser(user);
  }

  /**
   * Get user by ID
   */
  getById(userId: string): PublicUser | null {
    const user = this.userRepository.findById(userId);

    if (!user) {
      return null;
    }

    return this.toPublicUser(user);
  }

  /**
   * Update user
   * Business rules:
   * - Can only update allowed fields (via UpdateUserDTO)
   * - Cannot update password here (separate endpoint)
   */
  update(userId: string, updates: UpdateUserDTO): void {
    const user = this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    this.userRepository.update(userId, updates);
  }

  /**
   * Check if requesting user is authorized to access resource
   */
  isResourceOwner(requestingUserId: string, resourceUserId: string): boolean {
    return requestingUserId === resourceUserId;
  }

  /**
   * Transform User to PublicUser (strip sensitive fields)
   */
  private toPublicUser(user: User): PublicUser {
    const { password, ...publicUser } = user;
    return publicUser;
  }
}
