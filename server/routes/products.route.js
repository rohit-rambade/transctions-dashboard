import { Router } from "express";
import { seedProducts } from "../controllers/products.controller.js";

const router = Router();

router.get("/seed-products", seedProducts);

export default router;
