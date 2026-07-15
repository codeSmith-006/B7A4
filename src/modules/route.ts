import { Router } from "express";
import { authRoutes } from "./Auth/route.js";
import { categoryRoutes } from "./category/routes.js";
import { rentalRoutes } from "./rental/routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/rentals", rentalRoutes);

export default router;
