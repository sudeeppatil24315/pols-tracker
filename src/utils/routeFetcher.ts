import type { Vehicle, Position } from '../types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * Fetch route from Mapbox Directions API
 */
export async function fetchRouteForVehicle(vehicle: Vehicle): Promise<Position[] | null> {
  if (!vehicle.destination || !MAPBOX_TOKEN) {
    return null;
  }

  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${vehicle.position.lng},${vehicle.position.lat};${vehicle.destination.lng},${vehicle.destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const routeGeometry = data.routes[0].geometry;
      
      // Convert route coordinates to Position array
      const routePositions: Position[] = routeGeometry.coordinates.map((coord: [number, number]) => ({
        lng: coord[0],
        lat: coord[1]
      }));
      
      console.log(`🛣️ Route fetched for ${vehicle.id}: ${routePositions.length} points`);
      return routePositions;
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch route for ${vehicle.id}:`, error);
    return null;
  }
}

/**
 * Fetch routes for all vehicles
 */
export async function fetchRoutesForVehicles(vehicles: Vehicle[]): Promise<Vehicle[]> {
  const vehiclesWithRoutes = await Promise.all(
    vehicles.map(async (vehicle) => {
      if (!vehicle.route || vehicle.route.length === 0) {
        const route = await fetchRouteForVehicle(vehicle);
        if (route) {
          return { ...vehicle, route };
        }
      }
      return vehicle;
    })
  );
  
  return vehiclesWithRoutes;
}
