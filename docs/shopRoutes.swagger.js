/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         subtitle:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           enum: [APPAREL, EQUIPMENT, RECOVERY]
 *         badge:
 *           type: string
 *           enum: [BESTSELLER, NEW, TRAINING, NONE]
 *         price:
 *           type: number
 *           minimum: 0
 *         rating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         reviewCount:
 *           type: integer
 *           minimum: 0
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         options:
 *           type: object
 *           properties:
 *             colors:
 *               type: array
 *               items:
 *                 type: string
 *             sizes:
 *               type: array
 *               items:
 *                 type: string
 *             volume:
 *               type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         stockQuantity:
 *           type: integer
 *           minimum: 0
 *         isPickupAvailable:
 *           type: boolean
 *         pickupLocation:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /shop/products:
 *   get:
 *     summary: List products with filters (paginated, sorted by name)
 *     tags: [Shop]
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [APPAREL, EQUIPMENT, RECOVERY]
 *       - in: query
 *         name: search
 *         description: Case-insensitive match on name, subtitle or description
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *     responses:
 *       200:
 *         description: Paginated list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */

/**
 * @swagger
 * /shop/products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags: [Shop]
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
