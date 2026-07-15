import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { rentalController } from "./controller";

const router = Router();

/**
 * @openapi
 * /api/v1/rentals:
 *   post:
 *     tags:
 *       - Rental
 *     summary: Submit a rental request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RentalRequestPayload'
 *     responses:
 *       201:
 *         description: Rental request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RentalRequestResponse'
 *                 - type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 201
 *                     message:
 *                       type: string
 *                       example: Rental request submitted successfully
 *       400:
 *         description: Property is not available or request is invalid
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Tenant access required
 *       404:
 *         description: Property not found
 */
router.post("/", auth(UserRole.TENANT), rentalController.createRentalRequest);

/**
 * @openapi
 * /api/v1/rentals:
 *   get:
 *     tags:
 *       - Rental
 *     summary: Get rental requests for the authenticated user
 *     description: Tenants receive their own rental requests. Landlords receive requests for their properties. Admins can access the endpoint, but the current service returns requests for the authenticated user id.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalRequestsResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get("/", auth(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), rentalController.getMyRentalRequests);

/**
 * @openapi
 * /api/v1/rentals/{id}:
 *   get:
 *     tags:
 *       - Rental
 *     summary: Get a rental request by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental request id
 *     responses:
 *       200:
 *         description: Rental request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RentalRequestResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Rental request not found
 */
router.get("/:id", auth(UserRole.TENANT, UserRole.LANDLORD, UserRole.ADMIN), rentalController.getRentalRequestById);

/**
 * @openapi
 * /api/v1/rentals/{id}:
 *   patch:
 *     tags:
 *       - Rental
 *     summary: Approve or reject a pending rental request
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental request id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RentalStatusPayload'
 *     responses:
 *       200:
 *         description: Rental request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/RentalRequestResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Rental request updated successfully
 *       400:
 *         description: Only pending requests can be updated
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Landlord access required
 *       404:
 *         description: Rental request not found
 */
router.patch("/:id", auth(UserRole.LANDLORD), rentalController.updateRentalStatus);

export const rentalRoutes = router;
