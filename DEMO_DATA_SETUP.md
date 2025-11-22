# 🚚 Demo Data Setup - Complete Guide

## What This Does

Creates a **fully functional demo** with:
- ✅ 15 drivers with realistic Indian names and vehicles
- ✅ 12 active jobs (trucks moving on map)
- ✅ 8 available jobs (ready to be taken)
- ✅ Real-time GPS simulation
- ✅ WebSocket updates
- ✅ Complete database integration

## Quick Start (3 Steps)

### 1. Run the Setup Script
```bash
cd los-pollos-tracker
./setup-demo.sh
```

### 2. Start the Servers
```bash
# Terminal 1 - Backend
npm run server:dev

# Terminal 2 - Frontend  
npm run dev
```

### 3. Login and View
- Open: http://localhost:5173
- Login: `admin@lospollos.com` / `admin123`
- **See 12 trucks moving on the map!** 🎉

## What You Get

### 🗺️ Live Map View
- 12 vehicles actively delivering
- Real-time position updates
- Color-coded status (green/yellow/red)
- Click any truck to see driver details
- Routes displayed on map

### 👥 15 Realistic Drivers
```
Rajesh Kumar    - Tata Ace (750kg)
Suresh Patel    - Mahindra Bolero (1000kg)
Amit Singh      - Ashok Leyland Dost (1200kg)
Vijay Sharma    - Tata 407 (2500kg)
... and 11 more
```

### 📦 20 Jobs
**12 In Progress:**
- Assigned to drivers
- Started 0-2 hours ago
- Vehicles moving on map
- Real-time tracking

**8 Available:**
- Ready for drivers to take
- Scheduled for next 0-4 hours
- Various cargo types

### 📍 Bangalore Locations
All jobs use real Bangalore areas:
- Koramangala
- Whitefield
- Indiranagar
- Electronic City
- HSR Layout
- BTM Layout
- Marathahalli
- And more...

## Features Demonstrated

### Admin Dashboard
1. **Fleet Overview**
   - Total vehicles: 12
   - On-Time: ~8-10
   - Warning: ~1-2
   - Critical: ~0-1

2. **Live Map**
   - Real-time vehicle tracking
   - Route visualization
   - Status indicators
   - Click for details

3. **All Jobs Panel**
   - Filter by status
   - Search functionality
   - Job details
   - Driver assignments

4. **Create New Jobs**
   - Map picker for locations
   - Auto-distance calculation
   - Payment calculation
   - Immediate availability

### Driver Dashboard
Login as any driver to see:
1. **Active Job Progress**
   - Elapsed time
   - Required time
   - Progress bar
   - Complete button (when ready)

2. **Available Jobs**
   - Filtered by vehicle capacity
   - Time conflict checking
   - Weight validation
   - Take job button

3. **Earnings & History**
   - Total earnings
   - Monthly earnings
   - Job history
   - Ratings

## Database Details

### Drivers Collection (15 documents)
```javascript
{
  name: "Rajesh Kumar",
  email: "rajesh.kumar@lospollos.com",
  phone: "+91 9876543210",
  licenseNumber: "KA12AB1234567",
  vehicleDetails: {
    make: "Tata",
    model: "Ace",
    type: "Van",
    capacity: 750,
    registrationNumber: "KA-01-AB-1234",
    currentOdometer: 45000,
    fuelType: "Diesel"
  },
  status: "on-duty",
  rating: 4.5,
  totalDeliveries: 150,
  totalEarnings: 45000,
  currentMonthEarnings: 8500,
  activeJobs: [{ jobId: "...", title: "...", ... }]
}
```

### Jobs Collection (20 documents)
```javascript
{
  title: "Delivery to Whitefield",
  status: "in-progress",
  assignedDriverId: "...",
  assignedDriverName: "Rajesh Kumar",
  pickupLocation: {
    address: "Koramangala, Bangalore",
    position: { lat: 12.9352, lng: 77.6245 }
  },
  deliveryLocation: {
    address: "Whitefield, Bangalore",
    position: { lat: 12.9698, lng: 77.7499 }
  },
  cargoType: "Fresh",
  cargoWeight: 500,
  estimatedDistance: 15.2,
  estimatedDuration: 0.8,
  payment: 850,
  priority: "high",
  pickupTime: "2024-01-15T10:30:00Z",
  deliveryTime: "2024-01-15T11:18:00Z",
  startedAt: "2024-01-15T10:30:00Z"
}
```

