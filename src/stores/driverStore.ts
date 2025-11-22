import { create } from 'zustand';

export interface DriverProfile {
  _id: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleId?: string;
  vehicleDetails?: {
    make: string;
    model: string;
    year: number;
    type: string;
    registrationNumber: string;
    currentOdometer: number;
    fuelType?: string;
    capacity?: number;
    lastMaintenance?: Date;
    nextMaintenanceDue?: Date;
  };
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty' | 'suspended';
  rating: number;
  totalDeliveries: number;
  totalDistanceCovered: number;
  onTimeDeliveryRate: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  pendingEarnings: number;
  averageEarningsPerJob: number;
  completedJobs: any[];
  earningsHistory: any[];
  activeJobs: any[];
  joinedDate: Date;
  lastActiveDate: Date;
}

interface DriverState {
  currentDriver: DriverProfile | null;
  loading: boolean;
  error: string | null;
  fetchDriverByEmail: (email: string) => Promise<void>;
  fetchDriverById: (id: string) => Promise<void>;
  updateDriverStatus: (id: string, status: string) => Promise<void>;
  addActiveJob: (id: string, jobData: any) => Promise<void>;
  completeJob: (id: string, jobData: any) => Promise<void>;
  updateVehicleDetails: (id: string, vehicleDetails: any) => Promise<void>;
  clearDriver: () => void;
}

const API_URL = 'http://localhost:5001/api/drivers';

export const useDriverStore = create<DriverState>((set) => ({
  currentDriver: null,
  loading: false,
  error: null,

  fetchDriverByEmail: async (email: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/email/${email}`);
      if (!response.ok) throw new Error('Driver not found');
      
      const driver = await response.json();
      set({ 
        currentDriver: { ...driver, id: driver._id },
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchDriverById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Driver not found');
      
      const driver = await response.json();
      set({ 
        currentDriver: { ...driver, id: driver._id },
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateDriverStatus: async (id: string, status: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      const driver = await response.json();
      set({ currentDriver: { ...driver, id: driver._id } });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addActiveJob: async (id: string, jobData: any) => {
    try {
      const response = await fetch(`${API_URL}/${id}/jobs/active`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) throw new Error('Failed to add job');
      
      const driver = await response.json();
      set({ currentDriver: { ...driver, id: driver._id } });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  completeJob: async (id: string, jobData: any) => {
    try {
      const response = await fetch(`${API_URL}/${id}/jobs/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) throw new Error('Failed to complete job');
      
      const driver = await response.json();
      set({ currentDriver: { ...driver, id: driver._id } });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateVehicleDetails: async (id: string, vehicleDetails: any) => {
    try {
      const response = await fetch(`${API_URL}/${id}/vehicle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleDetails),
      });
      
      if (!response.ok) throw new Error('Failed to update vehicle');
      
      const driver = await response.json();
      set({ currentDriver: { ...driver, id: driver._id } });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearDriver: () => {
    set({ currentDriver: null, error: null });
  },
}));
