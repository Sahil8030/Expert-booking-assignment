import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Expert from '../models/Expert.js';

export async function createBooking(req, res, next) {
  const { expertId, name, email, phone, date, timeSlot, notes } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const expert = await Expert.findById(expertId).session(session);

    if (!expert) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Expert not found',
        errors: [],
      });
    }

    const slot = expert.availableSlots.find(
      (s) => s.date === date && s.time === timeSlot && !s.isBooked
    );

    if (!slot) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message:
          'This slot is no longer available. Please choose another.',
        errors: [],
      });
    }

    slot.isBooked = true;
    await expert.save({ session });

    const [bookingDoc] = await Booking.create(
      [
        {
          expertId,
          name,
          email: String(email).trim().toLowerCase(),
          phone,
          date,
          timeSlot,
          notes: notes ?? '',
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const io = req.app.get('io');
    io.emit('slot:booked', {
      expertId: String(expert._id),
      date,
      timeSlot,
    });

    res.status(201).json(bookingDoc.toObject());
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    next(err);
  } finally {
    await session.endSession();
  }
}

export async function updateBookingStatus(req, res, next) {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('expertId', 'name category avatar');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
        errors: [],
      });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function getBookingsByEmail(req, res, next) {
  try {
    const email = req.query.email;
    if (!email || !String(email).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email query parameter is required',
        errors: [],
      });
    }

    const bookings = await Booking.find({
      email: String(email).trim().toLowerCase(),
    })
      .sort({ createdAt: -1 })
      .populate('expertId', 'name category avatar');

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
}
