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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Optional. Applies partial, case-insensitive search on name, email, or phone only when provided.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by name.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           format: email
 *         description: Optional. Exact match filter by email.
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by phone.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, LANDLORD, TENANT]
 *         description: Optional. Filter by user role.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, BLOCKED]
 *         description: Optional. Filter by user status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, name]
 *         description: Optional. Sorting is applied only when sortBy is provided.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Optional. Used only with sortBy.
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Optional. Applies partial, case-insensitive search on title or description only when provided.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by title.
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by description.
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by city.
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by area.
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Optional. Filter by category id.
 *       - in: query
 *         name: minRent
 *         schema:
 *           type: number
 *         description: Optional. Minimum rent filter.
 *       - in: query
 *         name: maxRent
 *         schema:
 *           type: number
 *         description: Optional. Maximum rent filter.
 *       - in: query
 *         name: bedrooms
 *         schema:
 *           type: integer
 *         description: Optional. Filter by bedroom count.
 *       - in: query
 *         name: bathrooms
 *         schema:
 *           type: integer
 *         description: Optional. Filter by bathroom count.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, UNAVAILABLE]
 *         description: Optional. Filter by property status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, rent]
 *         description: Optional. Sorting is applied only when sortBy is provided.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Optional. Used only with sortBy.
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Optional. Applies partial, case-insensitive search on rental message only when provided.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, PAID, ACTIVE]
 *         description: Optional. Filter by rental request status.
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Optional. Filter by property id.
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *         description: Optional. Filter by tenant id.
 *       - in: query
 *         name: minMonthlyRent
 *         schema:
 *           type: number
 *         description: Optional. Minimum monthly rent filter.
 *       - in: query
 *         name: maxMonthlyRent
 *         schema:
 *           type: number
 *         description: Optional. Maximum monthly rent filter.
 *       - in: query
 *         name: durationMonths
 *         schema:
 *           type: integer
 *         description: Optional. Filter by rental duration in months.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, monthlyRent]
 *         description: Optional. Sorting is applied only when sortBy is provided.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Optional. Used only with sortBy.
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
