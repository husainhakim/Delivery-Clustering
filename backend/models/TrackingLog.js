import mongoose from 'mongoose';

const TrackingLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: ['ZONE_CREATED', 'ZONE_DELETED', 'ROUTE_ADDED', 'ROUTE_REMOVED'],
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('TrackingLog', TrackingLogSchema);
