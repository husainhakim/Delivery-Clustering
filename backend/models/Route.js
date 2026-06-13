import mongoose from 'mongoose';

const RouteSchema = new mongoose.Schema(
  {
    sourceZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      required: [true, 'Source zone is required'],
    },
    destinationZone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
      required: [true, 'Destination zone is required'],
    },
    status: {
      type: String,
      enum: ['active', 'disrupted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent self-loops
RouteSchema.pre('save', function (next) {
  if (this.sourceZone.toString() === this.destinationZone.toString()) {
    return next(new Error('Source and destination zones cannot be the same'));
  }
  next();
});

export default mongoose.model('Route', RouteSchema);
