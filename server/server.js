import express from "express";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { connectDb } from "./database/db.js";

import productRoutes from "./routes/products.route.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use("/api/product", productRoutes);
app.listen(PORT, () => {
  console.log(`server started : ${PORT}`);
  connectDb();
});
