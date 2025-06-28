import countriesRepository from "./countries.repository.js";

/**
 * Countries service responsible for country-related business logic
 */
export class CountriesService {
  /**
   * Get all countries where shipping is available
   */
  async getAllShippingCountries() {
    const countries = await countriesRepository.findAllShippingAvailable();

    if (!countries) {
      throw new Error("No countries found");
    }

    return countries;
  }
}

export default new CountriesService();
