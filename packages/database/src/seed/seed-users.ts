import { getPrisma } from "@repo/database";
import bcrypt from "bcryptjs";

const prisma = await getPrisma();

async function main() {
  console.log("Seeding users...");

  // Hash the password
  const hashedPassword = await bcrypt.hash("Admin12345!", 12);

  // Create admin user
  const adminUser = {
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "ADMIN" as const,
    emailVerified: new Date(), // Mark as verified
  };

  console.log("Creating admin user...");
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {
      name: adminUser.name,
      password: adminUser.password,
      role: adminUser.role,
      emailVerified: adminUser.emailVerified,
    },
    create: adminUser,
  });

  console.log("Admin user created successfully");
}

main()
  .catch((e) => {
    console.error("Error seeding users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
