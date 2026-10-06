/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingClass:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         category:
 *           type: string
 *           enum: [GROUP_CLASS, PERSONAL_TRAINING, COACHING]
 *         price:
 *           type: number
 *         coachName:
 *           type: string
 *     ClassSession:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         classId:
 *           $ref: '#/components/schemas/TrainingClass'
 *         date:
 *           type: string
 *         startTime:
 *           type: string
 *         availableSpots:
 *           type: number
 */

/**
 * @swagger
 * /train/classes:
 *   get:
 *     summary: List all training classes
 *     tags: [Train]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of classes
 */

/**
 * @swagger
 * /train/classes/{id}:
 *   get:
 *     summary: Get class detail with sessions
 *     tags: [Train]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /train/sessions:
 *   get:
 *     summary: Get daily schedule
 *     tags: [Train]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Sessions for date
 */
