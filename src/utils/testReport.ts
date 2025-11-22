// Test script to verify report generation
// Run this in browser console to test: import('./utils/testReport').then(m => m.testReportGeneration())

import { generateFleetReport } from './reportGenerator';
import type { Vehicle } from '../types';

export const testReportGeneration = () => {
  // Create sample vehicles for testing
  const sampleVehicles: Vehicle[] = [
    {
      id: 'v1',
      driverName: 'Jesse Pinkman',
      position: { lat: 12.9716, lng: 77.5946 },
      destination: {
        lat: 12.9352,
        lng: 77.6245,
        address: 'Koramangala, Bangalore',
      },
      currentSpeed: 45,
      heading: 90,
      scheduledETA: new Date(Date.now() + 30 * 60 * 1000),
      cargoStatus: 'Fresh',
      lastStopTime: null,
      status: 'on-time',
      statusHistory: [],
    },
    {
      id: 'v2',
      driverName: 'Mike Ehrmantraut',
      position: { lat: 12.9784, lng: 77.6408 },
      destination: {
        lat: 12.9698,
        lng: 77.7499,
        address: 'Whitefield, Bangalore',
      },
      currentSpeed: 25,
      heading: 45,
      scheduledETA: new Date(Date.now() + 45 * 60 * 1000),
      cargoStatus: 'Frozen',
      cargoTemperature: 3.5,
      lastStopTime: null,
      status: 'warning',
      statusHistory: [],
    },
    {
      id: 'v3',
      driverName: 'Saul Goodman',
      position: { lat: 12.8456, lng: 77.6603 },
      destination: {
        lat: 12.9716,
        lng: 77.5946,
        address: 'MG Road, Bangalore',
      },
      currentSpeed: 5,
      heading: 180,
      scheduledETA: new Date(Date.now() + 20 * 60 * 1000),
      cargoStatus: 'Mixed',
      cargoTemperature: 4.2,
      lastStopTime: new Date(Date.now() - 15 * 60 * 1000),
      status: 'critical',
      statusHistory: [],
    },
  ];

  console.log('Generating test report with', sampleVehicles.length, 'vehicles...');
  const filename = generateFleetReport(sampleVehicles);
  console.log('Report generated:', filename);
  return filename;
};
