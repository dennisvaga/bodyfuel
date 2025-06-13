import { getPrisma } from "@repo/database";
import type { Country } from "@prisma/client";

const prisma = await getPrisma();

// Country structure of the external api
type externalCountry = { name: { common: string }; cca2: string };

export const fetchCountries = async () => {
  const data = await fetch(`https://restcountries.com/v3.1/all`);
  const countries = await data.json();

  return countries
    .map(({ cca2, name }: externalCountry, index: number) => ({
      id: index,
      code: cca2,
      name: name.common,
    }))
    .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
};

// Import your existing fetch function

async function main() {
  console.log("Fetching countries...");
  const countries = await fetchCountries();

  // Add displayOrder to prioritize common countries
  const priorityCountries = [
    "IL",
    "US",
    "GB",
    "DE",
    "FR",
    "IT",
    "NL",
    "AE",
    "BH",
    "MA",
    "EG",
    "JO",
    "CN",
    "IN",
    "JP",
    "KR",
    "CA",
    "AU",
    "ES",
    "CH",
    "SE",
    "BE",
    "AT",
    "PL",
    "CZ",
    "GR",
    "CY",
  ];
  const enhancedCountries = countries.map((country: Country) => ({
    ...country,
    displayOrder: priorityCountries.includes(country.code)
      ? priorityCountries.indexOf(country.code) + 1
      : 100,
    isShippingAvailable: true,
  }));

  console.log("Seeding countries to database...");
  // Process in batches to avoid timeouts
  const batchSize = 50;
  for (let i = 0; i < enhancedCountries.length; i += batchSize) {
    const batch = enhancedCountries.slice(i, i + batchSize);

    await prisma.$transaction(
      batch.map((country: Country) =>
        prisma.country.upsert({
          where: { code: country.code },
          update: {
            name: country.name,
            displayOrder: country.displayOrder,
            isShippingAvailable: country.isShippingAvailable,
          },
          create: {
            code: country.code,
            name: country.name,
            displayOrder: country.displayOrder,
            isShippingAvailable: country.isShippingAvailable,
          },
        })
      )
    );

    console.log(
      `Processed countries ${i + 1} to ${Math.min(i + batchSize, enhancedCountries.length)}`
    );
  }

  console.log("Countries seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
