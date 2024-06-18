import { Router } from "express";
import {
  barChart,
  combineData,
  getStatistics,
  listAllTransactions,
  pieChart,
  seedProducts,
} from "../controllers/products.controller.js";

const router = Router();

router
  .get("/seed-products", seedProducts)
  .get("/list-all-transactions", listAllTransactions)
  .get("/statistics", getStatistics)
  .get("/bar-chart", barChart)
  .get("/pie-chart", pieChart)
  .get("/combined-data", combineData);

export default router;
