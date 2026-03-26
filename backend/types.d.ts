import { User as AppUser } from "../src/models/user";

// Extend Express types to include our User model
declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

// Make this a module (required for declare global to work)
export {};
