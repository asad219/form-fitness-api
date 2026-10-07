/**
 * @swagger
 * components:
 *   schemas:
 *     MembershipPlan:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           enum: [ACTIVE, VIP]
 *         name:
 *           type: string
 *           example: FORM Active
 *         description:
 *           type: string
 *         prices:
 *           type: object
 *           properties:
 *             MONTHLY:
 *               type: number
 *               example: 99
 *             YEARLY:
 *               type: number
 *               example: 990
 *         perks:
 *           type: array
 *           items:
 *             type: string
 *     Membership:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           description: User id; a populated OrderUserSummary on admin endpoints
 *           oneOf:
 *             - type: string
 *             - $ref: '#/components/schemas/OrderUserSummary'
 *         plan:
 *           type: string
 *           enum: [ACTIVE, VIP]
 *         billingCycle:
 *           type: string
 *           enum: [MONTHLY, YEARLY]
 *         price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, EXPIRED]
 *           description: CANCELLED keeps access until endDate; EXPIRED once endDate has passed
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         cancelledAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         paymentDetails:
 *           $ref: '#/components/schemas/PaymentDetails'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MembershipSubscribeRequest:
 *       type: object
 *       required: [plan]
 *       properties:
 *         plan:
 *           type: string
 *           enum: [ACTIVE, VIP]
 *         billingCycle:
 *           type: string
 *           enum: [MONTHLY, YEARLY]
 *           default: MONTHLY
 *         paymentDetails:
 *           $ref: '#/components/schemas/PaymentDetailsInput'
 *     MembershipResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         membership:
 *           $ref: '#/components/schemas/Membership'
 */

/**
 * @swagger
 * /memberships/plans:
 *   get:
 *     summary: List membership plans
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: Available plans and prices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 plans:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MembershipPlan'
 *
 * /memberships/me:
 *   get:
 *     summary: Get my current membership and history
 *     description: membership is the live one (ACTIVE, or CANCELLED with access until endDate), or null.
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current membership and history (newest first)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 membership:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Membership'
 *                   nullable: true
 *                 history:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Membership'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /memberships/subscribe:
 *   post:
 *     summary: Subscribe to a membership plan
 *     description: >
 *       Starts a membership now for one month (MONTHLY) or twelve months (YEARLY) and sets the
 *       user's membershipStatus to the plan code. No payment gateway yet; payment details are
 *       recorded as on checkout. Fails with 409 while another membership is still live.
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MembershipSubscribeRequest'
 *     responses:
 *       201:
 *         description: Membership activated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: The user already has a live membership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /memberships/me/cancel:
 *   post:
 *     summary: Cancel my membership
 *     description: Sets status to CANCELLED. Access and membershipStatus continue until endDate.
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Membership cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipResponse'
 *       400:
 *         description: Membership is already cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         description: No live membership
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /admin/memberships:
 *   get:
 *     summary: List all memberships (admin only, newest first)
 *     tags: [Admin Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, CANCELLED, EXPIRED]
 *       - in: query
 *         name: plan
 *         schema:
 *           type: string
 *           enum: [ACTIVE, VIP]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *     responses:
 *       200:
 *         description: Paginated memberships with the user populated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 memberships:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Membership'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /admin/memberships/{id}:
 *   get:
 *     summary: Get any membership (admin only)
 *     tags: [Admin Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Membership with the user populated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 membership:
 *                   $ref: '#/components/schemas/Membership'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
