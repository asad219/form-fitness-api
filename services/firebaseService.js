const path = require('path');
const admin = require('firebase-admin');
const config = require('../config');
const logger = require('../config/logger');

let firebaseApp = null;

// Initialized lazily so the server still boots when social login is not configured yet
const getFirebaseApp = () => {
  if (firebaseApp) return firebaseApp;

  const { serviceAccountPath, projectId, clientEmail, privateKey } = config.firebase;

  let credential = null;
  if (serviceAccountPath) {
    try {
      // JSON key file downloaded from the Firebase console
      credential = admin.credential.cert(require(path.resolve(serviceAccountPath)));
    } catch (error) {
      logger.error('Failed to load Firebase service account file', {
        serviceAccountPath,
        error: error.message,
      });
      return null;
    }
  } else if (projectId && clientEmail && privateKey) {
    credential = admin.credential.cert({ projectId, clientEmail, privateKey });
  }

  if (!credential) return null;

  firebaseApp = admin.initializeApp({ credential });
  logger.info('Firebase Admin SDK initialized');
  return firebaseApp;
};

const isFirebaseConfigured = () => getFirebaseApp() !== null;

/**
 * Verify a Firebase ID token sent by the client.
 *
 * @param {string} idToken
 * @returns {Promise<object|null>} decoded token, or null when invalid/expired
 */
const verifyFirebaseIdToken = async (idToken) => {
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    return await admin.auth(app).verifyIdToken(idToken);
  } catch (error) {
    logger.warn('Firebase ID token verification failed', { error: error.message });
    return null;
  }
};

module.exports = {
  isFirebaseConfigured,
  verifyFirebaseIdToken,
};
