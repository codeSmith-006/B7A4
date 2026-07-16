import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { reviewController } from "./controller";

const router = Router();

/**
 * @openapi
 * /api/v1/reviews:
 *   post:
 *     tags:
 *       - Review
 *     summary: Submit a review for a rental property
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewPayload'
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Review submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request - invalid data or payment not completed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Tenant access required
 *       404:
 *         description: Rental request not found
 *       409:
 *         description: Review already submitted
 */
router.post("/", auth(UserRole.TENANT), reviewController.createReview);

export const reviewRoutes = router;
