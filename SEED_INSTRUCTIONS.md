# Database Seed Instructions

## Overview
The seed file populates your database with realistic demo data including drivers, vehicles, and active jobs. This creates a live, dynamic map view with moving trucks.

## What Gets Created

### 15 Drivers
- Realistic Indian names
- Complete vehicle details (Tata, Mahindra, Ashok Leyland, etc.)
- Vehicle capacities ranging from 750kg to 2500kg
- Random performance metrics (ratings, deliveries, earnings)
- Proper license numbers and registration plates

### 12 Active Jobs (In Progress)
- Assigned to first 12 drivers
- Jobs started 0-2 hours ago
- Realistic Bangalore locations (Koramangala, Whitefield, etc.)
- Calculated distances and durations
- Cargo weights within vehicle capacity
- Payment based on distance and weight

### 8 Available Jobs
- Not yet assigned to any driver
- Ready for drivers to pick up
- Scheduled for next 0-4 hours
- Various cargo types (Fresh, Frozen, Mixed)

## How to Run

### Step 1: Ensure MongoDB is Running
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# On macOS with Homebrew:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
net start MongoDB
```

### Step 2: Run the Seed Script
```bash
cd los-pollos-tracker
npm run seed
```

### Expected Output:
```
🌱 Starting database seed...
✅ Connected to MongoDB
🗑️  Clearing existing data...
✅ Existing data cleared
👥 Creating drivers...
✅ Created 15 drivers
📦 Creating jobs...
✅ Created 20 jobs

📊 Seed Summary:
   Drivers: 15
   Active Jobs: 12
   Available Jobs: 8
   Total Jobs: 20

✨ Database seeded successfully!
🚀 You can now start the server and see live data on the map
```

### Step 3: Start the Application
```bash
# Terminal 1 - Start backend server
npm run server:dev

# Terminal 2 - Start frontend
npm run dev
```

### Step 4: Login and View
1. Open http://localhost:5173
2. Login as admin:
   - Email: `admin@lospollos.com`
   - Password: `admin123`
3. You should see 12 trucks moving on the map!

## What You'll See

### Admin Dashboard
- **Map**: 12 vehicles moving between Bangalore locations
- **Fleet Status**: Real-time counts (Total, On-Time, Warning, Critical)
- **All Jobs Panel**: 20 jobs (12 in-progress, 8 available)
- **Live Tracking**: Vehicles following routes with GPS simulation

### Driver Dashboard (Login as any driver)
- **Active Jobs**: Your assigned job with progress
- **Available Jobs**: 8 jobs you can take
- **Profile**: Your stats and earnings
- **Vehicle**: Your truck details

## Sample Driver Logins
```
Email: rajesh.kumar@lospollos.com
Email: suresh.patel@lospollos.com
Email: amit.singh@lospollos.com
... (all 15 drivers)

Password: driver123 (for all drivers)
```

## Re-seeding
To clear and re-seed the database:
```bash
npm run seed
```

This will:
1. Delete all existing drivers and jobs
2. Create fresh data with new random values
3. Generate new vehicle positions and routes

## Troubleshooting

### "Connection refused" error
- Make sure MongoDB is running
- Check connection string in `.env` file

### "No vehicles on map"
- Refresh the page after seeding
- Check browser console for errors
- Verify jobs were created: `mongosh` → `use los-pollos-tracker` → `db.jobs.find()`

### "Vehicles not moving"
- GPS simulation starts automatically
- Check that jobs have `status: 'in-progress'`
- Verify WebSocket connection in browser console

## Database Structure

### Collections Created:
1. **drivers** - 15 driver documents
2. **jobs** - 20 job documents

### Sample Driver Document:
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh.kumar@lospollos.com",
  "vehicleDetails": {
    "make": "Tata",
    "model": "Ace",
    "capacity": 750,
    "registrationNumber": "KA-01-AB-1234"
  },
  "status": "on-duty",
  "totalEarnings": 45000,
  "activeJobs": [...]
}
```

### Sample Job Document:
```json
{
  "title": "Delivery to Whitefield",
  "status": "in-progress",
  "assignedDriverId": "...",
  "assignedDriverName": "Rajesh Kumar",
  "pickupLocation": {
    "address": "Koramangala, Bangalore",
    "position": { "lat": 12.9352, "lng": 77.6245 }
  },
  "deliveryLocation": {
    "address": "Whitefield, Bangalore",
    "position": { "lat": 12.9698, "lng": 77.7499 }
  },
  "payment": 850
}
```

## Next Steps

After seeding:
1. ✅ View live map with 12 moving trucks
2. ✅ Click on trucks to see driver details
3. ✅ Create new jobs from admin panel
4. ✅ Login as driver and take available jobs
5. ✅ Complete jobs and see earnings update
6. ✅ Export fleet reports

Enjoy your fully populated Los Pollos Tracker! 🐔🚚
