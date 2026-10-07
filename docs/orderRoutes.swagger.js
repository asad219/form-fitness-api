/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentDetailsInput:
 *       type: object
 *       description: Optional; defaults to the user's default saved card and account email
 *       properties:
 *         method:
 *           type: string
 *           maxLength: 100
 *           example: Visa •••• 4242
 *         billingEmail:
 *           type: string
 *           format: email
 *     PaymentDetails:
 *       type: object
 *       properties:
 *         method:
 *           type: string
 *           example: Visa •••• 4242
 *         billingEmail:
 *           type: string
 *           format: email
 *         transactionId:
 *           type: string
 *           example: txn_6f1c2b9e-4a7d-4a52-9d1e-1f0c8f3b2a11
 *     OrderUserSummary:
 *       type: object
 *       description: Populated user on admin endpoints
 *       properties:
 *         _id:
 *           type: string
 *         email:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         membershipStatus:
 *           type: string
 *           enum: [NONE, ACTIVE, VIP]
 *     BookedClass:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Booking id, used to cancel the booking
 *         classId:
 *           type: string
 *         sessionId:
 *           type: string
 *         className:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *           description: Session date (midnight UTC)
 *         timeSlot:
 *           type: string
 *           example: 07:00 AM - 07:45 AM
 *         location:
 *           type: string
 *         coachName:
 *           type: string
 *         attendeesCount:
 *           type: integer
 *           minimum: 1
 *         price:
 *           type: number
 *           description: Line total (unit price x attendees)
 *         entryPassToken:
 *           type: string
 *           description: Render as a QR code for club entry
 *         bookingStatus:
 *           type: string
 *           enum: [CONFIRMED, CANCELLED, ATTENDED]
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     PurchasedProduct:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         productId:
 *           type: string
 *         name:
 *           type: string
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *           description: Unit price
 *         selectedColor:
 *           type: string
 *         selectedSize:
 *           type: string
 *         fulfillmentMethod:
 *           type: string
 *           enum: [CLUB_PICKUP, SHIP_TO_ME]
 *         fulfillmentStatus:
 *           type: string
 *           enum: [READY_FOR_PICKUP, SHIPPED, DELIVERED, COMPLETED]
 *         pickupLocation:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         orderNumber:
 *           type: string
 *           example: FRM-48213
 *         userId:
 *           description: User id; a populated OrderUserSummary on admin endpoints
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/OrderUserSummary'
 *         paymentStatus:
 *           type: string
 *           enum: [PAID, PENDING, FAILED, REFUNDED]
 *         paymentDetails:
 *           $ref: '#/components/schemas/PaymentDetails'
 *         bookedClasses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookedClass'
 *         purchasedProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PurchasedProduct'
 *         subtotal:
 *           type: number
 *         shippingFee:
 *           type: number
 *         tax:
 *           type: number
 *         totalPaid:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         order:
 *           $ref: '#/components/schemas/Order'
 *     OrderListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *   parameters:
 *     PaymentStatusQuery:
 *       in: query
 *       name: paymentStatus
 *       schema:
 *         type: string
 *         enum: [PAID, PENDING, FAILED, REFUNDED]
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List my orders (newest first)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/PaymentStatusQuery'
 *     responses:
 *       200:
 *         description: Paginated orders of the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /orders/{id}:
 *   get:
 *     summary: Get one of my orders (owner or admin)
 *     tags: [Orders]
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
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *
 * /orders/{id}/bookings/{bookingId}/cancel:
 *   post:
 *     summary: Cancel a booked class (owner or admin)
 *     description: >
 *       Only CONFIRMED bookings can be cancelled, and only up to the class's
 *       cancellationWindowHours before it starts (times are in the club timezone,
 *       CLUB_TIMEZONE). Frees the booked spots and reopens a FULL session.
 *       No refund is issued; paymentStatus is unchanged.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *       - in: path
 *         name: bookingId
 *         required: true
 *         description: bookedClasses[]._id
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Booking cancelled; returns the updated order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Booking cancelled successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid id, booking not CONFIRMED, or the cancellation window has passed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: List all orders (admin only, newest first)
 *     tags: [Admin Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/PaymentStatusQuery'
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *       - in: query
 *         name: orderNumber
 *         description: Exact match, case-insensitive
 *         schema:
 *           type: string
 *           example: FRM-48213
 *       - in: query
 *         name: from
 *         description: Created on or after this date (UTC)
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-10-01'
 *       - in: query
 *         name: to
 *         description: Created on or before this date (UTC, inclusive)
 *         schema:
 *           type: string
 *           format: date
 *           example: '2026-10-31'
 *     responses:
 *       200:
 *         description: Paginated orders with the user populated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderListResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /admin/orders/{id}:
 *   get:
 *     summary: Get any order (admin only)
 *     tags: [Admin Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Order with the user populated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
