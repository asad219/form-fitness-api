const { z } = require('zod');

const firebaseLoginSchema = z.object({
  idToken: z
    .string({ error: 'Firebase ID token is required' })
    .min(1, 'Firebase ID token is required'),
});

const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ error: 'Refresh token is required' })
    .min(1, 'Refresh token is required'),
});

const parseFirebaseLogin = (data) => firebaseLoginSchema.parse(data);
const parseRefreshToken = (data) => refreshTokenSchema.parse(data);

module.exports = {
  firebaseLoginSchema,
  refreshTokenSchema,
  parseFirebaseLogin,
  parseRefreshToken,
};
