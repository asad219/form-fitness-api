/**
 * Seed mock data into MongoDB (idempotent — safe to re-run).
 * Usage: npm run db:seed
 */
const mongoose = require('mongoose');
const connectDb = require('../config/dbConnection');
const { TrainingClass } = require('../models/trainingClassModel');
const { ClassSession } = require('../models/classSessionModel');
const { Product } = require('../models/productModel');
const logger = require('../config/logger');

const oid = (hex) => new mongoose.Types.ObjectId(hex);

const TRAINING_CLASSES = [
  {
    _id: oid('670a1b2c3d4e5f6a7b8c0001'),
    title: 'Strength Circuit',
    description:
      'Full-body strength training combining compound lifts and functional movements. Build power, stability, and endurance in a high-energy group setting.',
    category: 'GROUP_CLASS',
    durationMinutes: 45,
    level: 'All levels',
    coachName: 'Coach Maya',
    price: 28,
    rating: 4.9,
    reviewCount: 132,
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    includedInMembership: true,
    cancellationWindowHours: 12,
  },
  {
    _id: oid('670a1b2c3d4e5f6a7b8c0002'),
    title: 'HIIT Burn',
    description:
      'High-intensity interval training designed to maximize calorie burn and boost metabolism. Short bursts of maximum effort followed by brief recovery.',
    category: 'GROUP_CLASS',
    durationMinutes: 30,
    level: 'Intermediate',
    coachName: 'Coach Deon',
    price: 24,
    rating: 4.8,
    reviewCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
    includedInMembership: true,
    cancellationWindowHours: 12,
  },
  {
    _id: oid('670a1b2c3d4e5f6a7b8c0003'),
    title: '1-on-1 Personal Training',
    description:
      'Fully personalized training session tailored to your goals — strength, fat loss, mobility, or competition prep. Includes movement assessment and progress tracking.',
    category: 'PERSONAL_TRAINING',
    durationMinutes: 60,
    level: 'All levels',
    coachName: 'Coach Maya',
    price: 85,
    rating: 5.0,
    reviewCount: 214,
    imageUrl: 'https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb',
    includedInMembership: false,
    cancellationWindowHours: 24,
  },
  {
    _id: oid('670a1b2c3d4e5f6a7b8c0004'),
    title: 'Nutrition Coaching',
    description:
      'Monthly coaching program with personalized macros, habit tracking, and weekly check-ins to support your training and recovery goals.',
    category: 'COACHING',
    durationMinutes: 30,
    level: 'All levels',
    coachName: 'Coach Lena',
    price: 60,
    rating: 4.9,
    reviewCount: 67,
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
    includedInMembership: false,
    cancellationWindowHours: 24,
  },
  {
    _id: oid('670a1b2c3d4e5f6a7b8c0005'),
    title: 'Mobility & Recovery Flow',
    description:
      'Guided mobility work, deep stretching, and breathwork to improve range of motion and accelerate recovery between hard training days.',
    category: 'GROUP_CLASS',
    durationMinutes: 40,
    level: 'All levels',
    coachName: 'Coach Lena',
    price: 22,
    rating: 4.7,
    reviewCount: 54,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    includedInMembership: true,
    cancellationWindowHours: 6,
  },
];

const CLASS_SESSIONS = [
  {
    _id: oid('670b2c3d4e5f6a7b8c9d0001'),
    classId: oid('670a1b2c3d4e5f6a7b8c0001'),
    location: 'Brooklyn club, Studio 01',
    date: new Date('2026-10-08T00:00:00.000Z'),
    startTime: '07:00 AM',
    endTime: '07:45 AM',
    totalSpots: 20,
    bookedSpots: 6,
    status: 'OPEN',
  },
  {
    _id: oid('670b2c3d4e5f6a7b8c9d0002'),
    classId: oid('670a1b2c3d4e5f6a7b8c0001'),
    location: 'Brooklyn club, Studio 01',
    date: new Date('2026-10-08T00:00:00.000Z'),
    startTime: '06:00 PM',
    endTime: '06:45 PM',
    totalSpots: 20,
    bookedSpots: 20,
    status: 'FULL',
  },
  {
    _id: oid('670b2c3d4e5f6a7b8c9d0003'),
    classId: oid('670a1b2c3d4e5f6a7b8c0002'),
    location: 'Brooklyn club, Studio 02',
    date: new Date('2026-10-08T00:00:00.000Z'),
    startTime: '12:15 PM',
    endTime: '12:45 PM',
    totalSpots: 16,
    bookedSpots: 9,
    status: 'OPEN',
  },
  {
    _id: oid('670b2c3d4e5f6a7b8c9d0004'),
    classId: oid('670a1b2c3d4e5f6a7b8c0003'),
    location: 'Brooklyn club, PT Zone',
    date: new Date('2026-10-09T00:00:00.000Z'),
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    totalSpots: 1,
    bookedSpots: 0,
    status: 'OPEN',
  },
  {
    _id: oid('670b2c3d4e5f6a7b8c9d0005'),
    classId: oid('670a1b2c3d4e5f6a7b8c0005'),
    location: 'Brooklyn club, Studio 02',
    date: new Date('2026-10-09T00:00:00.000Z'),
    startTime: '08:00 PM',
    endTime: '08:40 PM',
    totalSpots: 14,
    bookedSpots: 3,
    status: 'OPEN',
  },
  {
    _id: oid('670b2c3d4e5f6a7b8c9d0006'),
    classId: oid('670a1b2c3d4e5f6a7b8c0004'),
    location: 'Brooklyn club, Coaching Room',
    date: new Date('2026-10-10T00:00:00.000Z'),
    startTime: '05:30 PM',
    endTime: '06:00 PM',
    totalSpots: 8,
    bookedSpots: 2,
    status: 'OPEN',
  },
];

