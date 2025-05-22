import express, { Request, Response } from "express";
import { validateData, contactSchema } from "@repo/shared"; // Import shared schema from package index
import { sendResponse } from "../utils/apiResponse.js";
import { handleError } from "../utils/handleErrors.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    // Use the imported schema for validation
    const validatedData = validateData(contactSchema, req.body);
    const { name, email, message } = validatedData;

    // TODO: Implement actual processing (e.g., save to DB, send email)

    sendResponse(res, 200, {
      success: true,
      message: "Contact message received successfully.",
    });
  } catch (error) {
    handleError(error, res);
  }
});

export default router;
