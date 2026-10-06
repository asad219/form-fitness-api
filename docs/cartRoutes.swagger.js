/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         serviceItems:
 *           type: array
 *           items:
 *             type: object
 *         productItems:
 *           type: array
 *           items:
 *             type: object
 *         total:
 *           type: number
 *     AddServiceItemRequest:
 *       type: object
 *       required: [sessionId]
 *       properties:
 *         sessionId:
 *           type: string
 *         attendeesCount:
 *           type: number
 *     AddProductItemRequest:
 *       type: object
 *       required: [productId]
 *       properties:
 *         productId:
 *           type: string
 *         quantity:
 *           type: number
 *         selectedColor:
 *           type: string
 *         selectedSize:
 *           type: string
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current cart
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /cart/service-items:
 *   post:
 *     summary: Add class session to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddServiceItemRequest'
 *     responses:
 *       201:
 *         description: Added to cart
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /cart/product-items:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddProductItemRequest'
 *     responses:
 *       201:
 *         description: Added to cart
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
