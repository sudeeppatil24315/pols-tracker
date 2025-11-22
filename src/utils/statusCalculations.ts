import type { Vehicle, Position, StatusCalculation, VehicleStatus } from '../types';

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  point1: Position,
  point2: Position
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Check if vehicle has been stationary (below 8 km/h) for more than 10 minutes
 */
export const checkIfStationary = (vehicle: Vehicle): boolean => {
  // Return false if no status history
  if (!vehicle.statusHistory || vehicle.statusHistory.length === 0) {
    return false;
  }

  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  // Check status history for last 10 minutes
  const recentHistory = vehicle.statusHistory.filter(
    (entry) => entry.timestamp >= tenMinutesAgo
  );

  // Need at least some history to determine if stationary
  if (recentHistory.length < 5) {
    return false;
  }

  // If all recent speeds are below 8 km/h, vehicle is stationary
  return recentHistory.every((entry) => entry.speed < 8);
};

/**
 * Calculate vehicle status based on ETA and current speed
 */
export const calculateVehicleStatus = (vehicle: Vehicle): StatusCalculation => {
  const now = new Date();

  // Calculate remaining distance using Haversine formula
  const remainingDistance = calculateDistance(
    vehicle.position,
    vehicle.destination
  );

  // Default scheduled ETA if not provided (1 hour from now)
  const scheduledETA = vehicle.scheduledETA || new Date(now.getTime() + 60 * 60 * 1000);

  // Time until scheduled ETA in hours
  const timeUntilScheduledETAHours =
    (scheduledETA.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Time until scheduled ETA in minutes (for display)
  const timeUntilScheduledETA = timeUntilScheduledETAHours * 60;

  // Required average speed to arrive on time (km/h)
  // Avoid division by zero and cap at reasonable maximum
  const requiredAverageSpeed =
    timeUntilScheduledETAHours > 0
      ? Math.min(remainingDistance / timeUntilScheduledETAHours, 120) // Cap at 120 km/h
      : 120; // Max speed if time is up

  // Project ETA based on current speed
  // Avoid division by zero
  const hoursToDestination =
    vehicle.currentSpeed > 0
      ? remainingDistance / vehicle.currentSpeed
      : 999;
  
  const projectedETA = new Date(
    now.getTime() + hoursToDestination * 60 * 60 * 1000
  );

  const etaDifferenceMinutes =
    (projectedETA.getTime() - scheduledETA.getTime()) / (1000 * 60);

  // Determine status
  let status: VehicleStatus;

  // Check for critical delay (stationary for 10+ minutes)
  const isStationary = checkIfStationary(vehicle);

  if (isStationary) {
    status = 'critical';
  } else if (vehicle.currentSpeed >= requiredAverageSpeed) {
    status = 'on-time';
  } else if (vehicle.currentSpeed >= 8) {
    status = 'warning';
  } else {
    status = 'critical';
  }

  return {
    vehicleId: vehicle.id,
    remainingDistance,
    timeUntilScheduledETA,
    requiredAverageSpeed,
    currentSpeed: vehicle.currentSpeed,
    status,
    projectedETA,
    etaDifferenceMinutes,
  };
};

/**
 * Calculate new position based on current position, distance, and heading
 */
export const calculateNewPosition = (
  currentPosition: Position,
  distanceKm: number,
  heading: number
): Position => {
  const R = 6371; // Earth's radius in km
  const headingRad = toRadians(heading);

  const lat1 = toRadians(currentPosition.lat);
  const lng1 = toRadians(currentPosition.lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceKm / R) +
      Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(headingRad)
  );

  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(headingRad) * Math.sin(distanceKm / R) * Math.cos(lat1),
      Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2)
    );

  return {
    lat: (lat2 * 180) / Math.PI,
    lng: (lng2 * 180) / Math.PI,
  };
};
