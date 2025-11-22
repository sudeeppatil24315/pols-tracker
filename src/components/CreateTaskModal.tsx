import { useState, useEffect } from 'react';
import { X, MapPin, Package, Clock, DollarSign, Map } from 'lucide-react';
import { useJobStore } from '../stores/jobStore';
import MapPicker from './MapPicker';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const { addJob } = useJobStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pickupAddress: '',
    pickupLat: '',
    pickupLng: '',
    deliveryAddress: '',
    deliveryLat: '',
    deliveryLng: '',
    cargoType: 'Fresh' as 'Fresh' | 'Frozen' | 'Mixed',
    cargoWeight: '',
    estimatedDistance: '',
    estimatedDuration: '',
    payment: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    pickupTime: '',
    deliveryTime: '',
  });

  const [loading, setLoading] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [pickingFor, setPickingFor] = useState<'pickup' | 'delivery' | null>(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);

  // Auto-calculate distance when both locations are selected
  useEffect(() => {
    const calculateDistance = async () => {
      if (!formData.pickupLat || !formData.pickupLng || !formData.deliveryLat || !formData.deliveryLng) {
        return;
      }

      setCalculatingDistance(true);
      try {
        const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${formData.pickupLng},${formData.pickupLat};${formData.deliveryLng},${formData.deliveryLat}?access_token=${mapboxToken}&geometries=geojson`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceKm = (route.distance / 1000).toFixed(1); // Convert meters to km
          const durationHours = (route.duration / 3600).toFixed(1); // Convert seconds to hours
          
          setFormData(prev => ({
            ...prev,
            estimatedDistance: distanceKm,
            estimatedDuration: durationHours,
          }));
        }
      } catch (error) {
        console.error('Failed to calculate distance:', error);
      } finally {
        setCalculatingDistance(false);
      }
    };

    calculateDistance();
  }, [formData.pickupLat, formData.pickupLng, formData.deliveryLat, formData.deliveryLng]);

  if (!isOpen) return null;

  const handleMapPickerSelect = (lat: number, lng: number, address: string) => {
    if (pickingFor === 'pickup') {
      setFormData({
        ...formData,
        pickupAddress: address,
        pickupLat: lat.toString(),
        pickupLng: lng.toString(),
      });
    } else if (pickingFor === 'delivery') {
      setFormData({
        ...formData,
        deliveryAddress: address,
        deliveryLat: lat.toString(),
        deliveryLng: lng.toString(),
      });
    }
    setShowMapPicker(false);
    setPickingFor(null);
  };

  const calculatePayment = () => {
    const distance = parseFloat(formData.estimatedDistance) || 0;
    const weight = parseFloat(formData.cargoWeight) || 0;
    const duration = parseFloat(formData.estimatedDuration) || 0;
    
    // Base rate: ₹10 per km + ₹2 per kg + ₹50 per hour
    const basePayment = (distance * 10) + (weight * 2) + (duration * 50);
    
    // Priority multiplier
    const priorityMultiplier = {
      low: 1.0,
      medium: 1.2,
      high: 1.5,
      urgent: 2.0,
    };
    
    return Math.round(basePayment * priorityMultiplier[formData.priority]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.pickupAddress || !formData.deliveryAddress) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        pickupLocation: {
          address: formData.pickupAddress,
          position: {
            lat: parseFloat(formData.pickupLat) || 12.9716,
            lng: parseFloat(formData.pickupLng) || 77.5946,
          },
        },
        deliveryLocation: {
          address: formData.deliveryAddress,
          position: {
            lat: parseFloat(formData.deliveryLat) || 12.9352,
            lng: parseFloat(formData.deliveryLng) || 77.6245,
          },
        },
        cargoType: formData.cargoType,
        cargoWeight: parseFloat(formData.cargoWeight) || 0,
        estimatedDistance: parseFloat(formData.estimatedDistance) || 0,
        estimatedDuration: parseFloat(formData.estimatedDuration) || 0,
        payment: parseFloat(formData.payment) || calculatePayment(),
        priority: formData.priority,
        pickupTime: new Date(formData.pickupTime || Date.now() + 30 * 60 * 1000),
        deliveryTime: new Date(formData.deliveryTime || Date.now() + 120 * 60 * 1000),
        createdBy: 'admin', // TODO: Get from auth store
      };

      await addJob(jobData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        pickupAddress: '',
        pickupLat: '',
        pickupLng: '',
        deliveryAddress: '',
        deliveryLat: '',
        deliveryLng: '',
        cargoType: 'Fresh',
        cargoWeight: '',
        estimatedDistance: '',
        estimatedDuration: '',
        payment: '',
        priority: 'medium',
        pickupTime: '',
        deliveryTime: '',
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create job:', error);
      alert('Failed to create job. Please try again.');
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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-gray-900 rounded-lg shadow-2xl z-[1101] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="text-[#F9D71C]" size={28} />
            <h2 className="text-2xl font-bold text-white">Create New Job</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
              placeholder="e.g., Fresh Produce Delivery"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
              placeholder="Additional details about the delivery..."
              rows={2}
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pickup Address *
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
                  placeholder="Enter pickup address"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setPickingFor('pickup');
                  setShowMapPicker(true);
                }}
                className="bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold px-4 py-2 rounded-lg transition flex items-center space-x-2"
              >
                <Map size={16} />
                <span>Pick on Map</span>
              </button>
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Delivery Address *
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
                  placeholder="Enter delivery address"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setPickingFor('delivery');
                  setShowMapPicker(true);
                }}
                className="bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold px-4 py-2 rounded-lg transition flex items-center space-x-2"
              >
                <Map size={16} />
                <span>Pick on Map</span>
              </button>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cargo Type
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <select
                  value={formData.cargoType}
                  onChange={(e) => setFormData({ ...formData, cargoType: e.target.value as 'Fresh' | 'Frozen' | 'Mixed' })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
                >
                  <option value="Fresh">Fresh</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                min="1"
                value={formData.cargoWeight}
                onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
                placeholder="150"
              />
            </div>
          </div>

          {/* Distance and Duration - Auto-calculated */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Distance (km) {calculatingDistance && <span className="text-[#F9D71C] text-xs">Calculating...</span>}
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={formData.estimatedDistance}
                onChange={(e) => setFormData({ ...formData, estimatedDistance: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C] disabled:opacity-50"
                placeholder="Auto-calculated"
                disabled={calculatingDistance}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (hours) {calculatingDistance && <span className="text-[#F9D71C] text-xs">Calculating...</span>}
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#F9D71C] disabled:opacity-50"
                  placeholder="Auto-calculated"
                  disabled={calculatingDistance}
                />
              </div>
            </div>
          </div>

          {/* Priority and Payment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  value={formData.payment}
                  onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                  onFocus={(e) => {
                    // If empty, don't show calculated value in the input
                    if (!formData.payment) {
                      e.target.placeholder = `${calculatePayment()}`;
                    }
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
                  placeholder={`${calculatePayment() || 'Auto-calculated'}`}
                />
              </div>
            </div>
          </div>

          {/* Pickup and Delivery Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pickup Time
              </label>
              <input
                type="datetime-local"
                value={formData.pickupTime}
                onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Delivery Time
              </label>
              <input
                type="datetime-local"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F9D71C]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#F9D71C] hover:bg-[#e5c619] text-black font-semibold px-6 py-2 rounded-lg transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Package size={18} />
              <span>{loading ? 'Creating...' : 'Create Job'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-[1200]"
            onClick={() => {
              setShowMapPicker(false);
              setPickingFor(null);
            }}
          />
          <div className="fixed inset-4 bg-gray-900 rounded-lg shadow-2xl z-[1201] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">
                {pickingFor === 'pickup' ? 'Select Pickup Location' : 'Select Delivery Location'}
              </h2>
              <button
                onClick={() => {
                  setShowMapPicker(false);
                  setPickingFor(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1">
              <MapPicker
                onLocationSelect={handleMapPickerSelect}
                title={pickingFor === 'pickup' ? 'Pickup Location' : 'Delivery Location'}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
