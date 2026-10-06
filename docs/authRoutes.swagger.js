/**
 * @swagger
 * components:
 *   schemas:
 *     FirebaseLoginRequest:
 *       type: object
 *       required: [idToken]
 *       properties:
 *         idToken:
 *           type: string
 *           description: Firebase ID token from Flutter client
 *     FirebaseLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Login successful
 *         token:
 *           type: string
 *         refreshToken:
 *           type: string
 *         expiresIn:
 *           type: string
 *           example: 24h
 *         user:
 *           $ref: '#/components/schemas/User'
 *     RefreshTokenRequest:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *     RefreshAccessTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         expiresIn:
 *           type: string
 */

/**
 * @swagger
 * /auth/firebase-login:
 *   post:
 *     summary: Sign in with Firebase social provider (Google, Apple, Facebook)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FirebaseLoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FirebaseLoginResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid or expired Firebase token
 *       429:
 *         $ref: '#/components/responses/TooManyRequests'
 *       503:
 *         description: Social login not configured
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Exchange refresh token for new access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshAccessTokenResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         description: Invalid or expired refresh token
 */
