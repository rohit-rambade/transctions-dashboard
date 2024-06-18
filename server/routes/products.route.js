import { Router } from "express";
import {
  getStatistics,
  listAllTransactions,
  seedProducts,
} from "../controllers/products.controller.js";

const router = Router();

router
  .get("/seed-products", seedProducts)
  .get("/list-all-transactions", listAllTransactions)
  .get("/statistics", getStatistics)
  .get("/");

export default router;
