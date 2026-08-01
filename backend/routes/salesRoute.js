import express from "express";
import { getSales } from "../controllers/salesController.js";

// Create a new Router object to handle routes related to user operations
const salesRouter = express.Router();
salesRouter.get('/sales', getSales)

export default salesRouter;
