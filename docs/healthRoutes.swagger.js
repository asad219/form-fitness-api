/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [healthy, unhealthy]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         environment:
 *           type: string
 *         version:
 *           type: string
 *         database:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [connected, disconnected]
 *             readyState:
 *               type: integer
 *             name:
 *               type: string
 *         uptime:
 *           type: number
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Server health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       503:
 *         description: Server is unhealthy
 */
