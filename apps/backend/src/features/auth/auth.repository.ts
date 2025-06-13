import { getPrisma } from "@repo/database";

/**
 * Auth repository responsible for all database operations related to authentication
 */
export class AuthRepository {
  /**
   * Find user by email
   */
  async findUserByEmail(email: string) {
    const prisma = await getPrisma();

    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  /**
   * Create a new user
   */
  async createUser(name: string, email: string, hashedPassword: string) {
    const prisma = await getPrisma();

    return prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "USER", // Default role
      },
    });
  }
}

export default new AuthRepository();
