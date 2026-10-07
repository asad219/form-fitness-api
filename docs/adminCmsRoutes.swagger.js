/**
 * @swagger
 * components:
 *   parameters:
 *     cmsIsActive:
 *       in: query
 *       name: isActive
 *       schema:
 *         type: string
 *         enum: ['true', 'false']
 *     cmsSearch:
 *       in: query
 *       name: search
 *       schema:
 *         type: string
 *         maxLength: 80
 *   schemas:
 *     BannerInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
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
 *           default: HOME_HERO
 *         ctaText:
 *           type: string
 *           maxLength: 40
 *           default: Explore
 *         targetRoute:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         targetParams:
 *           type: object
 *           additionalProperties: true
 *         sortOrder:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         isActive:
 *           type: boolean
 *           default: true
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     PopupInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 120
 *         contentHtml:
 *           type: string
 *           minLength: 1
 *           maxLength: 5000
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
 *           default: true
 *         isActive:
 *           type: boolean
 *           default: false
 *           description: Setting this to true deactivates every other popup
 *         maxDisplayCount:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     AnnouncementInput:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           minLength: 1
 *           maxLength: 280
 *         level:
 *           type: string
 *           enum: [INFO, WARNING, PROMO, ALERT]
 *           default: INFO
 *         targetRoute:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           nullable: true
 *         targetParams:
 *           type: object
 *           additionalProperties: true
 *         isActive:
 *           type: boolean
 *           default: true
 *         sortOrder:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         startDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         endDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CmsDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: Banner deleted successfully
 */

/**
 * @swagger
 * /admin/cms/banners:
 *   get:
 *     summary: List banners (admin only)
 *     description: Sorted by sortOrder, then newest first. Search matches the title.
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/cmsIsActive'
 *       - $ref: '#/components/parameters/cmsSearch'
 *       - in: query
 *         name: placement
 *         schema:
 *           type: string
 *           enum: [HOME_HERO, SHOP_PROMO, TRAIN_PROMO]
 *     responses:
 *       200:
 *         description: Paginated banners
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
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create banner (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BannerInput'
 *               - required: [title, imageUrl, targetRoute]
 *     responses:
 *       201:
 *         description: Banner created
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
 *                   example: Banner created successfully
 *                 banner:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /admin/cms/banners/{id}:
 *   get:
 *     summary: Get banner (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Banner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 banner:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update banner (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       description: Any subset of banner fields; at least one is required
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/BannerInput'
 *               - minProperties: 1
 *     responses:
 *       200:
 *         description: Banner updated
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
 *                   example: Banner updated successfully
 *                 banner:
 *                   $ref: '#/components/schemas/Banner'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete banner (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Banner deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CmsDeleteResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/cms/popups:
 *   get:
 *     summary: List popups (admin only)
 *     description: Sorted by sortOrder, then newest first. Search matches the title.
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/cmsIsActive'
 *       - $ref: '#/components/parameters/cmsSearch'
 *     responses:
 *       200:
 *         description: Paginated popups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 popups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Popup'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create popup (admin only, activating it deactivates the others)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/PopupInput'
 *               - required: [title, contentHtml]
 *     responses:
 *       201:
 *         description: Popup created
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
 *                   example: Popup created successfully
 *                 popup:
 *                   $ref: '#/components/schemas/Popup'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /admin/cms/popups/{id}:
 *   get:
 *     summary: Get popup (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Popup
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 popup:
 *                   $ref: '#/components/schemas/Popup'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update popup (admin only, activating it deactivates the others)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       description: Any subset of popup fields; at least one is required
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/PopupInput'
 *               - minProperties: 1
 *     responses:
 *       200:
 *         description: Popup updated
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
 *                   example: Popup updated successfully
 *                 popup:
 *                   $ref: '#/components/schemas/Popup'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete popup (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Popup deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CmsDeleteResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /admin/cms/announcements:
 *   get:
 *     summary: List announcements (admin only)
 *     description: Sorted by sortOrder, then newest first. Search matches the message.
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *       - $ref: '#/components/parameters/cmsIsActive'
 *       - $ref: '#/components/parameters/cmsSearch'
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [INFO, WARNING, PROMO, ALERT]
 *     responses:
 *       200:
 *         description: Paginated announcements
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
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *   post:
 *     summary: Create announcement (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AnnouncementInput'
 *               - required: [message]
 *     responses:
 *       201:
 *         description: Announcement created
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
 *                   example: Announcement created successfully
 *                 announcement:
 *                   $ref: '#/components/schemas/Announcement'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *
 * /admin/cms/announcements/{id}:
 *   get:
 *     summary: Get announcement (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Announcement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 announcement:
 *                   $ref: '#/components/schemas/Announcement'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update announcement (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     requestBody:
 *       required: true
 *       description: Any subset of announcement fields; at least one is required
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/AnnouncementInput'
 *               - minProperties: 1
 *     responses:
 *       200:
 *         description: Announcement updated
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
 *                   example: Announcement updated successfully
 *                 announcement:
 *                   $ref: '#/components/schemas/Announcement'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete announcement (admin only)
 *     tags: [Admin CMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdPath'
 *     responses:
 *       200:
 *         description: Announcement deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CmsDeleteResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
