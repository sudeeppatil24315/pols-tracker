import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface AbortJobModalProps {
  isOpen: boolean;
  jobTitle: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const ABORT_REASONS = [
  'Vehicle breakdown',
  'Traffic accident',
  'Medical emergency',
  'Weather conditions',
  'Road closure',
  'Customer unavailable',
  'Wrong address',
  'Personal emergency',
  'Other',
];

export default function AbortJobModal({ isOpen, jobTitle, onClose, onConfirm }: AbortJobModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const reason = selectedReason === 'Other' ? customReason : selectedReason;
    
    if (!reason.trim()) {
      alert('Please select or enter a reason');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(reason);
      onClose();
    } catch (error) {
      console.error('Failed to abort job:', error);
      alert('Failed to abort job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-[1100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gray-900 rounded-lg shadow-2xl z-[1101]">
        <div className="bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="text-red-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Abort Delivery</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">
              <strong>Warning:</strong> Aborting this delivery will make it available for other drivers. 
              This action cannot be undone.
            </p>
          </div>

          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Job:</p>
            <p className="text-white font-semibold text-lg">{jobTitle}</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Reason for aborting *
            </label>
            <div className="space-y-2">
              {ABORT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                    selectedReason === reason
                      ? 'bg-[#F9D71C]/10 border-[#F9D71C]'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-[#F9D71C] focus:ring-[#F9D71C]"
                  />
                  <span className="text-white">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'Other' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Please specify
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
                placeholder="Enter your reason..."
                rows={3}
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !selectedReason}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <AlertTriangle size={18} />
              <span>{loading ? 'Aborting...' : 'Abort Delivery'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
