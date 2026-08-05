import express from "express";
import {
  getAdmin,
  getUserPerformance,
} from "../controllers/managementController.js";

// Create a new Router object to handle routes related to user operations
const managementRouter = express.Router();
managementRouter.get("/admin", getAdmin);
managementRouter.get("/performance/:id", getUserPerformance);

export default managementRouter;
