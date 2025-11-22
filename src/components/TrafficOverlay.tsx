import { useEffect, useState } from 'react';
import { AlertTriangle, Construction, XCircle, Activity } from 'lucide-react';
import { getTrafficIncidents, type TrafficIncident } from '../utils/trafficService';

export default function TrafficOverlay() {
  const [incidents, setIncidents] = useState<TrafficIncident[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fetch traffic incidents
    const fetchIncidents = () => {
      const data = getTrafficIncidents();
      setIncidents(data);
    };

    fetchIncidents();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchIncidents, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const getIncidentIcon = (type: TrafficIncident['type']) => {
    switch (type) {
      case 'accident':
        return <AlertTriangle size={16} />;
      case 'construction':
        return <Construction size={16} />;
      case 'closure':
        return <XCircle size={16} />;
      case 'congestion':
        return <Activity size={16} />;
    }
  };

  const getSeverityColor = (severity: TrafficIncident['severity']) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-500';
      case 'major':
        return 'bg-orange-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  return (
    <div className="absolute top-20 left-6 z-[1000] max-w-sm">
      <div className="bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Activity className="text-[#F9D71C]" size={20} />
            <h3 className="font-semibold text-white">Live Traffic</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white transition"
          >
            ×
          </button>
        </div>

        {/* Incidents List */}
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {incidents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No traffic incidents reported
            </p>
          ) : (
            incidents.map((incident) => (
              <div
                key={incident.id}
                className="bg-gray-800 p-3 rounded-lg border border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <div className={`${getSeverityColor(incident.severity)} p-2 rounded-lg text-white`}>
                    {getIncidentIcon(incident.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase">
                        {incident.type}
                      </span>
                      <span className="text-xs text-red-400">
                        +{incident.delay} min delay
                      </span>
                    </div>
                    <p className="text-sm text-white">{incident.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Traffic Legend */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-2">Traffic Conditions:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-300">Light</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-300">Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-300">Heavy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-300">Severe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle button when hidden */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="mt-2 bg-gray-900/95 backdrop-blur-sm p-3 rounded-lg border border-gray-800 hover:bg-gray-800 transition"
        >
          <Activity className="text-[#F9D71C]" size={20} />
        </button>
      )}
    </div>
  );
}
