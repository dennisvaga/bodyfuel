import bcrypt from "bcryptjs";
import authRepository from "./auth.repository.js";

/**
 * Auth service responsible for authentication-related business logic
 */
export class AuthService {
  /**
   * Sign up a new user
   */
  async signup(name: string, email: string, password: string) {
    // Check if all fields are provided
    if (!name || !email || !password) {
      throw new Error("All fields are required.");
    }

    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists.");
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in database
    const newUser = await authRepository.createUser(
      name,
      email,
      hashedPassword
    );

    return newUser;
  }

  /**
   * Sign in a user
   */
  async signin(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user || !user.password) {
      throw new Error("No user found or password not set.");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Invalid password.");
    }

    return user;
  }
}

export default new AuthService();
