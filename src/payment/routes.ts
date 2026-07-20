import { Router } from "express";
import { UserRole } from "../../generated/prisma/client";
import { auth } from "../middleware/auth";
import { paymentController } from "./controller";

const router = Router();

/**
 * @openapi
 * /api/v1/payments/create:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create a Stripe Checkout session for an approved rental request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentIntentPayload'
 *     responses:
 *       201:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntentResponse'
 *       400:
 *         description: Stripe is not configured or rental request is not approved
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Tenant access required
 *       404:
 *         description: Approved rental request not found
 */
router.post("/create", auth(UserRole.TENANT), paymentController.createPaymentIntent);

/**
 * @openapi
 * /api/v1/payments/success:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Confirm a successful Stripe Checkout session and redirect to frontend
 *     description: Stripe redirects the browser here after Checkout. The API verifies the session, updates the payment and rental request status, then redirects to the frontend success page.
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to frontend success page
 */
router.get("/success", paymentController.handleCheckoutSuccess);

/**
 * @openapi
 * /api/v1/payments:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Get payments for the authenticated tenant
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentsResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Tenant access required
 */
router.get("/", auth(UserRole.TENANT), paymentController.getPayments);

/**
 * @openapi
 * /api/v1/payments/{id}:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Get a payment by id for the authenticated tenant
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment id
 *     responses:
 *       200:
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Tenant access required
 *       404:
 *         description: Payment not found
 */
router.get("/:id", auth(UserRole.TENANT), paymentController.getPaymentById);

export const paymentRoutes = router;
