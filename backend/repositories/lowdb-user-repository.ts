import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { JSONFileSyncPreset } from 'lowdb/node';
import { User } from "../../src/models/user";
import { IUserRepository } from "./user-repository";

type DatabaseSchema = {
  users: User[];
};

/**
 * LowDB implementation of UserRepository
 * Handles actual database operations with LowDB
 */
export class LowDBUserRepository implements IUserRepository {
  private db: ReturnType<typeof JSONFileSyncPreset<DatabaseSchema>>;

  constructor(databasePath: string = "./data/database.json") {
    this.db = JSONFileSyncPreset<DatabaseSchema>(databasePath, { users: [] });
  }

  create(userDetails: Partial<User>): User {
    // Hash password
    const passwordHash = bcrypt.hashSync(userDetails.password!, 10);

    const user: User = {
      id: uuidv4(),
      username: userDetails.username!,
      password: passwordHash,
      firstName: userDetails.firstName!,
      lastName: userDetails.lastName!,
      email: userDetails.email,
      avatar: userDetails.avatar,
    };

    this.db.data.users.push(user);
    this.db.write();

    return user;
  }

  findById(id: string): User | undefined {
    return this.db.data.users.find(u => u.id === id);
  }

  findByUsername(username: string): User | undefined {
    return this.db.data.users.find(u => u.username === username);
  }

  update(id: string, updates: Partial<User>): User {
    const user = this.db.data.users.find(u => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, updates);
    this.db.write();

    return user;
  }

  getAll(): User[] {
    return this.db.data.users;
  }
}
