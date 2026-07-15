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
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of properties per page
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           example: apartment
 *         description: Search text for matching property fields
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: Dhaka
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
