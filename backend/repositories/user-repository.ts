import { User } from "../../src/models/user";

/**
 * Repository interface - defines contract for user data access
 * Allows swapping implementations (LowDB, PostgreSQL, MongoDB, etc.)
 */
export interface IUserRepository {
  create(user: User): User;
  findById(id: string): User | undefined;
  findByUsername(username: string): User | undefined;
  update(id: string, updates: Partial<User>): User;
  getAll(): User[];
}
