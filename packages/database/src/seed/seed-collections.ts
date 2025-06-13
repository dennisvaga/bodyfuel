import { getPrisma } from "@repo/database";

const prisma = await getPrisma();

async function main() {
  console.log("Seeding collections...");

  // Create collections
  const collections = [
    {
      name: "New Arrivals",
      slug: "new-arrivals",
      description: "Our latest products and innovations",
    },
    {
      name: "Best Sellers",
      slug: "best-sellers",
      description: "Most popular products loved by our customers",
    },
    {
      name: "Sale Items",
      slug: "sale-items",
      description: "Special discounts and promotions",
    },
  ];

  console.log("Creating collections...");
  for (const collection of collections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: collection,
      create: collection,
    });
  }
  console.log(`Created ${collections.length} collections`);
}

main()
  .catch((e) => {
    console.error("Error seeding collections:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
