// Random job generator for testing and demo purposes

const JOB_TITLES = [
  'Fresh Produce Delivery',
  'Frozen Goods Transport',
  'Mixed Cargo Delivery',
  'Restaurant Supply Run',
  'Grocery Store Delivery',
  'Bakery Goods Transport',
  'Dairy Products Delivery',
  'Meat & Poultry Transport',
  'Seafood Delivery',
  'Beverage Distribution',
  'Pharmaceutical Supplies',
  'Catering Service Delivery',
];

const DESCRIPTIONS = [
  'Urgent delivery required for fresh inventory',
  'Temperature-controlled transport needed',
  'Handle with care - fragile items',
  'Time-sensitive delivery for business operations',
  'Regular supply route delivery',
  'Special order for premium customer',
  'Bulk delivery for wholesale client',
  'Express delivery service',
  'Standard delivery with signature required',
  'Priority shipment for restaurant chain',
];

// Bangalore area coordinates (approximate boundaries)
const BANGALORE_BOUNDS = {
  minLat: 12.85,
  maxLat: 13.15,
  minLng: 77.45,
  maxLng: 77.75,
};

const BANGALORE_LOCATIONS = [
  { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
  { name: 'Indiranagar', lat: 12.9716, lng: 77.6412 },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
  { name: 'Electronic City', lat: 12.8456, lng: 77.6603 },
  { name: 'Marathahalli', lat: 12.9591, lng: 77.6974 },
  { name: 'HSR Layout', lat: 12.9121, lng: 77.6446 },
  { name: 'BTM Layout', lat: 12.9165, lng: 77.6101 },
  { name: 'Jayanagar', lat: 12.9250, lng: 77.5838 },
  { name: 'Malleshwaram', lat: 12.9899, lng: 77.5703 },
  { name: 'Rajajinagar', lat: 12.9915, lng: 77.5544 },
  { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
  { name: 'Banashankari', lat: 12.9250, lng: 77.5482 },
  { name: 'JP Nagar', lat: 12.9077, lng: 77.5854 },
  { name: 'Hebbal', lat: 13.0358, lng: 77.5970 },
  { name: 'Sarjapur Road', lat: 12.9010, lng: 77.6874 },
  { name: 'Bellandur', lat: 12.9259, lng: 77.6784 },
  { name: 'MG Road', lat: 12.9716, lng: 77.5946 },
  { name: 'Cunningham Road', lat: 12.9897, lng: 77.5980 },
  { name: 'Richmond Town', lat: 12.9698, lng: 77.6025 },
  { name: 'Frazer Town', lat: 12.9897, lng: 77.6197 },
];

const CARGO_TYPES: ('Fresh' | 'Frozen' | 'Mixed')[] = ['Fresh', 'Frozen', 'Mixed'];

const PRIORITIES: ('low' | 'medium' | 'high' | 'urgent')[] = ['low', 'medium', 'high', 'urgent'];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomNumber(min, max));
}

function getRandomLocation() {
  const location = randomElement(BANGALORE_LOCATIONS);
  // Add small random offset to make each location unique
  return {
    name: location.name,
    lat: location.lat + randomNumber(-0.01, 0.01),
    lng: location.lng + randomNumber(-0.01, 0.01),
  };
}

function generateAddress(locationName: string): string {
  const streetNumber = randomInt(1, 999);
  const streets = [
    'Main Road',
    'Cross Road',
    '1st Block',
    '2nd Block',
    '3rd Block',
    'Outer Ring Road',
    'Inner Ring Road',
    'Service Road',
    'Layout',
    'Extension',
  ];
  
  return `${streetNumber} ${randomElement(streets)}, ${locationName}, Bangalore, 560${randomInt(10, 99)}`;
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function generateRandomJob() {
  const pickupLocation = getRandomLocation();
  const deliveryLocation = getRandomLocation();
  
  const distance = calculateDistance(
    pickupLocation.lat,
    pickupLocation.lng,
    deliveryLocation.lat,
    deliveryLocation.lng
  );
  
  const cargoType = randomElement(CARGO_TYPES);
  const cargoWeight = randomInt(50, 500);
  const priority = randomElement(PRIORITIES);
  
  // Duration based on distance (assuming average speed of 25 km/h in city traffic)
  const duration = distance / 25;
  
  // Payment calculation
  const basePayment = (distance * 10) + (cargoWeight * 2) + (duration * 50);
  const priorityMultiplier = {
    low: 1.0,
    medium: 1.2,
    high: 1.5,
    urgent: 2.0,
  };
  const payment = Math.round(basePayment * priorityMultiplier[priority]);
  
  // Pickup time: random time between now and 2 hours from now
  const pickupTime = new Date(Date.now() + randomInt(10, 120) * 60 * 1000);
  
  // Delivery time: pickup time + estimated duration + buffer
  const deliveryTime = new Date(pickupTime.getTime() + (duration * 60 * 60 * 1000) + (30 * 60 * 1000));
  
  return {
    title: randomElement(JOB_TITLES),
    description: randomElement(DESCRIPTIONS),
    pickupLocation: {
      address: generateAddress(pickupLocation.name),
      position: {
        lat: pickupLocation.lat,
        lng: pickupLocation.lng,
      },
    },
    deliveryLocation: {
      address: generateAddress(deliveryLocation.name),
      position: {
        lat: deliveryLocation.lat,
        lng: deliveryLocation.lng,
      },
    },
    cargoType,
    cargoWeight,
    estimatedDistance: parseFloat(distance.toFixed(1)),
    estimatedDuration: parseFloat(duration.toFixed(1)),
    payment,
    priority,
    pickupTime,
    deliveryTime,
    createdBy: 'system',
  };
}

export function generateMultipleJobs(count: number) {
  const jobs = [];
  for (let i = 0; i < count; i++) {
    jobs.push(generateRandomJob());
  }
  return jobs;
}
