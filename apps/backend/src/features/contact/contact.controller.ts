import { Request, Response } from "express";
import contactService from "./contact.service.js";
import { handleError } from "#utils/handle-errors.js";
import { sendResponse } from "#utils/api-response.js";

/**
 * Contact controller responsible for handling HTTP requests related to contact form
 */
export class ContactController {
  /**
   * Process a contact form submission
   */
  async submitContactForm(req: Request, res: Response) {
    try {
      const result = await contactService.processContactSubmission(req.body);

      sendResponse(res, 200, result);
    } catch (error) {
      handleError(error, res);
    }
  }
}

export default new ContactController();
