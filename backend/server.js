import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRouter from "./routes/clientRoute.js";
import generalRouter from "./routes/generalRoute.js";
import managementRouter from "./routes/managementRoute.js";
import salesRouter from "./routes/salesRoute.js";
import connectDB from "./config/mongodb.js";

/**********************************
 ********** App Config ************
 ********************************** */
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
await connectDB();

/**********************************
 ********** Middlewares ***********
 ********************************** */
// Use the JSON parser middleware to automatically parse JSON requests
app.use(express.json());

// Enables a bundle of security-related HTTP response headers.
app.use(helmet());

// Adds CORP (Cross-Origin-Resource-Policy).
// Use only if you have a specific niche need; most JSON API apps don't require it.
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Logs HTTP requests in a standard "common" format for debugging/monitoring.
app.use(morgan("common"));

// Parses JSON request bodies and exposes them as req.body.
// In modern Express, prefer express.json() (built-in); this is legacy/backwards compatibility style.
app.use(express.json());

// Parses URL-encoded form bodies and exposes them as req.body.
// extended:false keeps it to simple key/value parsing (no rich nested objects).
app.use(express.urlencoded({ extended: false }));

// Access Backend from any IP
app.use(cors());

/**********************************
 ********* API Endpoints **********
 ********************************** */
app.use("/api/client", clientRouter);
app.use("/api/general", generalRouter);
app.use("/api/management", managementRouter);
app.use("/api/sales", salesRouter);

// Define the root endpoint '/' which responds with a simple message to indicate that the API is working
app.get("/", (req, res) => {
  res.send("API is Working");
});
// Start the Express server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server started on PORT : ${PORT}`);
});

// Import Mock Data
// import userModel from "./models/userModel.js";
// import ProductStatModel from "./models/ProductStatModel.js";
// import ProductModel from "./models/ProductModel.js";
// import TransactionModel from "./models/TransactionModel.js";
// import OverallStatModel from "./models/OverallStatModel.js";
// import {
//   dataUser,
//   dataProduct,
//   dataProductStat,
//   dataTransaction,
//   dataOverallStat
// } from "./data/index.js";

// only add data one time
// OverallStatModel.insertMany(dataOverallStat)

// ProductModel.insertMany(dataProduct)
// ProductStatModel.insertMany(dataProductStat)

// userModel.insertMany(dataUser)

// const seededTransactions = dataTransaction.map((transaction) => ({
//   ...transaction,
//   products: transaction.products.map((productId) => ({
//     productId,
//     quantity: Math.floor(Math.random() * 5) + 1, // 1–5, arbitrary
//   })),
// }));
// await TransactionModel.insertMany(seededTransactions);
