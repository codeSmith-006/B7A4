import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { adminController } from "./controller";

const router = Router();

router.use(auth(UserRole.ADMIN));

/**
 * @openapi
 * /api/v1/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUsersResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/users", adminController.getUsers);

/**
 * @openapi
 * /api/v1/admin/users/{id}:
 *   patch:
 *     tags:
 *       - Admin
 *     summary: Update user status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserStatusPayload'
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminUpdateUserStatusResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: User not found
 */
router.patch("/users/:id", adminController.updateUserStatus);

/**
 * @openapi
 * /api/v1/admin/properties:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all properties (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Properties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminPropertiesResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/properties", adminController.getProperties);

/**
 * @openapi
 * /api/v1/admin/rentals:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all rentals (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rentals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminRentalsResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 */
router.get("/rentals", adminController.getRentals);

export const adminRoutes = router;