const PRODUCTS = [
  {
    _id: oid('670c3d4e5f6a7b8c9d0e0001'),
    name: 'FORM Bottle',
    subtitle: 'Charcoal · 750 ml',
    description:
      'Insulated stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. Matte finish with the FORM wordmark.',
    category: 'EQUIPMENT',
    badge: 'BESTSELLER',
    price: 32,
    rating: 4.9,
    reviewCount: 412,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504',
    ],
    options: {
      colors: ['#1E1E1E', '#D9DDD5', '#D8C7B5'],
      sizes: [],
      volume: '750 ml',
    },
    features: ['Leakproof', 'BPA-free', '24h cold / 12h hot', '30-day returns'],
    stockQuantity: 48,
    isPickupAvailable: true,
    pickupLocation: 'Brooklyn club front desk',
  },
  {
    _id: oid('670c3d4e5f6a7b8c9d0e0002'),
    name: 'FORM Training Tee',
    subtitle: 'Black · Unisex',
    description:
      'Lightweight, sweat-wicking training tee with four-way stretch. Cut for movement with a slightly relaxed fit.',
    category: 'APPAREL',
    badge: 'NEW',
    price: 38,
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    ],
    options: {
      colors: ['#1E1E1E', '#F5F5F0', '#4A5240'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    },
    features: ['Sweat-wicking', 'Four-way stretch', 'Machine washable'],
    stockQuantity: 120,
    isPickupAvailable: true,
    pickupLocation: 'Brooklyn club front desk',
  },
  {
    _id: oid('670c3d4e5f6a7b8c9d0e0003'),
    name: 'FORM Hoodie',
    subtitle: 'Bone · Heavyweight',
    description:
      '480gsm heavyweight fleece hoodie with a boxy fit and embroidered FORM logo. Built for cold Brooklyn mornings.',
    category: 'APPAREL',
    badge: 'TRAINING',
    price: 88,
    rating: 5.0,
    reviewCount: 89,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7'],
    options: {
      colors: ['#D9DDD5', '#1E1E1E'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    features: ['480gsm heavyweight fleece', 'Embroidered logo', 'Kangaroo pocket'],
    stockQuantity: 35,
    isPickupAvailable: true,
    pickupLocation: 'Brooklyn club front desk',
  },
  {
    _id: oid('670c3d4e5f6a7b8c9d0e0004'),
    name: 'FORM Resistance Band Set',
    subtitle: 'Set of 4 · Light to Heavy',
    description:
      'Four loop bands covering light to heavy resistance for warm-ups, mobility work, and accessory lifts. Includes carry pouch.',
    category: 'EQUIPMENT',
    badge: 'NONE',
    price: 42,
    rating: 4.6,
    reviewCount: 73,
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc'],
    options: {
      colors: ['#1E1E1E'],
      sizes: [],
    },
    features: ['4 resistance levels', 'Carry pouch included', 'Snap-resistant latex'],
    stockQuantity: 64,
    isPickupAvailable: true,
    pickupLocation: 'Brooklyn club front desk',
  },
  {
    _id: oid('670c3d4e5f6a7b8c9d0e0005'),
    name: 'FORM Recovery Roller',
    subtitle: '45 cm · High-density',
    description:
      'High-density foam roller for post-training muscle release. Textured surface targets knots without bruising.',
    category: 'RECOVERY',
    badge: 'BESTSELLER',
    price: 36,
    rating: 4.7,
    reviewCount: 201,
    images: ['https://images.unsplash.com/photo-1600881333168-2ef49b341f30'],
    options: {
      colors: ['#1E1E1E'],
      sizes: [],
    },
    features: ['High-density EPP foam', 'Textured grip surface', '45 cm length'],
    stockQuantity: 0,
    isPickupAvailable: true,
    pickupLocation: 'Brooklyn club front desk',
  },
  {
    _id: oid('670c3d4e5f6a7b8c9d0e0006'),
    name: 'FORM Massage Ball Duo',
    subtitle: 'Lacrosse + Spiky',
    description:
      'Two-ball recovery kit: smooth lacrosse ball for deep tissue and spiky ball for foot and hand release.',
    category: 'RECOVERY',
    badge: 'NEW',
    price: 18,
    rating: 4.5,
    reviewCount: 34,
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a'],
    options: {
      colors: ['#1E1E1E', '#D8C7B5'],
      sizes: [],
    },
    features: ['Two textures', 'Travel-friendly', 'Durable rubber'],
    stockQuantity: 90,
    isPickupAvailable: false,
    pickupLocation: 'Brooklyn club front desk',
  },
];

// Upsert by _id so re-running the seed updates instead of duplicating
const upsertAll = async (model, docs) => {
  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { _id: doc._id },
      update: { $set: doc },
      upsert: true,
    },
  }));
  const result = await model.bulkWrite(ops);
  return result.upsertedCount + result.modifiedCount;
};

const seed = async () => {
  await connectDb();

  const classCount = await upsertAll(TrainingClass, TRAINING_CLASSES);
  logger.info(`TrainingClass seeded: ${classCount} docs`);

  const sessionCount = await upsertAll(ClassSession, CLASS_SESSIONS);
  logger.info(`ClassSession seeded: ${sessionCount} docs`);

  const productCount = await upsertAll(Product, PRODUCTS);
  logger.info(`Product seeded: ${productCount} docs`);

  logger.info('Mock data seed complete');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(async (error) => {
  logger.error('Seed failed', { error: error.message, stack: error.stack });
  await mongoose.disconnect();
  process.exit(1);
});
