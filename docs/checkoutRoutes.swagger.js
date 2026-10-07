/**
 * @swagger
 * components:
 *   schemas:
 *     CheckoutResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Order completed successfully
 *         order:
 *           $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /checkout/process:
 *   post:
 *     summary: Complete checkout
 *     description: Atomic transaction - increments booked spots, decrements stock, creates the order and clears the cart. No payment gateway yet; the order is marked PAID.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentDetails:
 *                 $ref: '#/components/schemas/PaymentDetailsInput'
 *     responses:
 *       201:
 *         description: Order completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Insufficient capacity or stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /checkout/orders/{id}:
 *   get:
 *     summary: Get order confirmation
 *     description: Same as GET /orders/{id}; kept for existing clients.
 *     tags: [Checkout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
