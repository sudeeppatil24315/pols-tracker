import { useEffect, useState } from 'react';
import { X, Package, MapPin, Clock, DollarSign, User, Filter } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';

interface JobStatusPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobStatusPanel({ isOpen, onClose }: JobStatusPanelProps) {
  const { jobs, fetchJobs } = useJobStore();
  const [filter, setFilter] = useState<'all' | 'available' | 'assigned' | 'in-progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
    }
  }, [isOpen, fetchJobs]);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'assigned':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in-progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.pickupLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.deliveryLocation.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.assignedDriverName || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: jobs.length,
    available: jobs.filter(j => j.status === 'available').length,
    assigned: jobs.filter(j => j.status === 'assigned').length,
    'in-progress': jobs.filter(j => j.status === 'in-progress').length,
    completed: jobs.filter(j => j.status === 'completed').length,
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[1100]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-gray-900 shadow-2xl z-[1101] flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="text-[#F9D71C]" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-white">Job Status Dashboard</h2>
              <p className="text-sm text-gray-400">Monitor all delivery jobs in real-time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs, addresses, or drivers..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-4 pr-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
              />
            </div>
            <Filter className="text-gray-400" size={20} />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {(['all', 'available', 'assigned', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                  filter === status
                    ? 'bg-[#F9D71C] text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                <span className="ml-2 text-xs opacity-75">({statusCounts[status]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Job List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Package size={64} className="mb-4 opacity-50" />
              <p className="text-lg">No jobs found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id || job._id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-[#F9D71C] transition"
                >
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(job.status)}`}>
                          {job.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-xs font-medium ${getPriorityColor(job.priority)}`}>
                          ● {job.priority.toUpperCase()}
                        </span>
                      </div>
                      {job.description && (
                        <p className="text-sm text-gray-400">{job.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-green-400">
                        <DollarSign size={16} />
                        <span className="text-lg font-bold">₹{job.payment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {/* Pickup */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-blue-400">
                        <MapPin size={14} />
                        <span className="text-xs font-medium">PICKUP</span>
                      </div>
                      <p className="text-sm text-gray-300 pl-5">{job.pickupLocation.address}</p>
                      <p className="text-xs text-gray-500 pl-5">
                        {new Date(job.pickupTime).toLocaleString()}
                      </p>
                    </div>

                    {/* Delivery */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-green-400">
                        <MapPin size={14} />
                        <span className="text-xs font-medium">DELIVERY</span>
                      </div>
                      <p className="text-sm text-gray-300 pl-5">{job.deliveryLocation.address}</p>
                      <p className="text-xs text-gray-500 pl-5">
                        {new Date(job.deliveryTime).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Job Metadata */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Package size={14} />
                        <span>{job.cargoType} ({job.cargoWeight}kg)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{job.estimatedDistance}km • {job.estimatedDuration}h</span>
                      </div>
                      {job.assignedDriverName && (
                        <div className="flex items-center space-x-1 text-[#F9D71C]">
                          <User size={14} />
                          <span>{job.assignedDriverName}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {(job.id || job._id)?.slice(-6)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </span>
            <div className="flex items-center space-x-4 text-gray-400">
              <span>Total Revenue: <span className="text-green-400 font-semibold">₹{jobs.reduce((sum, job) => sum + job.payment, 0)}</span></span>
              <span>Completed: <span className="text-white font-semibold">{statusCounts.completed}</span></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
