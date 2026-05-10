import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const statusValues = ['pending', 'confirmed', 'completed'];

router.post(
  '/',
  [
    body('expertId').isMongoId().withMessage('Invalid expert id'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone')
      .matches(/^\d{10}$/)
      .withMessage('Phone must be exactly 10 digits'),
    body('date').trim().notEmpty().withMessage('Date is required'),
    body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
    body('notes').optional({ values: 'falsy' }).isString(),
  ],
  validate,
  createBooking
);

router.patch(
  '/:id/status',
  [
    param('id').isMongoId().withMessage('Invalid booking id'),
    body('status')
      .isIn(statusValues)
      .withMessage(`Status must be one of: ${statusValues.join(', ')}`),
  ],
  validate,
  updateBookingStatus
);

router.get(
  '/',
  (req, res, next) => {
    if (!req.query.email || !String(req.query.email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email query parameter is required',
        errors: [],
      });
    }
    next();
  },
  getBookingsByEmail
);

export default router;
