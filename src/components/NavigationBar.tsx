import { useState, useEffect } from 'react';
import { FileDown, Moon, Sun, LogOut, Plus, UserPlus } from 'lucide-react';
import { useVehicleStore } from '../stores/vehicleStore';
import type { NavigationBarProps } from '../types';
import CreateTaskModal from './CreateTaskModal';
import DriverRegistration from './DriverRegistration';

export default function NavigationBar({
  user,
  onExportReport,
  onToggleDarkMode,
  onLogout,
  isDarkMode,
}: NavigationBarProps) {
  const vehicles = useVehicleStore((state) => state.vehicles);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDriverRegOpen, setIsDriverRegOpen] = useState(false);
  
  // Filter vehicles based on user role
  const visibleVehicles = user.role === 'driver' && user.vehicleId
    ? vehicles.filter((v) => v.id === user.vehicleId)
    : vehicles;
  
  const statusCounts = {
    total: visibleVehicles.length,
    onTime: visibleVehicles.filter((v) => v.status === 'on-time').length,
    warning: visibleVehicles.filter((v) => v.status === 'warning').length,
    critical: visibleVehicles.filter((v) => v.status === 'critical').length,
  };
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-4">
          <div className="text-3xl">🐔</div>
          <div>
            <h1 className="text-2xl font-bold text-[#F9D71C]">
              LOS POLLOS TRACKER
            </h1>
            <p className="text-xs text-gray-400">Taste the Family... On Time</p>
          </div>
        </div>

        {/* Center - Status Counters */}
        <div className="flex items-center space-x-6">
          {/* Total Vehicles */}
          <div className="text-center px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-white">{statusCounts.total}</p>
          </div>

          {/* On-Time */}
          <div className="text-center px-4 py-2 bg-green-900/30 border border-green-500/30 rounded-lg">
            <p className="text-xs text-green-400 mb-1">On-Time</p>
            <p className="text-2xl font-bold text-green-500">{statusCounts.onTime}</p>
          </div>

          {/* Warning */}
          <div className="text-center px-4 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
            <p className="text-xs text-yellow-400 mb-1">Warning</p>
            <p className="text-2xl font-bold text-yellow-500">{statusCounts.warning}</p>
          </div>

          {/* Critical */}
          <div className="text-center px-4 py-2 bg-red-900/30 border border-red-500/30 rounded-lg">
            <p className="text-xs text-red-400 mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-500">{statusCounts.critical}</p>
          </div>

          {/* Live Clock */}
          <div className="text-center px-4 py-2 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Live Clock</p>
            <p className="text-lg font-mono text-white">{formatTime(currentTime)}</p>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-3">
          {/* Admin Actions */}
          {user.role === 'admin' && (
            <>
              <button
                onClick={() => setIsDriverRegOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                title="Register Driver"
              >
                <UserPlus size={18} />
                <span>Add Driver</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                title="Create New Task"
              >
                <Plus size={18} />
                <span>New Task</span>
              </button>
              <button
                onClick={onExportReport}
                className="flex items-center space-x-2 bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold px-4 py-2 rounded-lg transition"
                title="Export Fleet Report"
              >
                <FileDown size={18} />
                <span>Export Report</span>
              </button>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-700">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
            <button
              onClick={onLogout}
              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DriverRegistration
        isOpen={isDriverRegOpen}
        onClose={() => setIsDriverRegOpen(false)}
        onDriverAdded={() => {
          // Refresh drivers list in CreateTaskModal if it's open
        }}
      />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </nav>
  );
}
