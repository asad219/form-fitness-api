/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           maxLength: 120
 *         subtitle:
 *           type: string
 *           maxLength: 200
 *         imageUrl:
 *           type: string
 *           format: uri
 *         placement:
 *           type: string
 *           enum: [HOME_HERO, SHOP_PROMO, TRAIN_PROMO]
 *         ctaText:
 *           type: string
 *           example: Explore
 *         targetRoute:
 *           type: string
 *           example: /shop/products
 *         targetParams:
 *           type: object
 *           additionalProperties: true
 *         sortOrder:
 *           type: integer
 *           minimum: 0
 *         isActive:
 *           type: boolean
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PopupActionButton:
 *       type: object
 *       required: [label, targetRoute]
 *       properties:
 *         label:
 *           type: string
 *           maxLength: 40
 *         targetRoute:
 *           type: string
 *           maxLength: 200
 *         targetParams:
 *           type: object
 *           additionalProperties: true
 *     Popup:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           maxLength: 120
 *         contentHtml:
 *           type: string
 *           description: Rendered as HTML by the client
 *         imageUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *         actionButton:
 *           allOf:
 *             - $ref: '#/components/schemas/PopupActionButton'
 *           nullable: true
 *         dismissible:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         maxDisplayCount:
 *           type: integer
 *           minimum: 1
 *           description: How many times a single client may see this popup
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Announcement:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         message:
 *           type: string
 *           maxLength: 280
 *         level:
 *           type: string
 *           enum: [INFO, WARNING, PROMO, ALERT]
 *         targetRoute:
 *           type: string
 *           nullable: true
 *         targetParams:
 *           type: object
 *           additionalProperties: true
 *         isActive:
 *           type: boolean
 *         sortOrder:
 *           type: integer
 *           minimum: 0
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /app-config:
 *   get:
 *     summary: Active hero banners, promo banners, announcements and popup
 *     description: Only records that are active and inside their startDate/endDate window are returned.
 *     tags: [CMS]
 *     responses:
 *       200:
 *         description: App configuration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 heroBanners:
 *                   type: array
 *                   description: HOME_HERO banners sorted by sortOrder
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *                 promoBanners:
 *                   type: array
 *                   description: SHOP_PROMO and TRAIN_PROMO banners sorted by placement, then sortOrder
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 *                 announcements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 *                 popup:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Popup'
 *                   nullable: true
 */

/**
 * @swagger
 * /banners:
 *   get:
 *     summary: List active banners
 *     description: Active banners inside their display window, sorted by sortOrder then newest first.
 *     tags: [CMS]
 *     responses:
 *       200:
 *         description: Active banners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 banners:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banner'
 */

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: List active announcements
 *     description: Active announcements inside their display window, sorted by sortOrder then newest first.
 *     tags: [CMS]
 *     responses:
 *       200:
 *         description: Active announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 announcements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Announcement'
 */

/**
 * @swagger
 * /popups/active:
 *   get:
 *     summary: Get the active popup (or null)
 *     tags: [CMS]
 *     responses:
 *       200:
 *         description: Active popup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 popup:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Popup'
 *                   nullable: true
 */
