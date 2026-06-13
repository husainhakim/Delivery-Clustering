import mongoose from 'mongoose';

const ZoneOperationLogSchema = new mongoose.Schema(
  {
    operationType: {
      type: String,
      required: true,
      enum: ['SPLIT', 'MERGE', 'CREATED', 'DELETED', 'CLUSTER_RECOMPUTED'],
    },
    reason: {
      type: String, // e.g., "Weather disruption", "Manual intervention"
    },
    affectedZones: [{
      type: String, // zoneIds of affected zones
    }],
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ZoneOperationLog', ZoneOperationLogSchema);
