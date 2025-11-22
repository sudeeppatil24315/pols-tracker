import { create } from 'zustand';
import { socketService } from '../services/socket';

export interface Job {
  id: string;
  _id?: string;
  title: string;
  description: string;
  pickupLocation: {
    address: string;
    position: { lat: number; lng: number };
  };
  deliveryLocation: {
    address: string;
    position: { lat: number; lng: number };
  };
  cargoType: 'Fresh' | 'Frozen' | 'Mixed';
  cargoWeight: number;
  estimatedDistance: number;
  estimatedDuration: number;
  payment: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'available' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  pickupTime: Date;
  deliveryTime: Date;
  assignedDriverId?: string;
  assignedDriverName?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  createdBy?: string;
}

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  addJob: (job: Omit<Job, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  assignJob: (jobId: string, driverId: string, driverName: string) => Promise<void>;
  startJob: (jobId: string) => Promise<void>;
  completeJob: (jobId: string) => Promise<void>;
  cancelJob: (jobId: string) => Promise<void>;
  abortJob: (jobId: string, reason: string) => Promise<void>;
  getAvailableJobs: (vehicleCapacity?: number) => Job[];
  getDriverJobs: (driverId: string) => Job[];
  getAllJobs: () => Job[];
  initializeSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

const API_URL = 'http://localhost:5001/api/jobs';

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const jobs = await response.json();
      // Normalize job IDs
      const normalizedJobs = jobs.map((job: any) => ({
        ...job,
        id: job._id || job.id,
      }));
      
      set({ jobs: normalizedJobs, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      console.error('Failed to fetch jobs:', error);
    }
  },

  addJob: async (jobData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });
      
      if (!response.ok) throw new Error('Failed to create job');
      
      const newJob = await response.json();
      set((state) => ({
        jobs: [...state.jobs, { ...newJob, id: newJob._id }],
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Failed to create job:', error);
    }
  },

  assignJob: async (jobId, driverId, driverName) => {
    try {
      // Update job in database
      const response = await fetch(`${API_URL}/${jobId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, driverName }),
      });
      
      if (!response.ok) throw new Error('Failed to assign job');
      
      const updatedJob = await response.json();
      
      // Update local state
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === jobId || job._id === jobId
            ? { ...updatedJob, id: updatedJob._id }
            : job
        ),
      }));

      // Add job to driver's active jobs
      const job = get().jobs.find(j => j.id === jobId || j._id === jobId);
      if (job) {
        await fetch(`http://localhost:5001/api/drivers/${driverId}/jobs/active`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            title: job.title,
            pickupTime: job.pickupTime,
            deliveryTime: job.deliveryTime,
          }),
        });
      }
    } catch (error: any) {
      set({ error: error.message });
      console.error('Failed to assign job:', error);
    }
  },

  startJob: async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/${jobId}/start`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to start job');
      
      const updatedJob = await response.json();
      
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === jobId || job._id === jobId
            ? { ...updatedJob, id: updatedJob._id }
            : job
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Failed to start job:', error);
    }
  },

  completeJob: async (jobId) => {
    const job = get().jobs.find(j => j.id === jobId || j._id === jobId);
    
    try {
      // Complete job in database
      const response = await fetch(`${API_URL}/${jobId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: 5 }),
      });
      
      if (!response.ok) throw new Error('Failed to complete job');
      
      const updatedJob = await response.json();
      
      // Update local state
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === jobId || j._id === jobId
            ? { ...updatedJob, id: updatedJob._id }
            : j
        ),
      }));

      // Update driver's earnings and job history
      if (job && job.assignedDriverId) {
        await fetch(`http://localhost:5001/api/drivers/${job.assignedDriverId}/jobs/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            title: job.title,
            description: job.description,
            pickupAddress: job.pickupLocation.address,
            deliveryAddress: job.deliveryLocation.address,
            cargoType: job.cargoType,
            distance: job.estimatedDistance,
            duration: job.estimatedDuration,
            payment: job.payment,
            rating: 5,
          }),
        });
      }
    } catch (error: any) {
      set({ error: error.message });
      console.error('Failed to complete job:', error);
    }
  },

  cancelJob: async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/${jobId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to cancel job');
      
      const updatedJob = await response.json();
      
      set((state) => ({
        jobs: state.jobs.map((job) =>
          job.id === jobId || job._id === jobId
            ? { ...updatedJob, id: updatedJob._id }
            : job
        ),
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error('Failed to cancel job:', error);
    }
  },

  abortJob: async (jobId, reason) => {
    const job = get().jobs.find(j => j.id === jobId || j._id === jobId);
    
    try {
      // Abort job - make it available again
      const response = await fetch(`${API_URL}/${jobId}/abort`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) throw new Error('Failed to abort job');
      
      const updatedJob = await response.json();
      
      // Update local state - job becomes available again
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === jobId || j._id === jobId
            ? { ...updatedJob, id: updatedJob._id }
            : j
        ),
      }));

      // Remove job from driver's active jobs
      if (job && job.assignedDriverId) {
        await fetch(`http://localhost:5001/api/drivers/${job.assignedDriverId}/jobs/abort`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobId: job.id,
            reason,
          }),
        });
      }

      // Socket event is emitted by the backend
    } catch (error: any) {
      set({ error: error.message });
      console.error('Failed to abort job:', error);
      throw error;
    }
  },

  getAvailableJobs: (vehicleCapacity?: number) => {
    const availableJobs = get().jobs.filter((job) => job.status === 'available');
    
    if (vehicleCapacity) {
      return availableJobs.filter((job) => job.cargoWeight <= vehicleCapacity);
    }
    
    return availableJobs;
  },

  getDriverJobs: (driverId: string) => {
    return get().jobs.filter(
      (job) =>
        job.assignedDriverId === driverId &&
        (job.status === 'assigned' || job.status === 'in-progress')
    );
  },

  getAllJobs: () => {
    return get().jobs;
  },

  initializeSocketListeners: () => {
    // Listen for new jobs
    socketService.onJobCreated((job: any) => {
      console.log('📦 New job created:', job);
      set((state) => ({
        jobs: [...state.jobs, { ...job, id: job._id }],
      }));
    });

    // Listen for job assignments
    socketService.onJobAssigned((job: any) => {
      console.log('📦 Job assigned:', job);
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === job._id || j._id === job._id
            ? { ...job, id: job._id }
            : j
        ),
      }));
    });

    // Listen for job starts
    socketService.onJobStarted((job: any) => {
      console.log('📦 Job started:', job);
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === job._id || j._id === job._id
            ? { ...job, id: job._id }
            : j
        ),
      }));
    });

    // Listen for job completions
    socketService.onJobCompleted((job: any) => {
      console.log('📦 Job completed:', job);
      set((state) => ({
        jobs: state.jobs.map((j) =>
          j.id === job._id || j._id === job._id
            ? { ...job, id: job._id }
            : j
        ),
      }));
    });
  },

  cleanupSocketListeners: () => {
    socketService.off('job:created');
    socketService.off('job:assigned');
    socketService.off('job:started');
    socketService.off('job:completed');
  },
}));
