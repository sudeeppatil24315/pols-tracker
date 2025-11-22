import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleId?: string;
  status: 'available' | 'on-duty' | 'off-duty';
  createdAt: Date;
}

const DriverSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  vehicleId: { type: String },
  status: { 
    type: String, 
    enum: ['available', 'on-duty', 'off-duty'],
    default: 'available'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDriver>('Driver', DriverSchema);
