import { Polyline } from 'react-leaflet';
import type { Vehicle } from '../types';

interface RouteHistoryProps {
  vehicle: Vehicle;
}

export default function RouteHistory({ vehicle }: RouteHistoryProps) {
  // Get last 30 minutes of history (450 entries at 4-second intervals)
  const recentHistory = vehicle.statusHistory.slice(-450);

  // Convert history to polyline coordinates
  const pathCoordinates = recentHistory.map((entry) => [
    entry.position.lat,
    entry.position.lng,
  ]) as [number, number][];

  // Add current position
  pathCoordinates.push([vehicle.position.lat, vehicle.position.lng]);

  // Google Maps style route - Standard navigation blue
  const routeColor = '#1976D2'; // Google Maps navigation blue (#1976D2 or #2196F3)

  return (
    <>
      {pathCoordinates.length > 1 && (
        <>
          {/* Outer shadow for depth (Google Maps style) */}
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: '#000000',
              weight: 10,
              opacity: 0.2,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          {/* White border outline */}
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: '#FFFFFF',
              weight: 8,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
          {/* Main blue route line */}
          <Polyline
            positions={pathCoordinates}
            pathOptions={{
              color: routeColor,
              weight: 5,
              opacity: 1,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </>
      )}
    </>
  );
}
