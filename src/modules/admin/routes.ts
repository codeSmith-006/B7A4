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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: ryan
 *         description: Partial, case-insensitive search on name, email, or phone
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: Ryan Rehan
 *         description: Exact match filter by name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *           example: ryan@example.com
 *         description: Exact match filter by email
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *           example: "+8801700000000"
 *         description: Exact match filter by phone
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, LANDLORD, TENANT]
 *           example: TENANT
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, BLOCKED]
 *           example: ACTIVE
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, email, role, status]
 *           example: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: apartment
 *         description: Partial, case-insensitive search on title or description
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           example: Modern city apartment
 *         description: Exact match filter by title
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *           example: A bright apartment near public transport.
 *         description: Exact match filter by description
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: Dhaka
 *         description: Exact match filter by city
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *           example: Gulshan
 *         description: Exact match filter by area
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           example: category_uuid
 *       - in: query
 *         name: minRent
 *         schema:
 *           type: number
 *           example: 500
 *       - in: query
 *         name: maxRent
 *         schema:
 *           type: number
 *           example: 2000
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: bathrooms
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, UNAVAILABLE]
 *           example: AVAILABLE
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, rent, bedrooms, bathrooms, title]
 *           example: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: visit
 *         description: Partial, case-insensitive search on rental message
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, PAID, ACTIVE]
 *           example: PENDING
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *           example: property_uuid
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *           example: tenant_uuid
 *       - in: query
 *         name: minMonthlyRent
 *         schema:
 *           type: number
 *           example: 500
 *       - in: query
 *         name: maxMonthlyRent
 *         schema:
 *           type: number
 *           example: 2000
 *       - in: query
 *         name: durationMonths
 *         schema:
 *           type: integer
 *           example: 12
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, moveInDate, durationMonths, monthlyRent, status]
 *           example: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
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
