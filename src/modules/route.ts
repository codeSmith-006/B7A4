import { Router } from "express";
import { authRoutes } from "./Auth/route.js";
import { categoryRoutes } from "./category/routes.js";
import { propertyRoutes } from "./property/routes.js";
import { rentalRoutes } from "./rental/routes.js";
import { reviewRoutes } from "./review/routes.js";
import { adminRoutes } from "./admin/routes.js";
import { paymentRoutes } from "../payment/routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/properties", propertyRoutes);
router.use("/rentals", rentalRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);

export default router;
