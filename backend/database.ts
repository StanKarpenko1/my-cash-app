import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { JSONFileSyncPreset } from 'lowdb/node';
import { User } from "../src/models/user";

// Database schema
export type DatabaseSchema = {
    users: User[];
};

// Database path - use relative path from project root
const databaseFile = "./data/database.json";

// Initialize database with v7 sync preset
const db = JSONFileSyncPreset<DatabaseSchema>(databaseFile, { users: [] });

// User CRUD operations

export function getAllUsers(): User[] {
    return db.data.users;
}

export function getUserById(id: string): User | undefined {
    return db.data.users.find(u => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
    return db.data.users.find(u => u.username === username);
}

export function getUserBy(key: keyof User, value: any): User | undefined {
    return db.data.users.find(u => u[key] === value);
}

export function createUser(userDetails: Partial<User>): User {
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

    db.data.users.push(user);
    db.write();

    return user;
}

export function updateUserById(id: string, updates: Partial<User>): User {
    const user = db.data.users.find(u => u.id === id);
    if (!user) {
        throw new Error("User not found");
    }
    Object.assign(user, updates);
    db.write();
    return user;
}