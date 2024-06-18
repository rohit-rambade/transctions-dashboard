import { Router } from "express";
import {
  listAllTransactions,
  seedProducts,
} from "../controllers/products.controller.js";

const router = Router();

router
  .get("/seed-products", seedProducts)
  .get("/list-all-transactions", listAllTransactions)
  .get("/");

export default router;
