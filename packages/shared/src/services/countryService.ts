import { fetchData } from "#services/apiClient";
import type { ApiResult } from "#types/api";
import type { Country } from "@prisma/client";
import { FetchMethod } from "#types/enums";

export const countryService = {
  getCountries: async (): Promise<ApiResult<Country[]>> => {
    return await fetchData({
      slug: "countries",
      method: FetchMethod.GET,
      cache: "no-store",
    });
  },
};
