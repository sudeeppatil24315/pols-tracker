import type { Vehicle } from '../types';
import { getRouteWithTraffic } from './trafficService';

interface RouteCache {
  [vehicleId: string]: {
    coordinates: [number, number][]; // [lng, lat]
    currentIndex: number;
    lastUpdate: number;
  };
}

const routeCache: RouteCache = {};

/**
 * Initialize route for a vehicle using Mapbox with real-time traffic
 */
export async function initializeVehicleRoute(vehicle: Vehicle): Promise<void> {
  try {
    const route = await getRouteWithTraffic(
      { lat: vehicle.position.lat, lng: vehicle.position.lng },
      { lat: vehicle.destination.lat, lng: vehicle.destination.lng }
    );

    if (route && route.coordinates.length > 0) {
      routeCache[vehicle.id] = {
        coordinates: route.coordinates,
        currentIndex: 0,
        lastUpdate: Date.now(),
      };
      console.log(`✅ Route initialized for ${vehicle.driverName}: ${route.coordinates.length} points, ${(route.distance / 1000).toFixed(1)}km, traffic delay: ${Math.round(route.trafficDelay / 60)}min`);
    } else {
      console.warn(`⚠️ Could not get route for ${vehicle.driverName}, using direct movement`);
    }
  } catch (error) {
    console.error(`Error initializing route for ${vehicle.id}:`, error);
  }
}

/**
 * Get next position along the road route
 */
export function getNextRoadPosition(vehicle: Vehicle): { lat: number; lng: number } | null {
  const cached = routeCache[vehicle.id];

  if (!cached || !cached.coordinates || cached.coordinates.length === 0) {
    return null; // No route available, will use direct movement
  }

  // Calculate how far to move based on speed (4 second intervals)
  const speedKmh = vehicle.currentSpeed;
  const speedMs = (speedKmh * 1000) / 3600; // meters per second
  const distanceToMove = speedMs * 4; // 4 second interval

  // Move along route points
  let remainingDistance = distanceToMove;
  let currentIndex = cached.currentIndex;

  while (remainingDistance > 0 && currentIndex < cached.coordinates.length - 1) {
    const current = cached.coordinates[currentIndex];
    const next = cached.coordinates[currentIndex + 1];

    // Calculate distance between current and next point
    const segmentDistance = calculateDistance(
      { lat: current[1], lng: current[0] },
      { lat: next[1], lng: next[0] }
    );

    if (remainingDistance >= segmentDistance) {
      // Move to next point
      remainingDistance -= segmentDistance;
      currentIndex++;
    } else {
      // Interpolate between current and next point
      const ratio = remainingDistance / segmentDistance;
      const interpolatedLng = current[0] + (next[0] - current[0]) * ratio;
      const interpolatedLat = current[1] + (next[1] - current[1]) * ratio;

      // Update cache
      routeCache[vehicle.id].currentIndex = currentIndex;
      routeCache[vehicle.id].lastUpdate = Date.now();

      return {
        lat: interpolatedLat,
        lng: interpolatedLng,
      };
    }
  }

  // Reached end of route or close to destination
  if (currentIndex >= cached.coordinates.length - 1) {
    // Reached destination, reinitialize route
    delete routeCache[vehicle.id];
    return {
      lat: vehicle.destination.lat,
      lng: vehicle.destination.lng,
    };
  }

  // Update cache
  routeCache[vehicle.id].currentIndex = currentIndex;
  routeCache[vehicle.id].lastUpdate = Date.now();

  const finalPoint = cached.coordinates[currentIndex];
  return {
    lat: finalPoint[1],
    lng: finalPoint[0],
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Clear route cache for a vehicle
 */
export function clearVehicleRoute(vehicleId: string): void {
  delete routeCache[vehicleId];
}

/**
 * Get route progress percentage
 */
export function getRouteProgress(vehicleId: string): number {
  const cached = routeCache[vehicleId];
  if (!cached || !cached.coordinates) return 0;

  return (cached.currentIndex / cached.coordinates.length) * 100;
}
