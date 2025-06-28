import { Request, Response } from "express";
import countriesService from "./countries.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

/**
 * Countries controller responsible for handling HTTP requests related to countries
 */
export class CountriesController {
  /**
   * Get all countries where shipping is available
   */
  async getAllShippingCountries(req: Request, res: Response) {
    try {
      const countries = await countriesService.getAllShippingCountries();

      sendResponse(res, 200, { success: true, data: countries });
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new CountriesController();
