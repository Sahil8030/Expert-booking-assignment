import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Business',
      'Design',
      'Marketing',
      'Finance',
      'Legal',
      'Health',
      'Education',
    ],
  },
  experience: { type: Number, required: true },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  bio: { type: String, required: true },
  avatar: { type: String },
  availableSlots: [slotSchema],
});

export default mongoose.model('Expert', expertSchema);
