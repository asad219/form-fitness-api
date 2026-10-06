const { z } = require('zod');

const CLASS_CATEGORIES = ['GROUP_CLASS', 'PERSONAL_TRAINING', 'COACHING'];

const classListQuerySchema = z.object({
  category: z.enum(CLASS_CATEGORIES).optional(),
});

const sessionScheduleQuerySchema = z.object({
  date: z
    .string({ error: 'Date is required' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

const parseClassListQuery = (query) => classListQuerySchema.parse(query);
const parseSessionScheduleQuery = (query) => sessionScheduleQuerySchema.parse(query);

module.exports = {
  CLASS_CATEGORIES,
  classListQuerySchema,
  sessionScheduleQuerySchema,
  parseClassListQuery,
  parseSessionScheduleQuery,
};
