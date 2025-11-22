import mongoose from 'mongoose';

const JobHistorySchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  pickupAddress: String,
  deliveryAddress: String,
  cargoType: { type: String, enum: ['Fresh', 'Frozen', 'Mixed'] },
  distance: Number,
  duration: Number,
  payment: { type: Number, required: true },
  rating: { type: Number, min: 1, max: 5 },
  completedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' }
});

const EarningHistorySchema = new mongoose.Schema({
  id: String,
  jobId: String,
  date: { type: Date, default: Date.now },
  totalEarnings: { type: Number, required: true },
  basePayment: Number,
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'paid'],
    default: 'pending'
  },
  paymentMethod: String,
  transactionId: String
});

const VehicleDetailsSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  type: { type: String, enum: ['Van', 'Truck', 'Car', 'Motorcycle'] },
  registrationNumber: { type: String, unique: true, sparse: true },
  currentOdometer: { type: Number, default: 0 },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] },
  capacity: Number,
  lastMaintenance: Date,
  nextMaintenanceDue: Date
});

const ActiveJobSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  title: String,
  pickupTime: Date,
  deliveryTime: Date,
  status: { type: String, enum: ['assigned', 'in-progress'], default: 'assigned' },
  startedAt: Date
});

const DriverSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  
  // Vehicle Information
  vehicleId: { type: String },
  vehicleDetails: VehicleDetailsSchema,
  
  // Status and Activity
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on-duty', 'off-duty', 'suspended'],
    default: 'active'
  },
  
  // Performance Metrics
  rating: { type: Number, default: 5.0, min: 0, max: 5 },
  totalDeliveries: { type: Number, default: 0 },
  totalDistanceCovered: { type: Number, default: 0 },
  onTimeDeliveryRate: { type: Number, default: 100 },
  
  // Earnings
  totalEarnings: { type: Number, default: 0 },
  currentMonthEarnings: { type: Number, default: 0 },
  pendingEarnings: { type: Number, default: 0 },
  averageEarningsPerJob: { type: Number, default: 0 },
  
  // Job History
  completedJobs: [JobHistorySchema],
  earningsHistory: [EarningHistorySchema],
  activeJobs: [ActiveJobSchema],
  
  // Dates
  joinedDate: { type: Date, default: Date.now },
  lastActiveDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Update averageEarningsPerJob whenever earnings change
DriverSchema.pre('save', function(next) {
  if (this.totalDeliveries > 0) {
    this.averageEarningsPerJob = this.totalEarnings / this.totalDeliveries;
  }
  next();
});

export default mongoose.model('Driver', DriverSchema);
