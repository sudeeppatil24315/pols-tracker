import { useState } from 'react';
import { FileDown, LogOut, Plus, UserPlus, List } from 'lucide-react';
import type { User } from '../types';
import CreateTaskModal from './CreateTaskModal';
import DriverRegistration from './DriverRegistration';
import JobStatusPanel from './JobStatusPanel';

interface AdminSidebarProps {
  user: User;
  onExportReport: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({ user, onExportReport, onLogout }: AdminSidebarProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDriverRegOpen, setIsDriverRegOpen] = useState(false);
  const [isJobStatusOpen, setIsJobStatusOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  return (
    <>
      <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
        {/* Logo and Branding */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🐔</div>
            <div>
              <h1 className="text-xl font-bold text-[#F9D71C]">LOS POLLOS</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-800">
          <p className="text-sm font-semibold text-white">{user.name}</p>
          <p className="text-xs text-gray-400 capitalize">{user.role}</p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            <button
              onClick={() => setIsJobStatusOpen(true)}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition text-left"
            >
              <List size={18} />
              <span className="text-sm font-medium">All Jobs</span>
            </button>

            <button
              onClick={() => setIsDriverRegOpen(true)}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition text-left"
            >
              <UserPlus size={18} />
              <span className="text-sm font-medium">Add Driver</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition text-left"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">New Job</span>
            </button>

            <button
              onClick={onExportReport}
              className="w-full flex items-center space-x-3 px-3 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition text-left"
            >
              <FileDown size={18} />
              <span className="text-sm font-medium">Export Report</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-gray-800">
          <button
            onClick={() => setLightMode(!lightMode)}
            className="w-full flex items-center space-x-3 px-6 py-3 text-gray-300 hover:bg-gray-800 transition text-left"
          >
            <span className="text-lg">☀️</span>
            <span className="text-sm font-medium">Light Mode</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-6 py-3 bg-red-600 hover:bg-red-700 text-white transition text-left"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <DriverRegistration
        isOpen={isDriverRegOpen}
        onClose={() => setIsDriverRegOpen(false)}
        onDriverAdded={() => {}}
      />
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <JobStatusPanel
        isOpen={isJobStatusOpen}
        onClose={() => setIsJobStatusOpen(false)}
      />
    </>
  );
}
