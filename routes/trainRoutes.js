const express = require('express');
const {
  getTrainingClasses,
  getTrainingClassById,
  getSessionsByDate,
} = require('../controllers/trainController');
const { validateObjectId } = require('../middleware/validationObjectIdHandler');

const router = express.Router();

// GET /api/v1/train/classes?category=GROUP_CLASS
router.get('/classes', getTrainingClasses);

// GET /api/v1/train/sessions?date=YYYY-MM-DD
router.get('/sessions', getSessionsByDate);

// GET /api/v1/train/classes/:id
router.get('/classes/:id', validateObjectId, getTrainingClassById);

module.exports = router;
