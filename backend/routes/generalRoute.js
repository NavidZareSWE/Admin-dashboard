import express from "express";
import { getDashboardStats, getUser } from "../controllers/generalController.js";

// Create a new Router object to handle routes related to user operations
const generalRouter = express.Router();

generalRouter.get("/user/:id", getUser);
generalRouter.get("/dashboard", getDashboardStats);


export default generalRouter;
