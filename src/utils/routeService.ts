/**
 * Route Service - Get road-based routes using OSRM
 * Free, no API key required
 */

interface RoutePoint {
  lat: number;
  lng: number;
}

interface RouteResponse {
  coordinates: [number, number][]; // [lng, lat] format
  distance: number; // in meters
  duration: number; // in seconds
}

/**
 * Get route between two points using OSRM (Open Source Routing Machine)
 * Uses public OSRM server - free and no API key needed
 */
export async function getRoute(
  start: RoutePoint,
  end: RoutePoint
): Promise<RouteResponse | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('OSRM API error:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('No route found');
      return null;
    }
    
    const route = data.routes[0];
    
    return {
      coordinates: route.geometry.coordinates, // [lng, lat] pairs
      distance: route.distance, // meters
      duration: route.duration, // seconds
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

/**
 * Get route with multiple waypoints
 */
export async function getRouteWithWaypoints(
  points: RoutePoint[]
): Promise<RouteResponse | null> {
  try {
    const coordinates = points.map(p => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('OSRM API error:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('No route found');
      return null;
    }
    
    const route = data.routes[0];
    
    return {
      coordinates: route.geometry.coordinates,
      distance: route.distance,
      duration: route.duration,
    };
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

/**
 * Snap a point to the nearest road
 */
export async function snapToRoad(point: RoutePoint): Promise<RoutePoint | null> {
  try {
    const url = `https://router.project-osrm.org/nearest/v1/driving/${point.lng},${point.lat}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.waypoints || data.waypoints.length === 0) {
      return null;
    }
    
    const snapped = data.waypoints[0].location;
    
    return {
      lng: snapped[0],
      lat: snapped[1],
    };
  } catch (error) {
    console.error('Error snapping to road:', error);
    return null;
  }
}

/**
 * Calculate distance between two points along roads (not straight line)
 */
export async function getRoadDistance(
  start: RoutePoint,
  end: RoutePoint
): Promise<number | null> {
  const route = await getRoute(start, end);
  return route ? route.distance / 1000 : null; // Convert to km
}
