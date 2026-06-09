import mongoose from 'mongoose';

const ZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Zone name is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    zoneCode: {
      type: String,
      required: [true, 'Zone code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Zone', ZoneSchema);
