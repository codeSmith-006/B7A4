import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/auth";
import { propertyController } from "./controller";

const router = Router();

/**
 * @openapi
 * /api/v1/properties:
 *   get:
 *     tags:
 *       - Property
 *     summary: Get property listings
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of properties per page
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
 *               $ref: '#/components/schemas/PropertiesResponse'
 */
router.get("/", propertyController.getProperties);

/**
 * @openapi
 * /api/v1/properties/{id}:
 *   get:
 *     tags:
 *       - Property
 *     summary: Get a property by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property id
 *     responses:
 *       200:
 *         description: Property retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyDetailsResponse'
 *       404:
 *         description: Property not found
 */
router.get("/:id", propertyController.getPropertyById);

/**
 * @openapi
 * /api/v1/properties:
 *   post:
 *     tags:
 *       - Property
 *     summary: Create a property listing
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyPayload'
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PropertyResponse'
 *                 - type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                       example: 201
 *                     message:
 *                       type: string
 *                       example: Property created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Landlord access required
 *       404:
 *         description: Category not found
 */
router.post("/", auth(UserRole.LANDLORD), propertyController.createProperty);

/**
 * @openapi
 * /api/v1/properties/{id}:
 *   put:
 *     tags:
 *       - Property
 *     summary: Update a property listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyUpdatePayload'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PropertyResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Property updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Landlord access required
 *       404:
 *         description: Property not found
 */
router.put("/:id", auth(UserRole.LANDLORD), propertyController.updateProperty);

/**
 * @openapi
 * /api/v1/properties/{id}:
 *   delete:
 *     tags:
 *       - Property
 *     summary: Delete a property listing
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Property id
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyDeleteResponse'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Landlord access required
 *       404:
 *         description: Property not found
 */
router.delete("/:id", auth(UserRole.LANDLORD), propertyController.deleteProperty);

export const propertyRoutes = router;
