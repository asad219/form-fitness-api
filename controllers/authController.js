const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');
const { Cart } = require('../models/cartModel');
const { parseFirebaseLogin, parseRefreshToken } = require('../validators/auth.zod');
const { isFirebaseConfigured, verifyFirebaseIdToken } = require('../services/firebaseService');
const { sanitizeUserResponse } = require('../utils/userUtils');
const { isTokenRevoked } = require('../utils/tokenRevocation');
const { TOKEN_AUDIENCE } = require('../utils/otpUtils');
const config = require('../config');

// Firebase `sign_in_provider` claim -> our authProvider values
const PROVIDER_MAP = {
  'google.com': 'GOOGLE',
  'apple.com': 'APPLE',
  'facebook.com': 'FACEBOOK',
};

const signAccessToken = (user) =>
  jwt.sign({ userId: user._id.toString(), email: user.email, role: user.role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    algorithm: 'HS256',
    audience: TOKEN_AUDIENCE.ACCESS,
  });

const signRefreshToken = (user) =>
  jwt.sign({ userId: user._id.toString() }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    algorithm: 'HS256',
    audience: TOKEN_AUDIENCE.REFRESH,
  });

// Split a display name like "Jane Mary Doe" into firstName/lastName
const splitDisplayName = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts.shift() || undefined,
    lastName: parts.join(' ') || undefined,
  };
};

// Find the account by email, or create one for the social provider
const provisionSocialUser = async ({ email, provider, decoded }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    // Link the Firebase UID the first time an existing account signs in socially
    if (!existing.firebaseUid && decoded.uid) {
      existing.firebaseUid = decoded.uid;
      await existing.save();
    }
    return existing;
  }

  try {
    return await User.create({
      email,
      ...splitDisplayName(decoded.name),
      profilePicUrl: decoded.picture || undefined,
      authProvider: provider,
      firebaseUid: decoded.uid || undefined,
      // The provider already verified this email
      isVerified: true,
    });
  } catch (error) {
    // A parallel request may have created the user first (unique email index)
    if (error.code === 11000) {
      return User.findOne({ email });
    }
    throw error;
  }
};

const firebaseLogin = asyncHandler(async (req, res) => {
  const { idToken } = parseFirebaseLogin(req.body);

  if (!isFirebaseConfigured()) {
    res.status(503);
    throw new Error('Social login is not configured on this server');
  }

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    res.status(401);
    throw new Error('Invalid or expired Firebase token');
  }

  const provider = PROVIDER_MAP[decoded.firebase?.sign_in_provider];
  if (!provider) {
    res.status(400);
    throw new Error('Unsupported sign-in provider');
  }

  const email = decoded.email && decoded.email.toLowerCase();
  if (!email) {
    res.status(400);
    throw new Error('Firebase account has no email address; cannot sign in');
  }

  const user = await provisionSocialUser({ email, provider, decoded });

  // Every user gets exactly one cart; create it on first login
  await Cart.findOneAndUpdate(
    { userId: user._id },
    { $setOnInsert: { userId: user._id } },
    { upsert: true }
  );

  res.status(200).json({
    message: 'Login successful',
    token: signAccessToken(user),
    refreshToken: signRefreshToken(user),
    expiresIn: config.jwt.expiresIn,
    user: sanitizeUserResponse(user),
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = parseRefreshToken(req.body);

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret, {
      algorithms: ['HS256'],
      audience: TOKEN_AUDIENCE.REFRESH,
    });
  } catch {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  if (await isTokenRevoked(refreshToken)) {
    res.status(401);
    throw new Error('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    res.status(401);
    throw new Error('User no longer exists');
  }

  res.status(200).json({
    message: 'Token refreshed successfully',
    token: signAccessToken(user),
    expiresIn: config.jwt.expiresIn,
  });
});

module.exports = {
  firebaseLogin,
  refreshAccessToken,
};
