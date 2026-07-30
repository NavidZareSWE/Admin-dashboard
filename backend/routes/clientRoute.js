import express from "express";
import { getCustomers, getProducts, getTransactions } from "../controllers/clientController.js";

// Create a new Router object to handle routes related to user operations
const clientRouter = express.Router();

clientRouter.get("/products", getProducts);
clientRouter.get("/customers", getCustomers);
clientRouter.get("/transactions", getTransactions);



export default clientRouter;
