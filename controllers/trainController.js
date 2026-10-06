const asyncHandler = require('express-async-handler');
const { TrainingClass } = require('../models/trainingClassModel');
const { ClassSession } = require('../models/classSessionModel');
const { parseClassListQuery, parseSessionScheduleQuery } = require('../validators/train.zod');
const { convertDateOnlyToDate } = require('../utils/dateTimeUtils');

const getTrainingClasses = asyncHandler(async (req, res) => {
  const { category } = parseClassListQuery(req.query);

  const filter = category ? { category } : {};
  const classes = await TrainingClass.find(filter).sort({ title: 1 });

  res.status(200).json({
    success: true,
    count: classes.length,
    classes,
  });
});

const getTrainingClassById = asyncHandler(async (req, res) => {
  const trainingClass = await TrainingClass.findById(req.params.id);

  if (!trainingClass) {
    res.status(404);
    throw new Error('Class not found');
  }

  // Only upcoming, non-cancelled sessions are bookable
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const upcomingSessions = await ClassSession.find({
    classId: trainingClass._id,
    date: { $gte: startOfToday },
    status: { $ne: 'CANCELLED' },
  }).sort({ date: 1, startTime: 1 });

  res.status(200).json({
    success: true,
    class: trainingClass,
    upcomingSessions,
  });
});

const getSessionsByDate = asyncHandler(async (req, res) => {
  const { date } = parseSessionScheduleQuery(req.query);

  const sessionDate = convertDateOnlyToDate(date);
  if (!sessionDate) {
    res.status(400);
    throw new Error('Date must be in YYYY-MM-DD format');
  }

  const sessions = await ClassSession.find({ date: sessionDate, status: { $ne: 'CANCELLED' } })
    .populate('classId')
    .sort({ startTime: 1 });

  res.status(200).json({
    success: true,
    date,
    count: sessions.length,
    sessions,
  });
});

module.exports = {
  getTrainingClasses,
  getTrainingClassById,
  getSessionsByDate,
};
