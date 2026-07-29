import express from "express";
import { getCustomers, getProducts } from "../controllers/clientController.js";

// Create a new Router object to handle routes related to user operations
const clientRouter = express.Router();

clientRouter.get("/products", getProducts);
clientRouter.get("/customers", getCustomers);

export default clientRouter;
