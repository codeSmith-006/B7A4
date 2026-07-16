import { Router } from "express";
import { authRoutes } from "./Auth/route.js";
import { categoryRoutes } from "./category/routes.js";
import { propertyRoutes } from "./property/routes.js";
import { rentalRoutes } from "./rental/routes.js";
import { reviewRoutes } from "./review/routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/properties", propertyRoutes);
router.use("/rentals", rentalRoutes);
router.use("/reviews", reviewRoutes);

export default router;
