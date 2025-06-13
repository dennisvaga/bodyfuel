import type { Country } from "@prisma/client";

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
