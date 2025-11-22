import { useState, useEffect } from 'react';
import { X, MapPin, Clock, User, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';
import { useDriverStore } from '../stores/driverStore';
import type { Job } from '../types';

interface AdminJobsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminJobsPanel({ isOpen, onClose }: AdminJobsPanelProps) {
  const { getAllJobs } = useJobStore();
  const { getDriverProfile } = useDriverStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<'all' | 'available' | 'assigned' | 'in-progress' | 'completed'>('all');

  // Update jobs every second to show real-time changes
  useEffect(() => {
    const updateJobs = () => {
      setJobs(getAllJobs());
    };
    
    updateJobs();
    const interval = setInterval(updateJobs, 1000);
    
    return () => clearInterval(interval);
  }, [getAllJobs]);

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);

  const statusColors = {
    available: 'bg-blue-600',
    assigned: 'bg-yellow-600',
    'in-progress': 'bg-orange-600',
    completed: 'bg-green-600',
    cancelled: 'bg-red-600',
  };

  const statusIcons = {
    available: <AlertCircle size={16} />,
    assigned: <User size={16} />,
    'in-progress': <TrendingUp size={16} />,
    completed: <CheckCircle size={16} />,
    cancelled: <X size={16} />,
  };

  const stats = {
    total: jobs.length,
    available: jobs.filter(j => j.status === 'available').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    inProgress: jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[1500]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[800px] bg-gray-900 border-l border-gray-800 shadow-2xl z-[1501] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Job Management</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            <div className="bg-gray-800 p-3 rounded-lg text-center">
              <p className="text-xs text-gray-400 mb-1">Total</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-lg text-center">
              <p className="text-xs text-blue-400 mb-1">Available</p>
              <p className="text-xl font-bold text-blue-500">{stats.available}</p>
            </div>
            <div className="bg-yellow-900/30 border border-yellow-500/30 p-3 rounded-lg text-center">
              <p className="text-xs text-yellow-400 mb-1">Assigned</p>
              <p className="text-xl font-bold text-yellow-500">{stats.assigned}</p>
            </div>
            <div className="bg-orange-900/30 border border-orange-500/30 p-3 rounded-lg text-center">
              <p className="text-xs text-orange-400 mb-1">In Progress</p>
              <p className="text-xl font-bold text-orange-500">{stats.inProgress}</p>
            </div>
            <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg text-center">
              <p className="text-xs text-green-400 mb-1">Completed</p>
              <p className="text-xl font-bold text-green-500">{stats.completed}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all' ? 'bg-[#F9D71C] text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'available' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setFilter('assigned')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'assigned' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'in-progress' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="p-6 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No jobs found</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const driver = job.assignedDriverId ? getDriverProfile(job.assignedDriverId) : null;
              
              return (
                <div key={job.id} className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{job.title}</h3>
                        <span className={`flex items-center space-x-1 px-2 py-1 ${statusColors[job.status]} text-white text-xs font-semibold rounded`}>
                          {statusIcons[job.status]}
                          <span>{job.status.toUpperCase()}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{job.description}</p>
                      {driver && (
                        <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3 mb-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <User size={16} className="text-blue-400" />
                            <span className="text-blue-300">Assigned to:</span>
                          </div>
                          <div className="mt-1">
                            <p className="text-white font-semibold">{driver.name}</p>
                            <p className="text-xs text-blue-300">{driver.phone} • {driver.vehicleDetails.registrationNumber}</p>
                            <p className="text-xs text-blue-300">{driver.vehicleDetails.make} {driver.vehicleDetails.model} ({driver.vehicleDetails.type})</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-[#F9D71C]">₹{job.payment}</p>
                      <p className="text-xs text-gray-400">{job.estimatedDistance} km</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <p className="text-gray-400 flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>Pickup</span>
                      </p>
                      <p className="text-white font-semibold">{job.pickupLocation.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>Delivery</span>
                      </p>
                      <p className="text-white font-semibold">{job.deliveryLocation.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                    <div>
                      <p className="text-gray-500">Pickup Time</p>
                      <p className="text-white font-semibold">{new Date(job.pickupTime).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery Time</p>
                      <p className="text-white font-semibold">{new Date(job.deliveryTime).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{job.estimatedDuration.toFixed(1)}h</span>
                      </span>
                      <span>Weight: <span className="text-white font-semibold">{job.cargoWeight}kg</span></span>
                      <span>Priority: <span className="text-white font-semibold">{job.priority}</span></span>
                      <span>Cargo: <span className="text-white font-semibold">{job.cargoType}</span></span>
                    </div>
                    {job.completedAt && (
                      <div className="text-xs text-green-500">
                        Completed: {job.completedAt.toLocaleTimeString()}
                      </div>
                    )}
                    {job.startedAt && job.status === 'in-progress' && (
                      <div className="text-xs text-orange-500">
                        Started: {job.startedAt.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
