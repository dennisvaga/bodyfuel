import express, { Router } from "express";
import countriesController from "./countries.controller.js";

const router: Router = express.Router();

// Get all countries where shipping is available
router.get(
  "/",
  countriesController.getAllShippingCountries.bind(countriesController)
);

export default router;
