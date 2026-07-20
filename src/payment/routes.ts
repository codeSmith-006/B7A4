import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { paymentController } from "./controller";

const router = Router();

router.post("/create", auth(UserRole.TENANT), paymentController.createPaymentIntent);
router.post("/confirm", auth(UserRole.TENANT), paymentController.confirmPayment);
router.get("/", auth(UserRole.TENANT), paymentController.getPayments);
router.get("/:id", auth(UserRole.TENANT), paymentController.getPaymentById);

export const paymentRoutes = router;
