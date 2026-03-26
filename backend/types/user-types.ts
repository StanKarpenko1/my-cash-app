import { User } from "../../src/models/user";

/**
 * Public user type - excludes sensitive fields like password
 */
export type PublicUser = Omit<User, 'password'>;

/**
 * DTO for creating a new user
 */
export interface CreateUserDTO {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
}

/**
 * DTO for updating a user
 */
export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}
