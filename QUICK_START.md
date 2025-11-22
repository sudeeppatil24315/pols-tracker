# Los Pollos Tracker - Quick Start Guide

## ✅ Current Status

Both servers are now running:
- **Backend API**: http://localhost:5001 ✅
- **Frontend**: http://localhost:5173 ✅
- **MongoDB**: Running on port 27017 ✅

> **Note**: Port 5001 is used instead of 5000 because macOS AirPlay Receiver uses port 5000.

## 🚀 How to Use

### 1. Login
- **Admin**: username: `admin`, password: `gus123`
- **Driver**: username: `driver`, password: `driver123`

### 2. Register Drivers (Admin Only)
1. Login as admin
2. Click **"Add Driver"** button in the navigation bar
3. Fill in driver details:
   - Full Name
   - Email
   - Phone Number
   - License Number
4. Click **"Register Driver"**

### 3. Create Delivery Tasks (Admin Only)
1. Click **"New Task"** button
2. Select a driver from the dropdown (only available drivers shown)
3. Enter starting location (latitude/longitude)
4. Enter destination (latitude/longitude + address)
5. Select cargo type (Fresh/Frozen/Mixed)
6. Enter estimated duration in hours
7. Click **"Create Task"**

The driver's status will automatically change to "on-duty" and the vehicle will appear on the map!

### 4. Track Vehicles
- View all vehicles on the map with real-time GPS updates
- Click on any vehicle marker to see details
- Status indicators:
  - 🟢 **Green**: On-time
  - 🟡 **Yellow**: Warning (below required speed)
  - 🔴 **Red**: Critical (stationary or very slow)

### 5. Export Reports (Admin Only)
- Click **"Export Report"** to download a comprehensive PDF report
- Report includes:
  - Fleet summary with status counts
  - Detailed information for each vehicle
  - Current speed, ETA, and delay information
  - Cargo status and temperature (for refrigerated items)
  - Destination and distance remaining
- Reports are automatically named with timestamp
- Example: `LosPollos_Fleet_Report_2025-11-21T17-45-30.pdf`

## 📁 Database

All drivers are stored in MongoDB:
- Database: `los-pollos-tracker`
- Collection: `drivers`

You can view the data using MongoDB Compass:
```
mongodb://localhost:27017/los-pollos-tracker
```

## 🛑 Stopping the Servers

To stop the servers, press `Ctrl+C` in each terminal or use:
```bash
# Stop all processes
pkill -f "mongod"
pkill -f "node server"
```

## 🔄 Restarting

If you need to restart everything:

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath ~/data/db
```

**Terminal 2 - Backend:**
```bash
cd los-pollos-tracker
npm run server
```

**Terminal 3 - Frontend:**
```bash
cd los-pollos-tracker
npm run dev
```

## 🐛 Troubleshooting

### MongoDB won't start
```bash
# Create data directory
mkdir -p ~/data/db

# Start MongoDB
mongod --dbpath ~/data/db
```

### Port already in use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 27017
lsof -ti:27017 | xargs kill -9
```

### No drivers showing in dropdown
1. Make sure backend is running (check http://localhost:5001/api/health)
2. Register at least one driver using "Add Driver" button
3. Refresh the "New Task" modal

## 📝 Sample Data

**Sample Bangalore Coordinates:**
- MG Road: `12.9716, 77.5946`
- Koramangala: `12.9352, 77.6245`
- Indiranagar: `12.9784, 77.6408`
- Whitefield: `12.9698, 77.7499`
- Electronic City: `12.8456, 77.6603`

**Sample Driver:**
- Name: Jesse Pinkman
- Email: jesse@lospolloshermanos.com
- Phone: +91 98765 43210
- License: KA01-20230001234
