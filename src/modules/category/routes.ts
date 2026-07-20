import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { categoryController } from "./controller";

const router = Router();

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     tags:
 *       - Category
 *     summary: Get all categories
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
 *         description: Optional. Applies partial, case-insensitive search on name or description only when provided.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by category name.
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Optional. Exact match filter by category slug.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt]
 *         description: Optional. Sorting is applied only when sortBy is provided.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Optional. Used only with sortBy.
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesResponse'
 */
router.get("/", categoryController.getCategories);

/**
 * @openapi
 * /api/v1/categories:
 *   post:
 *     tags:
 *       - Category
 *     summary: Create a category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryPayload'
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       409:
 *         description: Category name or slug already exists
 */
router.post("/", auth(UserRole.ADMIN), categoryController.createCategory);

export const categoryRoutes = router;
