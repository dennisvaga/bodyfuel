import express, { Router } from "express";
import contactController from "./contact.controller.js";

const router: Router = express.Router();

// Submit contact form
router.post("/", contactController.submitContactForm.bind(contactController));

export default router;
