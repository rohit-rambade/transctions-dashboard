import { Router } from "express";
import {
  barChart,
  getStatistics,
  listAllTransactions,
  seedProducts,
} from "../controllers/products.controller.js";

const router = Router();

router
  .get("/seed-products", seedProducts)
  .get("/list-all-transactions", listAllTransactions)
  .get("/statistics", getStatistics)
  .get("/bar-chart", barChart)
  .get("/");

export default router;
