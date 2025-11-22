import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  pickupLocation: {
    address: { type: String, required: true },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  deliveryLocation: {
    address: { type: String, required: true },
    position: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  cargoType: { 
    type: String, 
    enum: ['Fresh', 'Frozen', 'Mixed'],
    required: true 
  },
  cargoWeight: { type: Number, required: true }, // in kg
  estimatedDistance: { type: Number, required: true }, // in km
  estimatedDuration: { type: Number, required: true }, // in hours
  payment: { type: Number, required: true }, // in rupees
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['available', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'available'
  },
  pickupTime: { type: Date, required: true },
  deliveryTime: { type: Date, required: true },
  assignedDriverId: { type: String },
  assignedDriverName: String,
  startedAt: Date,
  completedAt: Date,
  rating: { type: Number, min: 1, max: 5 },
  createdBy: { type: String, required: true }, // Admin ID
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Index for faster queries
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ assignedDriverId: 1, status: 1 });

export default mongoose.model('Job', JobSchema);
