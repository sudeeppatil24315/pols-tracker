import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Driver from './models/Driver.js';
import Job from './models/Job.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/los-pollos-tracker';

// Bangalore locations for realistic data
const bangaloreLocations = [
  { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
  { name: 'Indiranagar', lat: 12.9716, lng: 77.6412 },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
  { name: 'Electronic City', lat: 12.8456, lng: 77.6603 },
  { name: 'Jayanagar', lat: 12.9250, lng: 77.5838 },
  { name: 'Malleshwaram', lat: 13.0039, lng: 77.5710 },
  { name: 'BTM Layout', lat: 12.9165, lng: 77.6101 },
  { name: 'HSR Layout', lat: 12.9116, lng: 77.6473 },
  { name: 'Marathahalli', lat: 12.9591, lng: 77.6974 },
  { name: 'Bannerghatta Road', lat: 12.8898, lng: 77.5958 },
  { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
  { name: 'Hebbal', lat: 13.0358, lng: 77.5970 },
  { name: 'MG Road', lat: 12.9759, lng: 77.6061 },
  { name: 'Rajajinagar', lat: 12.9915, lng: 77.5544 },
  { name: 'JP Nagar', lat: 12.9081, lng: 77.5855 },
];

// Driver names
const driverNames = [
  'Jesse Pinkman',
  'Rajesh Kumar',
  'Suresh Patel',
  'Amit Singh',
  'Vijay Sharma',
  'Prakash Reddy',
  'Ramesh Rao',
  'Anil Kumar',
  'Sanjay Gupta',
  'Manoj Verma',
  'Ravi Shankar',
  'Deepak Joshi',
  'Ashok Nair',
  'Kiran Desai',
  'Naveen Kumar',
];

// Vehicle makes and models
const vehicles = [
  { make: 'Tata', model: 'Ace', type: 'Van', capacity: 750 },
  { make: 'Mahindra', model: 'Bolero Pickup', type: 'Truck', capacity: 1000 },
  { make: 'Ashok Leyland', model: 'Dost', type: 'Truck', capacity: 1200 },
  { make: 'Tata', model: '407', type: 'Truck', capacity: 2500 },
  { make: 'Eicher', model: 'Pro 1049', type: 'Truck', capacity: 1500 },
  { make: 'Mahindra', model: 'Supro', type: 'Van', capacity: 800 },
  { make: 'Force', model: 'Traveller', type: 'Van', capacity: 900 },
  { make: 'Tata', model: 'Super Ace', type: 'Van', capacity: 850 },
];

// Cargo types
const cargoTypes = ['Fresh', 'Frozen', 'Mixed'];

// Generate random location
function getRandomLocation() {
  return bangaloreLocations[Math.floor(Math.random() * bangaloreLocations.length)];
}

// Generate random phone number
function generatePhone() {
  return `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`;
}

// Generate random license number
function generateLicense() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = Math.floor(Math.random() * 9000000) + 1000000;
  return `KA${Math.floor(Math.random() * 100)}${letters[Math.floor(Math.random() * 26)]}${letters[Math.floor(Math.random() * 26)]}${nums}`;
}

// Generate random registration number
function generateRegistration() {
  const nums = Math.floor(Math.random() * 9000) + 1000;
  return `KA-${Math.floor(Math.random() * 60) + 1}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${nums}`;
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Create drivers
async function createDrivers() {
  const drivers = [];
  
  for (let i = 0; i < 15; i++) {
    const vehicleInfo = vehicles[Math.floor(Math.random() * vehicles.length)];
    const currentYear = new Date().getFullYear();
    const vehicleYear = currentYear - Math.floor(Math.random() * 8);
    
    // Hash password for driver
    const hashedPassword = await bcrypt.hash('driver123', 10);
    
    const driver = {
      name: driverNames[i],
      email: `${driverNames[i].toLowerCase().replace(' ', '.')}@lospollos.com`,
      password: hashedPassword,
      phone: generatePhone(),
      licenseNumber: generateLicense(),
      vehicleId: `VEH-${String(i + 1).padStart(3, '0')}`,
      vehicleDetails: {
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        year: vehicleYear,
        type: vehicleInfo.type,
        registrationNumber: generateRegistration(),
        currentOdometer: Math.floor(Math.random() * 100000) + 20000,
        fuelType: ['Diesel', 'Petrol', 'Electric'][Math.floor(Math.random() * 3)],
        capacity: vehicleInfo.capacity,
        lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        nextMaintenanceDue: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
      },
      status: 'on-duty',
      rating: 4.0 + Math.random() * 1.0,
      totalDeliveries: Math.floor(Math.random() * 200) + 50,
      totalDistanceCovered: Math.floor(Math.random() * 10000) + 2000,
      onTimeDeliveryRate: 85 + Math.random() * 15,
      totalEarnings: Math.floor(Math.random() * 100000) + 20000,
      currentMonthEarnings: Math.floor(Math.random() * 15000) + 3000,
      pendingEarnings: Math.floor(Math.random() * 5000) + 500,
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastActiveDate: new Date(),
    };
    
    drivers.push(driver);
  }
  
  return await Driver.insertMany(drivers);
}

// Create jobs and assign to drivers
async function createJobs(drivers) {
  const jobs = [];
  const now = new Date();
  
  // Create 10-12 active jobs (assigned to drivers)
  for (let i = 0; i < 12; i++) {
    const driver = drivers[i];
    const pickup = getRandomLocation();
    const delivery = getRandomLocation();
    const distance = calculateDistance(pickup.lat, pickup.lng, delivery.lat, delivery.lng);
    const duration = (distance / 40) + (Math.random() * 0.5); // Average 40 km/h + random
    const cargoWeight = Math.floor(Math.random() * (driver.vehicleDetails.capacity - 100)) + 100;
    const payment = Math.floor(distance * 50) + Math.floor(cargoWeight * 2) + Math.floor(Math.random() * 500);
    
    const pickupTime = new Date(now.getTime() - Math.random() * 2 * 60 * 60 * 1000); // Started 0-2 hours ago
    const deliveryTime = new Date(pickupTime.getTime() + duration * 60 * 60 * 1000);
    
    const job = {
      title: `Delivery to ${delivery.name}`,
      description: `Pick up from ${pickup.name} and deliver to ${delivery.name}`,
      pickupLocation: {
        address: `${pickup.name}, Bangalore`,
        position: { lat: pickup.lat, lng: pickup.lng }
      },
      deliveryLocation: {
        address: `${delivery.name}, Bangalore`,
        position: { lat: delivery.lat, lng: delivery.lng }
      },
      cargoType: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
      cargoWeight,
      estimatedDistance: distance,
      estimatedDuration: duration,
      payment,
      priority: ['medium', 'high', 'urgent'][Math.floor(Math.random() * 3)],
      status: 'in-progress',
      pickupTime,
      deliveryTime,
      assignedDriverId: driver._id.toString(),
      assignedDriverName: driver.name,
      startedAt: pickupTime,
      createdBy: 'admin',
      createdAt: new Date(pickupTime.getTime() - 30 * 60 * 1000), // Created 30 min before pickup
    };
    
    jobs.push(job);
    
    // Add to driver's active jobs
    await Driver.findByIdAndUpdate(driver._id, {
      $push: {
        activeJobs: {
          jobId: '', // Will be updated after job creation
          title: job.title,
          pickupTime: job.pickupTime,
          deliveryTime: job.deliveryTime,
          status: 'in-progress',
          startedAt: job.startedAt,
        }
      }
    });
  }
  
  // Create 5-8 available jobs (not assigned)
  for (let i = 0; i < 8; i++) {
    const pickup = getRandomLocation();
    const delivery = getRandomLocation();
    const distance = calculateDistance(pickup.lat, pickup.lng, delivery.lat, delivery.lng);
    const duration = (distance / 40) + (Math.random() * 0.5);
    const cargoWeight = Math.floor(Math.random() * 800) + 200;
    const payment = Math.floor(distance * 50) + Math.floor(cargoWeight * 2) + Math.floor(Math.random() * 500);
    
    const pickupTime = new Date(now.getTime() + Math.random() * 4 * 60 * 60 * 1000); // 0-4 hours from now
    const deliveryTime = new Date(pickupTime.getTime() + duration * 60 * 60 * 1000);
    
    const job = {
      title: `Delivery to ${delivery.name}`,
      description: `Pick up from ${pickup.name} and deliver to ${delivery.name}`,
      pickupLocation: {
        address: `${pickup.name}, Bangalore`,
        position: { lat: pickup.lat, lng: pickup.lng }
      },
      deliveryLocation: {
        address: `${delivery.name}, Bangalore`,
        position: { lat: delivery.lat, lng: delivery.lng }
      },
      cargoType: cargoTypes[Math.floor(Math.random() * cargoTypes.length)],
      cargoWeight,
      estimatedDistance: distance,
      estimatedDuration: duration,
      payment,
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      status: 'available',
      pickupTime,
      deliveryTime,
      createdBy: 'admin',
      createdAt: new Date(now.getTime() - Math.random() * 60 * 60 * 1000), // Created in last hour
    };
    
    jobs.push(job);
  }
  
  const createdJobs = await Job.insertMany(jobs);
  
  // Update driver active jobs with actual job IDs
  for (let i = 0; i < 12; i++) {
    const driver = drivers[i];
    const job = createdJobs[i];
    
    await Driver.findByIdAndUpdate(driver._id, {
      'activeJobs.0.jobId': job._id.toString()
    });
  }
  
  return createdJobs;
}

// Main seed function
async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Driver.deleteMany({});
    await Job.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create drivers
    console.log('👥 Creating drivers...');
    const drivers = await createDrivers();
    console.log(`✅ Created ${drivers.length} drivers`);
    
    // Create jobs
    console.log('📦 Creating jobs...');
    const jobs = await createJobs(drivers);
    console.log(`✅ Created ${jobs.length} jobs`);
    
    // Summary
    console.log('\n📊 Seed Summary:');
    console.log(`   Drivers: ${drivers.length}`);
    console.log(`   Active Jobs: ${jobs.filter(j => j.status === 'in-progress').length}`);
    console.log(`   Available Jobs: ${jobs.filter(j => j.status === 'available').length}`);
    console.log(`   Total Jobs: ${jobs.length}`);
    
    console.log('\n✨ Database seeded successfully!');
    console.log('🚀 You can now start the server and see live data on the map\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seed();
