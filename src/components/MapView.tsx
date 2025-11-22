import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { MapViewProps } from '../types';
import RouteHistory from './RouteHistory';
import 'leaflet/dist/leaflet.css';

export default function MapView({
  vehicles,
  onVehicleClick,
  viewMode,
  currentUserId,
}: MapViewProps) {
  // Filter vehicles based on view mode
  let visibleVehicles = vehicles;
  if (viewMode === 'driver' && currentUserId) {
    visibleVehicles = vehicles.filter((v) => v.id === currentUserId);
  }

  const colors = {
    'on-time': '#22C55E',
    'warning': '#F9D71C',
    'critical': '#EF4444',
  };

  // Create truck icon function
  const createTruckIcon = (status: 'on-time' | 'warning' | 'critical') => {
    const color = colors[status];
    return L.divIcon({
      html: `
        <div style="
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            position: absolute;
            width: 50px;
            height: 50px;
            background: ${color};
            border: 4px solid #000;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          "></div>
          <div style="
            position: relative;
            font-size: 28px;
            z-index: 1;
          ">🚚</div>
        </div>
      `,
      className: '',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25],
    });
  };

  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {visibleVehicles.map((vehicle) => (
        <div key={vehicle.id}>
          {/* Route History Trail */}
          <RouteHistory vehicle={vehicle} />
          
          {/* Vehicle Marker */}
          <Marker
            position={[vehicle.position.lat, vehicle.position.lng]}
            icon={createTruckIcon(vehicle.status)}
            eventHandlers={{
              click: () => onVehicleClick(vehicle.id),
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '150px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚚</div>
                <strong style={{ fontSize: '16px' }}>{vehicle.driverName}</strong>
                <br />
                <span
                  style={{
                    color: colors[vehicle.status],
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  {vehicle.status}
                </span>
                <br />
                <span style={{ fontSize: '14px' }}>
                  Speed: {Math.round(vehicle.currentSpeed)} km/h
                </span>
                <br />
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {vehicle.destination.address}
                </span>
              </div>
            </Popup>
          </Marker>
        </div>
      ))}
    </MapContainer>
  );
}
