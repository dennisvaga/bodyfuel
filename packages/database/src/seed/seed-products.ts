import { getPrisma } from "@repo/database";

const prisma = await getPrisma();

export function slugifyNative(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Remove consecutive dashes
}

async function main() {
  console.log("Seeding products...");

  // Get category IDs for reference
  const categoriesData = await prisma.category.findMany();
  const categoriesMap = Object.fromEntries(
    categoriesData.map((category) => [category.slug, category.id])
  );

  // Define products with S3 keys
  const products = [
    // ----- Creatine Supplements -----
    {
      name: "Blackstone Creatine",
      description: "Premium creatine monohydrate for strength.",
      price: 29.99,
      compareAtPrice: 34.99,
      sku: "BSL-CRE-300",
      categorySlug: "creatine",
      brand: "Blackstone Labs",
      isDemo: true,
      quantity: 50,
      imageKeys: [
        "products/1741870461748--blackstone-labs-creatine-monohydrate.webp",
      ],
      options: [
        {
          name: "Packaging",
          values: ["300g", "500g"],
        },
      ],
      variants: [
        {
          price: 29.99,
          sku: "BSL-CRE-300-300G",
          stock: 30,
          optionValues: ["300g"],
        },
        {
          price: 39.99,
          sku: "BSL-CRE-300-500G",
          stock: 20,
          optionValues: ["500g"],
        },
      ],
    },
    {
      name: "Con-Cret Creatine HCL",
      description: "Highly soluble creatine HCL for absorption.",
      price: 34.99,
      compareAtPrice: 42.99,
      sku: "CON-CRE-HCL",
      categorySlug: "creatine",
      brand: "Con-Cret",
      isDemo: true,
      quantity: 40,
      imageKeys: ["products/1741870472596--con-cret-creatine-hcl.webp"],
      options: [
        {
          name: "Packaging",
          values: ["Standard", "Large"],
        },
      ],
      variants: [
        {
          price: 34.99,
          sku: "CON-CRE-HCL-STD",
          stock: 25,
          optionValues: ["Standard"],
        },
        {
          price: 49.99,
          sku: "CON-CRE-HCL-LRG",
          stock: 15,
          optionValues: ["Large"],
        },
      ],
    },
    {
      name: "EFX Creatine Capsules",
      description: "Capsule form creatine with enhanced stability.",
      price: 27.99,
      compareAtPrice: 32.99,
      sku: "EFX-CAP-5",
      categorySlug: "creatine",
      brand: "EFX Sports",
      isDemo: true,
      quantity: 60,
      imageKeys: [
        "products/1741870484618--efx-sports-kre-alkalyn-capsules-powders.webp",
      ],
      options: [
        {
          name: "Dosage",
          values: ["5g", "10g"],
        },
      ],
      variants: [
        {
          price: 27.99,
          sku: "EFX-CAP-5G",
          stock: 35,
          optionValues: ["5g"],
        },
        {
          price: 39.99,
          sku: "EFX-CAP-10G",
          stock: 25,
          optionValues: ["10g"],
        },
      ],
    },
    {
      name: "HPN Creapure Creatine",
      description: "Ultra-pure Creapure creatine for peak performance.",
      price: 32.99,
      compareAtPrice: 38.99,
      sku: "HPN-CRE-250",
      categorySlug: "creatine",
      brand: "HPN",
      isDemo: true,
      quantity: 45,
      imageKeys: ["products/1741870498354--hpn-c2-creapure-creatine-hpnc.webp"],
      options: [
        {
          name: "Packaging",
          values: ["250g", "500g"],
        },
      ],
      variants: [
        {
          price: 32.99,
          sku: "HPN-CRE-250G",
          stock: 25,
          optionValues: ["250g"],
        },
        {
          price: 49.99,
          sku: "HPN-CRE-500G",
          stock: 20,
          optionValues: ["500g"],
        },
      ],
    },
    {
      name: "Kodagenix Creatine",
      description: "Micronized creatine for fast absorption.",
      price: 24.99,
      compareAtPrice: 29.99,
      sku: "KOD-CRE-300",
      categorySlug: "creatine",
      brand: "Kodagenix",
      isDemo: true,
      quantity: 70,
      imageKeys: [
        "products/1741870507640--kodagenix-creatine-monohydrate.webp",
      ],
      options: [
        {
          name: "Size",
          values: ["300g", "600g"],
        },
      ],
      variants: [
        {
          price: 24.99,
          sku: "KOD-CRE-300G",
          stock: 40,
          optionValues: ["300g"],
        },
        {
          price: 39.99,
          sku: "KOD-CRE-600G",
          stock: 30,
          optionValues: ["600g"],
        },
      ],
    },
    {
      name: "Pro Supps Creatine",
      description: "High-quality creatine for performance.",
      price: 26.99,
      compareAtPrice: 32.99,
      sku: "PS-CRE-300",
      categorySlug: "creatine",
      brand: "Pro Supps",
      isDemo: true,
      quantity: 80,
      imageKeys: ["products/1741870515414--pro-supps-creatine.webp"],
      options: [
        {
          name: "Packaging",
          values: ["300g", "500g"],
        },
      ],
      variants: [
        {
          price: 26.99,
          sku: "PS-CRE-300G",
          stock: 45,
          optionValues: ["300g"],
        },
        {
          price: 39.99,
          sku: "PS-CRE-500G",
          stock: 35,
          optionValues: ["500g"],
        },
      ],
    },

    // ----- Post-Workout -----
    {
      name: "Choc Whey Protein",
      description: "Delicious chocolate whey protein for recovery.",
      price: 39.99,
      compareAtPrice: 45.99,
      sku: "CWP-1000",
      categorySlug: "post-workout",
      brand: "Optimum Nutrition",
      isDemo: true,
      quantity: 50,
      imageKeys: ["products/1747830177075--100Whey.webp"],
      options: [
        {
          name: "Flavor",
          values: ["Chocolate", "Vanilla"],
        },
      ],
      variants: [
        {
          price: 39.99,
          sku: "CWP-1000-CHOC",
          stock: 30,
          optionValues: ["Chocolate"],
        },
        {
          price: 39.99,
          sku: "CWP-1000-VAN",
          stock: 20,
          optionValues: ["Vanilla"],
        },
      ],
    },
    {
      name: "Post-Workout Creatine Blend",
      description: "Optimized creatine blend for recovery.",
      price: 29.99,
      compareAtPrice: 34.99,
      sku: "PWCB-500",
      categorySlug: "post-workout",
      brand: "Universal Nutrition",
      isDemo: true,
      quantity: 45,
      imageKeys: ["products/1741870415640--Creatine1.webp"],
      options: [
        {
          name: "Packaging",
          values: ["Standard", "Extra"],
        },
      ],
      variants: [
        {
          price: 29.99,
          sku: "PWCB-500-STD",
          stock: 25,
          optionValues: ["Standard"],
        },
        {
          price: 39.99,
          sku: "PWCB-500-XTR",
          stock: 20,
          optionValues: ["Extra"],
        },
      ],
    },
    {
      name: "Glutamine Powder",
      description: "Pure glutamine powder for muscle recovery.",
      price: 19.99,
      compareAtPrice: 24.99,
      sku: "GP-200",
      categorySlug: "post-workout",
      brand: "Optimum Nutrition",
      isDemo: true,
      quantity: 100,
      imageKeys: ["products/1741870432133--Glutamine.webp"],
      options: [
        {
          name: "Serving",
          values: ["200g", "400g"],
        },
      ],
      variants: [
        {
          price: 19.99,
          sku: "GP-200G",
          stock: 60,
          optionValues: ["200g"],
        },
        {
          price: 34.99,
          sku: "GP-400G",
          stock: 40,
          optionValues: ["400g"],
        },
      ],
    },
    {
      name: "Core ISO Clear",
      description: "Refreshing orange cream protein isolate.",
      price: 44.99,
      compareAtPrice: 49.99,
      sku: "CIC-1000",
      categorySlug: "post-workout",
      brand: "Core Nutritionals",
      isDemo: true,
      quantity: 30,
      imageKeys: [
        "products/1741870361379--core-orange-cream-iso-clear-tf.webp",
      ],
      options: [
        {
          name: "Flavor",
          values: ["Orange", "Cream"],
        },
      ],
      variants: [
        {
          price: 44.99,
          sku: "CIC-1000-ORG",
          stock: 20,
          optionValues: ["Orange"],
        },
        {
          price: 44.99,
          sku: "CIC-1000-CRM",
          stock: 20,
          optionValues: ["Cream"],
        },
      ],
    },
    {
      name: "Karbolyn Fuel",
      description: "Carb formula to replenish muscle glycogen.",
      price: 39.99,
      compareAtPrice: 44.99,
      sku: "KF-300",
      categorySlug: "post-workout",
      brand: "EFX Sports",
      isDemo: true,
      quantity: 25,
      imageKeys: ["products/1741870372825--efx-sports-karbolyn-fuel.webp"],
      options: [
        {
          name: "Size",
          values: ["300g", "600g"],
        },
      ],
      variants: [
        {
          price: 39.99,
          sku: "KF-300G",
          stock: 30,
          optionValues: ["300g"],
        },
        {
          price: 64.99,
          sku: "KF-600G",
          stock: 25,
          optionValues: ["600g"],
        },
      ],
    },
    {
      name: "ZMA Recovery",
      description: "Zinc & magnesium supplement for recovery.",
      price: 24.99,
      compareAtPrice: 29.99,
      sku: "ZMA-30",
      categorySlug: "post-workout",
      brand: "Purus Labs",
      isDemo: true,
      quantity: 40,
      imageKeys: ["products/1741870444105--purus_labs_zm.webp"],
      options: [
        {
          name: "Capsule Count",
          values: ["30 capsules", "60 capsules"],
        },
      ],
      variants: [
        {
          price: 24.99,
          sku: "ZMA-30CAP",
          stock: 25,
          optionValues: ["30 capsules"],
        },
        {
          price: 39.99,
          sku: "ZMA-60CAP",
          stock: 20,
          optionValues: ["60 capsules"],
        },
      ],
    },

    // ----- Pre-Workout -----
    {
      name: "Outrage Pre-Workout",
      description: "High-energy pre-workout for explosive sessions.",
      price: 34.99,
      compareAtPrice: 39.99,
      sku: "OUT-250",
      categorySlug: "pre-workout",
      brand: "Nutrex Research",
      isDemo: true,
      quantity: 50,
      imageKeys: ["products/1741870222540--Outrage-LL-FR.webp"],
      options: [
        {
          name: "Intensity",
          values: ["Regular", "Extra"],
        },
      ],
      variants: [
        {
          price: 34.99,
          sku: "OUT-250-REG",
          stock: 30,
          optionValues: ["Regular"],
        },
        {
          price: 39.99,
          sku: "OUT-250-XTR",
          stock: 20,
          optionValues: ["Extra"],
        },
      ],
    },
    {
      name: "Alpha Lion Pump",
      description: "Pump booster for intense training.",
      price: 39.99,
      compareAtPrice: 44.99,
      sku: "ALP-300",
      categorySlug: "pre-workout",
      brand: "Alpha Lion",
      isDemo: true,
      quantity: 40,
      imageKeys: ["products/1741870154453--alpha-lion-superhuman-pump.webp"],
      options: [
        {
          name: "Flavor",
          values: ["Fruit Punch", "Blue Raspberry"],
        },
      ],
      variants: [
        {
          price: 39.99,
          sku: "ALP-300-FP",
          stock: 30,
          optionValues: ["Fruit Punch"],
        },
        {
          price: 39.99,
          sku: "ALP-300-BR",
          stock: 25,
          optionValues: ["Blue Raspberry"],
        },
      ],
    },
    {
      name: "Blackstone Hype",
      description: "Non-stimulant pre-workout for sustained energy.",
      price: 36.99,
      compareAtPrice: 41.99,
      sku: "BSH-250",
      categorySlug: "pre-workout",
      brand: "Blackstone Labs",
      isDemo: true,
      quantity: 25,
      imageKeys: ["products/1745818866011--blackstone-labs-hype-reloaded.webp"],
      options: [
        {
          name: "Dose",
          values: ["Standard", "Enhanced"],
        },
      ],
      variants: [
        {
          price: 36.99,
          sku: "BSH-250-STD",
          stock: 25,
          optionValues: ["Standard"],
        },
        {
          price: 44.99,
          sku: "BSH-250-ENH",
          stock: 20,
          optionValues: ["Enhanced"],
        },
      ],
    },
    {
      name: "Bucked Up Pre-Workout",
      description: "High-energy formula for peak performance.",
      price: 34.99,
      compareAtPrice: 39.99,
      sku: "BU-300",
      categorySlug: "pre-workout",
      brand: "Bucked Up",
      isDemo: true,
      quantity: 35,
      imageKeys: ["products/1741870309582--bucked-up-bucked-up.webp"],
      options: [
        {
          name: "Intensity",
          values: ["Mild", "Strong"],
        },
      ],
      variants: [
        {
          price: 34.99,
          sku: "BU-300-MLD",
          stock: 35,
          optionValues: ["Mild"],
        },
        {
          price: 42.99,
          sku: "BU-300-STR",
          stock: 25,
          optionValues: ["Strong"],
        },
      ],
    },
    {
      name: "Pump-N-Grind",
      description: "Explosive pre-workout to maximize endurance.",
      price: 36.99,
      compareAtPrice: 41.99,
      sku: "PNG-300",
      categorySlug: "pre-workout",
      brand: "Pump Chasers",
      isDemo: true,
      quantity: 25,
      imageKeys: [
        "products/1741870320323--pump-chasers-pump-n-grind-explosive-pre-workout-formula.webp",
      ],
      options: [
        {
          name: "Flavor",
          values: ["Berry", "Citrus"],
        },
      ],
      variants: [
        {
          price: 36.99,
          sku: "PNG-300-BER",
          stock: 25,
          optionValues: ["Berry"],
        },
        {
          price: 36.99,
          sku: "PNG-300-CIT",
          stock: 20,
          optionValues: ["Citrus"],
        },
      ],
    },
    {
      name: "Purus Labs Pre-Workout",
      description: "Lemonade-flavored pre-workout for optimal energy.",
      price: 29.99,
      compareAtPrice: 34.99,
      sku: "PL-250",
      categorySlug: "pre-workout",
      brand: "Purus Labs",
      isDemo: true,
      quantity: 35,
      imageKeys: [
        "products/1741870335652--puruslabsdpolpowderlemonadenewimage.webp",
      ],
      options: [
        {
          name: "Intensity",
          values: ["Regular", "High"],
        },
      ],
      variants: [
        {
          price: 29.99,
          sku: "PL-250-REG",
          stock: 35,
          optionValues: ["Regular"],
        },
        {
          price: 36.99,
          sku: "PL-250-HIGH",
          stock: 30,
          optionValues: ["High"],
        },
      ],
    },

    // ----- Protein Powders -----
    {
      name: "BCAA Xplode Protein",
      description: "Protein formula enriched with BCAAs for recovery.",
      price: 49.99,
      compareAtPrice: 59.99,
      sku: "BX-1000",
      categorySlug: "protein-powders",
      brand: "Olimp",
      isDemo: true,
      quantity: 20,
      imageKeys: ["products/1741870528260--bcaa-xplode-protein.jpg"],
      options: [
        {
          name: "Flavor",
          values: ["Chocolate", "Vanilla"],
        },
      ],
      variants: [
        {
          price: 49.99,
          sku: "BX-1000-CHOC",
          stock: 20,
          optionValues: ["Chocolate"],
        },
        {
          price: 49.99,
          sku: "BX-1000-VAN",
          stock: 20,
          optionValues: ["Vanilla"],
        },
      ],
    },
    {
      name: "Gold Standard Casein",
      description: "High-quality casein protein for sustained recovery.",
      price: 54.99,
      compareAtPrice: 64.99,
      sku: "GSC-1000",
      categorySlug: "protein-powders",
      brand: "Optimum Nutrition",
      isDemo: true,
      quantity: 15,
      imageKeys: ["products/1741870558795--gold-standard-casein-protein.jpg"],
      options: [
        {
          name: "Size",
          values: ["1kg", "2kg"],
        },
      ],
      variants: [
        {
          price: 54.99,
          sku: "GSC-1000-1KG",
          stock: 15,
          optionValues: ["1kg"],
        },
        {
          price: 89.99,
          sku: "GSC-1000-2KG",
          stock: 15,
          optionValues: ["2kg"],
        },
      ],
    },
    {
      name: "MB Proteins",
      description: "Blended protein for optimal muscle growth.",
      price: 44.99,
      compareAtPrice: 54.99,
      sku: "MBP-1000",
      categorySlug: "protein-powders",
      brand: "MB Nutrition",
      isDemo: true,
      quantity: 25,
      imageKeys: ["products/1741870568938--mb-proteins.jpg"],
      options: [
        {
          name: "Flavor",
          values: ["Chocolate", "Strawberry"],
        },
      ],
      variants: [
        {
          price: 44.99,
          sku: "MBP-1000-CHOC",
          stock: 25,
          optionValues: ["Chocolate"],
        },
        {
          price: 44.99,
          sku: "MBP-1000-STRAW",
          stock: 20,
          optionValues: ["Strawberry"],
        },
      ],
    },
    {
      name: "Olimp Gold Gainer",
      description: "Calorie-rich gainer to support muscle mass.",
      price: 59.99,
      compareAtPrice: 69.99,
      sku: "OGG-2LB",
      categorySlug: "protein-powders",
      brand: "Olimp",
      isDemo: true,
      quantity: 20,
      imageKeys: ["products/1741870580937--olimp-gold-gainer.jpg"],
      options: [
        {
          name: "Size",
          values: ["2lb", "4lb"],
        },
      ],
      variants: [
        {
          price: 59.99,
          sku: "OGG-2LB",
          stock: 20,
          optionValues: ["2lb"],
        },
        {
          price: 99.99,
          sku: "OGG-4LB",
          stock: 15,
          optionValues: ["4lb"],
        },
      ],
    },
    {
      name: "Olimp Gold Protein",
      description: "Premium whey protein for lean muscle building.",
      price: 49.99,
      compareAtPrice: 59.99,
      sku: "OGP-1000",
      categorySlug: "protein-powders",
      brand: "Olimp",
      isDemo: true,
      quantity: 25,
      imageKeys: ["products/1741870631105--olimp-gold-protein.jpg"],
      options: [
        {
          name: "Flavor",
          values: ["Chocolate", "Vanilla"],
        },
      ],
      variants: [
        {
          price: 49.99,
          sku: "OGP-1000-CHOC",
          stock: 25,
          optionValues: ["Chocolate"],
        },
        {
          price: 49.99,
          sku: "OGP-1000-VAN",
          stock: 25,
          optionValues: ["Vanilla"],
        },
      ],
    },

    // ----- Vitamins -----
    {
      name: "Ancient Men's Multi",
      description: "Daily multivitamin for men's health.",
      price: 24.99,
      compareAtPrice: 29.99,
      sku: "AMM-30",
      categorySlug: "vitamins",
      brand: "Ancient Nutrition",
      isDemo: true,
      quantity: 50,
      imageKeys: [
        "products/1745818790455--ancient-nutrition-ancient-nutrients-mens-multi-once-daily-multi.webp",
      ],
      options: [
        {
          name: "Bottle Size",
          values: ["30 tablets", "60 tablets"],
        },
      ],
      variants: [
        {
          price: 24.99,
          sku: "AMM-30TAB",
          stock: 50,
          optionValues: ["30 tablets"],
        },
        {
          price: 44.99,
          sku: "AMM-60TAB",
          stock: 50,
          optionValues: ["60 tablets"],
        },
      ],
    },
    {
      name: "Liposomal Vitamin D3",
      description: "High-absorption vitamin D3 in liposomal form.",
      price: 19.99,
      compareAtPrice: 24.99,
      sku: "LVD-60",
      categorySlug: "vitamins",
      brand: "Blackstone Labs",
      isDemo: true,
      quantity: 35,
      imageKeys: [
        "products/1741870643275--blackstone-labs-liposomal-vitamin-d3.webp",
      ],
      options: [
        {
          name: "Capsule Count",
          values: ["60 capsules", "120 capsules"],
        },
      ],
      variants: [
        {
          price: 19.99,
          sku: "LVD-60CAP",
          stock: 35,
          optionValues: ["60 capsules"],
        },
        {
          price: 34.99,
          sku: "LVD-120CAP",
          stock: 35,
          optionValues: ["120 capsules"],
        },
      ],
    },
    {
      name: "Core Multi",
      description: "Daily multivitamin with essential nutrients.",
      price: 26.99,
      compareAtPrice: 31.99,
      sku: "CM-30",
      categorySlug: "vitamins",
      brand: "Core Nutritionals",
      isDemo: true,
      quantity: 30,
      imageKeys: ["products/1741870683479--core-nutritionals-core-multi.webp"],
      options: [
        {
          name: "Bottle Size",
          values: ["30 tablets", "60 tablets"],
        },
      ],
      variants: [
        {
          price: 26.99,
          sku: "CM-30TAB",
          stock: 30,
          optionValues: ["30 tablets"],
        },
        {
          price: 49.99,
          sku: "CM-60TAB",
          stock: 30,
          optionValues: ["60 tablets"],
        },
      ],
    },
    {
      name: "Vegan Multivitamin",
      description: "Plant-based multivitamin for optimal health.",
      price: 29.99,
      compareAtPrice: 34.99,
      sku: "VM-30",
      categorySlug: "vitamins",
      brand: "Inspired Nutraceuticals",
      isDemo: true,
      quantity: 25,
      imageKeys: [
        "products/1745818684782--inspired-nutraceuticals-vegan-multivitamin.webp",
      ],
      options: [
        {
          name: "Bottle Size",
          values: ["30 tablets", "60 tablets"],
        },
      ],
      variants: [
        {
          price: 29.99,
          sku: "VM-30TAB",
          stock: 25,
          optionValues: ["30 tablets"],
        },
        {
          price: 54.99,
          sku: "VM-60TAB",
          stock: 25,
          optionValues: ["60 tablets"],
        },
      ],
    },
    {
      name: "Legion Vit D & K",
      description: "Supports bone health with vitamins D & K.",
      price: 14.99,
      compareAtPrice: 19.99,
      sku: "LDK-30",
      categorySlug: "vitamins",
      brand: "Legion",
      isDemo: true,
      quantity: 40,
      imageKeys: ["products/1745818778769--legion-vitamin-dk.webp"],
      options: [
        {
          name: "Capsule Count",
          values: ["30 capsules", "60 capsules"],
        },
      ],
      variants: [
        {
          price: 14.99,
          sku: "LDK-30CAP",
          stock: 40,
          optionValues: ["30 capsules"],
        },
        {
          price: 27.99,
          sku: "LDK-60CAP",
          stock: 40,
          optionValues: ["60 capsules"],
        },
      ],
    },
    {
      name: "Now Foods Vitamin B12",
      description: "High-potency vitamin B12 for an energy boost.",
      price: 12.99,
      compareAtPrice: 16.99,
      sku: "NFB-30",
      categorySlug: "vitamins",
      brand: "Now Foods",
      isDemo: true,
      quantity: 45,
      imageKeys: ["products/1741870664952--now-foods-vitamin-b.webp"],
      options: [
        {
          name: "Bottle Size",
          values: ["30 tablets", "60 tablets"],
        },
      ],
      variants: [
        {
          price: 12.99,
          sku: "NFB-30TAB",
          stock: 45,
          optionValues: ["30 tablets"],
        },
        {
          price: 23.99,
          sku: "NFB-60TAB",
          stock: 45,
          optionValues: ["60 tablets"],
        },
      ],
    },

    // ----- Fat Burners -----
    {
      name: "Cognisport",
      description: "Advanced weight management supplement.",
      price: 39.99,
      compareAtPrice: 44.99,
      sku: "CSP-60",
      categorySlug: "fat-burners",
      brand: "Cognizin",
      isDemo: true,
      quantity: 25,
      imageKeys: ["products/1741870698851--Cognisport.webp"],
      options: [
        {
          name: "Package",
          values: ["60 capsules", "120 capsules"],
        },
      ],
      variants: [
        {
          price: 39.99,
          sku: "CSP-60CAP",
          stock: 25,
          optionValues: ["60 capsules"],
        },
        {
          price: 74.99,
          sku: "CSP-120CAP",
          stock: 25,
          optionValues: ["120 capsules"],
        },
      ],
    },
    {
      name: "Tribulus Extract",
      description: "Herbal extract to support hormone balance.",
      price: 14.99,
      compareAtPrice: 19.99,
      sku: "TRE-1",
      categorySlug: "fat-burners",
      brand: "Universal Nutrition",
      isDemo: true,
      quantity: 40,
      imageKeys: ["products/1741870708121--Tribulus.webp"],
      options: [
        {
          name: "Serving",
          values: ["1 serving", "2 servings"],
        },
      ],
      variants: [
        {
          price: 14.99,
          sku: "TRE-1SERV",
          stock: 40,
          optionValues: ["1 serving"],
        },
        {
          price: 27.99,
          sku: "TRE-2SERV",
          stock: 35,
          optionValues: ["2 servings"],
        },
      ],
    },
    {
      name: "Liposomal Vitamin C",
      description: "Enhanced vitamin C for immune support.",
      price: 22.99,
      compareAtPrice: 27.99,
      sku: "LVC-100",
      categorySlug: "fat-burners",
      brand: "Blackstone Labs",
      isDemo: true,
      quantity: 30,
      imageKeys: [
        "products/1741871795823--blackstone-labs-liposomal-vitamin-c.webp",
      ],
      options: [
        {
          name: "Bottle Size",
          values: ["100ml", "200ml"],
        },
      ],
      variants: [
        {
          price: 22.99,
          sku: "LVC-100ML",
          stock: 30,
          optionValues: ["100ml"],
        },
        {
          price: 39.99,
          sku: "LVC-200ML",
          stock: 30,
          optionValues: ["200ml"],
        },
      ],
    },
    {
      name: "Calcium Magnesium Combo",
      description: "Essential minerals for bone & muscle health.",
      price: 29.99,
      compareAtPrice: 34.99,
      sku: "CMC-60",
      categorySlug: "fat-burners",
      brand: "BodyBio",
      isDemo: true,
      quantity: 20,
      imageKeys: [
        "products/1741870719005--bodybio-calcium-magnesium-butyrate.webp",
      ],
      options: [
        {
          name: "Capsule Count",
          values: ["60 capsules", "120 capsules"],
        },
      ],
      variants: [
        {
          price: 29.99,
          sku: "CMC-60CAP",
          stock: 20,
          optionValues: ["60 capsules"],
        },
        {
          price: 54.99,
          sku: "CMC-120CAP",
          stock: 20,
          optionValues: ["120 capsules"],
        },
      ],
    },
    {
      name: "Fish Oil Omega-3",
      description: "Omega-3 fatty acids to support heart health.",
      price: 17.99,
      compareAtPrice: 21.99,
      sku: "FIO-100",
      categorySlug: "fat-burners",
      brand: "MTS Nutrition",
      isDemo: true,
      quantity: 35,
      imageKeys: [
        "products/1741870728678--mts-nutrition-mts-fish-oil-omega-3.webp",
      ],
      options: [
        {
          name: "Bottle Size",
          values: ["100 softgels", "200 softgels"],
        },
      ],
      variants: [
        {
          price: 17.99,
          sku: "FIO-100SG",
          stock: 35,
          optionValues: ["100 softgels"],
        },
        {
          price: 32.99,
          sku: "FIO-200SG",
          stock: 35,
          optionValues: ["200 softgels"],
        },
      ],
    },
    {
      name: "Bloat Eaze Pro",
      description: "Advanced formula to reduce bloating.",
      price: 34.99,
      compareAtPrice: 39.99,
      sku: "BEP-30",
      categorySlug: "fat-burners",
      brand: "Nuethix",
      isDemo: true,
      quantity: 18,
      imageKeys: ["products/1741870739810--nuethix-bloat-eaze-pro.webp"],
      options: [
        {
          name: "Package",
          values: ["30 capsules", "60 capsules"],
        },
      ],
      variants: [
        {
          price: 34.99,
          sku: "BEP-30CAP",
          stock: 18,
          optionValues: ["30 capsules"],
        },
        {
          price: 64.99,
          sku: "BEP-60CAP",
          stock: 17,
          optionValues: ["60 capsules"],
        },
      ],
    },
  ];

  console.log("Creating products...");

  // Create products one by one
  for (const product of products) {
    try {
      const slug = slugifyNative(product.name);
      const categoryId = categoriesMap[product.categorySlug];

      console.log(`Creating product: ${product.name}`);

      // Create the base product
      const createdProduct = await prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          slug: slug,
          price: product.price,
          sku: product.sku,
          categoryId: categoryId,
          is_demo: product.isDemo || true,
          quantity: product.quantity || 0,
          brand: product.brand,
        },
      });

      // Add images
      if (product.imageKeys?.length) {
        console.log(`  Adding ${product.imageKeys.length} images`);
        await prisma.productImage.createMany({
          data: product.imageKeys.map((key) => ({
            imageKey: key, // Fixed field name to match schema
            productId: createdProduct.id,
          })),
        });
      }

      // Create options and option values
      const optionValueIdMap: any = {}; // Map to track created option values

      if (product.options?.length) {
        console.log(`  Creating ${product.options.length} options`);

        for (const option of product.options) {
          // Create option
          const createdOption = await prisma.productOption.create({
            data: {
              name: option.name,
              productId: createdProduct.id,
            },
          });

          // Create option values
          for (const value of option.values) {
            const createdOptionValue = await prisma.productOptionValue.create({
              data: {
                value: value,
                optionId: createdOption.id,
              },
            });

            // Store the real ID for later use with variants
            optionValueIdMap[value] = createdOptionValue.id;
          }
        }
      }

      // Create variants
      if (product.variants?.length) {
        console.log(`  Creating ${product.variants.length} variants`);

        for (const variant of product.variants) {
          // Create the variant
          const createdVariant = await prisma.productVariant.create({
            data: {
              price: variant.price,
              // sku: variant.sku,
              stock: variant.stock,
              productId: createdProduct.id,
            },
          });

          // Connect option values to variant
          if (variant.optionValues?.length) {
            for (const value of variant.optionValues) {
              const optionValueId = optionValueIdMap[value];
              if (optionValueId) {
                await prisma.productVariantOptionValue.create({
                  data: {
                    variantId: createdVariant.id,
                    optionValueId: optionValueId,
                  },
                });
              }
            }
          }
        }
      }

      console.log(
        `Created product: ${product.name} (ID: ${createdProduct.id})`
      );
    } catch (error) {
      console.error(`Error creating product ${product.name}:`, error);
    }
  }

  console.log("Products seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