## WebSocket Integration

The seed data works seamlessly with WebSockets:

### Events Emitted:
- `job:created` - When new jobs are created
- `job:assigned` - When driver takes a job
- `job:started` - When delivery begins
- `job:completed` - When delivery finishes
- `vehicle:updated` - Real-time position updates

### Who Receives:
- **Admins**: See all updates on map
- **Drivers**: See relevant job updates
- **Real-time**: No page refresh needed

## Testing Scenarios

### Scenario 1: View Live Fleet
1. Login as admin
2. See 12 trucks on map
3. Click any truck
4. View driver details and route

### Scenario 2: Driver Takes Job
1. Login as driver (e.g., `naveen.kumar@lospollos.com`)
2. View 8 available jobs
3. Click "Take Job"
4. See job in "My Active Jobs"
5. Admin sees new truck on map

### Scenario 3: Complete Delivery
1. Login as driver with active job
2. Wait for progress to reach 100%
3. Click "Complete Delivery"
4. See earnings updated
5. Job moves to history
6. Can take new jobs

### Scenario 4: Create New Job
1. Login as admin
2. Click "New Job"
3. Pick locations on map
4. Distance auto-calculated
5. Job appears in available jobs
6. Any driver can take it

## Re-seeding

To get fresh data:
```bash
npm run seed
```

This will:
- Clear all existing data
- Create 15 new drivers
- Create 20 new jobs
- Generate new random values

## Troubleshooting

### No vehicles on map?
```bash
# 1. Check if seed ran successfully
npm run seed

# 2. Verify data in MongoDB
mongosh
use los-pollos-tracker
db.jobs.find({ status: "in-progress" }).count()
# Should return 12

# 3. Restart servers
# Kill both terminals and restart
```

### Vehicles not moving?
- GPS simulation starts automatically
- Check browser console for errors
- Verify WebSocket connection
- Refresh the page

### Can't login as driver?
All drivers use password: `driver123`
Emails follow pattern: `firstname.lastname@lospollos.com`

Example:
- `rajesh.kumar@lospollos.com`
- `suresh.patel@lospollos.com`
- `amit.singh@lospollos.com`

## Manual Seed (Alternative)

If the script doesn't work:
```bash
cd los-pollos-tracker
node server/seed.js
```

## What Makes This Realistic

1. **Indian Context**
   - Indian driver names
   - Bangalore locations
   - Indian vehicle brands (Tata, Mahindra, Ashok Leyland)
   - KA registration plates
   - Rupee currency

2. **Realistic Calculations**
   - Distance: Haversine formula
   - Duration: Based on 40 km/h average
   - Payment: Distance + weight based
   - Cargo weight: Within vehicle capacity

3. **Time-based Logic**
   - Jobs started in past (0-2 hours ago)
   - Available jobs in future (0-4 hours)
   - Progress tracking
   - Completion validation

4. **Database Relationships**
   - Jobs reference drivers
   - Drivers have active jobs
   - Earnings auto-calculated
   - History maintained

## Production Considerations

This seed is for **demo purposes only**. For production:

1. Remove seed script
2. Implement proper authentication
3. Add data validation
4. Set up backups
5. Use environment-specific configs
6. Add monitoring and logging

## Summary

✅ **15 drivers** with complete profiles
✅ **12 active jobs** with moving trucks
✅ **8 available jobs** ready to take
✅ **Real-time updates** via WebSocket
✅ **GPS simulation** for movement
✅ **Complete database** integration
✅ **Realistic data** for Bangalore

**Result**: A fully functional fleet management system with live data! 🚀

Run `./setup-demo.sh` and see it in action! 🎉
