/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         category:
 *           type: string
 *           enum: [APPAREL, EQUIPMENT, RECOVERY]
 *         price:
 *           type: number
 *         stockQuantity:
 *           type: number
 */

/**
 * @swagger
 * /shop/products:
 *   get:
 *     summary: List products with filters
 *     tags: [Shop]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /shop/products/{id}:
 *   get:
 *     summary: Get product detail
 *     tags: [Shop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
