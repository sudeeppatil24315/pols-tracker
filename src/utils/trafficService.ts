/**
 * Real-Time Traffic Service
 * Integrates with Mapbox Traffic API for live traffic data
 */

import mbxDirections from '@mapbox/mapbox-sdk/services/directions';

// Get Mapbox token from environment
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

if (!MAPBOX_TOKEN) {
  console.warn('⚠️ Mapbox token not found. Add VITE_MAPBOX_TOKEN to .env file');
}

const directionsClient = mbxDirections({ accessToken: MAPBOX_TOKEN });

export interface TrafficRoute {
  coordinates: [number, number][]; // [lng, lat]
  distance: number; // meters
  duration: number; // seconds
  durationInTraffic: number; // seconds with traffic
  trafficDelay: number; // seconds of delay due to traffic
  congestionLevel: 'low' | 'moderate' | 'heavy' | 'severe';
}

export interface TrafficCondition {
  severity: 'low' | 'moderate' | 'heavy' | 'severe';
  speed: number; // km/h
  delay: number; // minutes
  description: string;
}

/**
 * Get route with real-time traffic data from Mapbox
 */
export async function getRouteWithTraffic(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number }
): Promise<TrafficRoute | null> {
  try {
    const response = await directionsClient
      .getDirections({
        profile: 'driving-traffic', // Use traffic-aware profile
        waypoints: [
          { coordinates: [start.lng, start.lat] },
          { coordinates: [end.lng, end.lat] },
        ],
        geometries: 'geojson',
        overview: 'full',
        annotations: ['duration', 'distance', 'speed', 'congestion'],
      })
      .send();

    if (!response || !response.body || !response.body.routes || response.body.routes.length === 0) {
      console.error('No route found');
      return null;
    }

    const route = response.body.routes[0];
    
    // Calculate traffic delay
    const durationWithoutTraffic = route.duration; // Base duration
    const durationWithTraffic = route.duration_typical || route.duration; // With traffic
    const trafficDelay = durationWithTraffic - durationWithoutTraffic;

    // Determine congestion level
    const congestionLevel = getCongestionLevel(trafficDelay, route.duration);

    console.log('✅ Mapbox route with real-time traffic:', {
      distance: `${(route.distance / 1000).toFixed(1)} km`,
      duration: `${Math.round(route.duration / 60)} min`,
      trafficDelay: `${Math.round(trafficDelay / 60)} min`,
      congestion: congestionLevel,
    });

    return {
      coordinates: route.geometry.coordinates as [number, number][],
      distance: route.distance,
      duration: route.duration,
      durationInTraffic: durationWithTraffic,
      trafficDelay: Math.max(0, trafficDelay),
      congestionLevel,
    };
  } catch (error) {
    console.error('Error fetching Mapbox traffic route:', error);
    return null;
  }
}

/**
 * Get current traffic conditions for a route segment
 */
export function analyzeTrafficConditions(route: TrafficRoute): TrafficCondition {
  const delayMinutes = route.trafficDelay / 60;
  const delayPercentage = (route.trafficDelay / route.duration) * 100;

  let severity: TrafficCondition['severity'];
  let description: string;
  let speed: number;

  if (delayPercentage < 10) {
    severity = 'low';
    description = 'Traffic is flowing smoothly';
    speed = 50;
  } else if (delayPercentage < 25) {
    severity = 'moderate';
    description = 'Moderate traffic, slight delays expected';
    speed = 35;
  } else if (delayPercentage < 50) {
    severity = 'heavy';
    description = 'Heavy traffic, significant delays';
    speed = 20;
  } else {
    severity = 'severe';
    description = 'Severe congestion, major delays';
    speed = 10;
  }

  return {
    severity,
    speed,
    delay: delayMinutes,
    description,
  };
}

/**
 * Determine congestion level based on delay
 */
function getCongestionLevel(delay: number, baseDuration: number): TrafficRoute['congestionLevel'] {
  const delayPercentage = (delay / baseDuration) * 100;

  if (delayPercentage < 10) return 'low';
  if (delayPercentage < 25) return 'moderate';
  if (delayPercentage < 50) return 'heavy';
  return 'severe';
}

/**
 * Get traffic-adjusted speed for a vehicle
 */
export function getTrafficAdjustedSpeed(
  baseSpeed: number,
  trafficCondition: TrafficCondition
): number {
  // Reduce speed based on traffic severity
  const speedMultiplier = {
    low: 1.0,
    moderate: 0.7,
    heavy: 0.4,
    severe: 0.2,
  };

  return Math.max(5, baseSpeed * speedMultiplier[trafficCondition.severity]);
}

/**
 * Get traffic color for visualization
 */
export function getTrafficColor(severity: TrafficCondition['severity']): string {
  const colors = {
    low: '#4CAF50', // Green
    moderate: '#FFC107', // Yellow
    heavy: '#FF9800', // Orange
    severe: '#F44336', // Red
  };

  return colors[severity];
}

/**
 * Simulate traffic conditions (for demo without API key)
 */
export function simulateTrafficConditions(): TrafficCondition {
  const random = Math.random();

  if (random < 0.5) {
    return {
      severity: 'low',
      speed: 50,
      delay: 0,
      description: 'Traffic is flowing smoothly',
    };
  } else if (random < 0.8) {
    return {
      severity: 'moderate',
      speed: 35,
      delay: 5,
      description: 'Moderate traffic, slight delays expected',
    };
  } else if (random < 0.95) {
    return {
      severity: 'heavy',
      speed: 20,
      delay: 15,
      description: 'Heavy traffic, significant delays',
    };
  } else {
    return {
      severity: 'severe',
      speed: 10,
      delay: 30,
      description: 'Severe congestion, major delays',
    };
  }
}

/**
 * Get traffic incidents (accidents, construction, etc.)
 */
export interface TrafficIncident {
  id: string;
  type: 'accident' | 'construction' | 'closure' | 'congestion';
  location: { lat: number; lng: number };
  severity: 'minor' | 'major' | 'critical';
  description: string;
  delay: number; // minutes
}

export function getTrafficIncidents(): TrafficIncident[] {
  // In production, this would fetch from Mapbox Traffic API
  // For demo, return simulated incidents
  return [
    {
      id: '1',
      type: 'accident',
      location: { lat: 12.9716, lng: 77.5946 },
      severity: 'major',
      description: 'Multi-vehicle accident on MG Road',
      delay: 20,
    },
    {
      id: '2',
      type: 'construction',
      location: { lat: 12.9352, lng: 77.6245 },
      severity: 'minor',
      description: 'Road work on Koramangala Main Road',
      delay: 5,
    },
  ];
}
