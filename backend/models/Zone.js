import mongoose from 'mongoose';

const ZoneSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      required: [true, 'Zone ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
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
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    courierIds: [
      {
        type: String,
      },
    ],
    parentZoneId: {
      type: String, // Computed cluster root zoneId (UF root representative)
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'disrupted', 'merged', 'split'],
      default: 'active',
    },
    courierCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    activeOrders: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Zone', ZoneSchema);
