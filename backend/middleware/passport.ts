import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { IUserRepository } from "../repositories/user-repository";
import { User } from "../../src/models/user";

/**
 * Configure Passport authentication
 * Uses dependency injection for user repository
 */
export function configurePassport(userRepository: IUserRepository) {
  // Configure LocalStrategy
  passport.use(
    new LocalStrategy((username: string, password: string, done) => {
      const user = userRepository.findByUsername(username);

      const failureMessage = "Incorrect username or password.";
      if (!user) {
        return done(null, false, { message: failureMessage });
      }

      // Validate password
      if (!bcrypt.compareSync(password, user.password!)) {
        return done(null, false, { message: failureMessage });
      }

      return done(null, user);
    })
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser((id: string, done) => {
    const user = userRepository.findById(id);
    done(null, user);
  });
}
