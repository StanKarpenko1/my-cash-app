/**
 * Dependency Injection Container
 * Manually wires up all dependencies
 * In larger apps, use a DI library like tsyringe or InversifyJS
 */

import { LowDBUserRepository } from "./repositories/lowdb-user-repository";
import { UserService } from "./services/user-service";
import { UserController } from "./controllers/user-controller";
import { configurePassport } from "./middleware/passport";

/**
 * Container holds all initialized dependencies
 */
export class Container {
  // Repositories
  public userRepository: LowDBUserRepository;

  // Services
  public userService: UserService;

  // Controllers
  public userController: UserController;

  constructor() {
    // Initialize repositories
    this.userRepository = new LowDBUserRepository();

    // Initialize services (inject repositories)
    this.userService = new UserService(this.userRepository);

    // Initialize controllers (inject services)
    this.userController = new UserController(this.userService);

    // Configure Passport (inject repository)
    configurePassport(this.userRepository);
  }
}

// Export singleton instance
export const container = new Container();
