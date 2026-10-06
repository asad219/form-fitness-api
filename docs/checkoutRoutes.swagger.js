/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderNumber:
 *           type: string
 *         paymentStatus:
 *           type: string
 *         totalPaid:
 *           type: number
 *     CheckoutResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         order:
 *           $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /checkout/process:
 *   post:
 *     summary: Complete checkout
 *     description: Atomic transaction - increments booked spots, decrements stock, creates order
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Insufficient capacity or stock
 */

/**
 * @swagger
 * /checkout/orders/{id}:
 *   get:
 *     summary: Get order confirmation
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
