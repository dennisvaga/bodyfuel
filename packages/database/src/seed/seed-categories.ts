import { getPrisma } from "@repo/database";

const prisma = await getPrisma();

async function main() {
  console.log("Seeding categories...");

  // Create categories
  const categories = [
    {
      name: "Pre-Workout",
      slug: "pre-workout",
      description: "Boost your energy before exercise",
    },
    {
      name: "Post-Workout",
      slug: "post-workout",
      description: "Support recovery after training",
    },
    {
      name: "Vitamins",
      slug: "vitamins",
      description: "Essential vitamins and minerals",
    },
    {
      name: "Fat Burners",
      slug: "fat-burners",
      description: "Support your weight management goals",
    },
    {
      name: "Protein Powders",
      slug: "protein-powders",
      description: "High-quality protein supplements",
    },
    {
      name: "Creatine",
      slug: "creatine",
      description: "Enhance strength and muscle performance",
    },
  ];

  console.log("Creating categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`Created ${categories.length} categories`);
}

main()
  .catch((e) => {
    console.error("Error seeding categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
