# Job Management System - Quick Reference

## System Overview

A complete database-driven job marketplace where admins post jobs and drivers choose which ones to take based on their vehicle capacity and schedule.

## Key Features

### For Admins
- ✅ Create jobs without selecting drivers
- ✅ Jobs automatically available to all drivers
- ✅ Real-time vehicle tracking when driver takes job
- ✅ See driver details on map
- ✅ Auto-calculated payments based on distance, weight, duration, and priority

### For Drivers
- ✅ View all available jobs
- ✅ Jobs filtered by vehicle capacity
- ✅ Time conflict detection
- ✅ Real-time progress tracking
- ✅ Automatic payment crediting on completion
- ✅ Complete job history and earnings

## Workflow

```
ADMIN CREATES JOB
    ↓
Job stored in database (status: available)
    ↓
ALL DRIVERS SEE JOB
    ↓
DRIVER TAKES JOB
    ↓
Job status: assigned → in-progress
Vehicle appears on admin map
    ↓
JOB IN PROGRESS
Real-time tracking & progress timer
    ↓
DRIVER COMPLETES JOB
    ↓
Payment credited to driver account
Job moved to history
Vehicle removed from map
```

## Payment Formula

```javascript
Base Payment = (Distance × ₹10) + (Weight × ₹2) + (Duration × ₹50)
Final Payment = Base Payment × Priority Multiplier

Priority Multipliers:
- Low: 1.0x
- Medium: 1.2x
- High: 1.5x
- Urgent: 2.0x
```

## Database Models

### Job
- Title, description
- Pickup/delivery locations
- Cargo type, weight
- Distance, duration
- Payment, priority
- Status: available → assigned → in-progress → completed
- Assigned driver info

### Driver
- Personal info (name, email, phone, license)
- Vehicle details (type, capacity, registration)
- Earnings (total, monthly, pending)
- Job history (completed jobs with payments)
- Active jobs (current deliveries)
- Performance metrics (rating, on-time rate)

## API Endpoints

### Jobs
```
GET    /api/jobs                    - All jobs
GET    /api/jobs/available          - Available jobs
POST   /api/jobs                    - Create job
PATCH  /api/jobs/:id/assign         - Assign to driver
PATCH  /api/jobs/:id/start          - Start job
PATCH  /api/jobs/:id/complete       - Complete job
PATCH  /api/jobs/:id/cancel         - Cancel job
```

### Drivers
```
GET    /api/drivers/:id             - Get driver profile
POST   /api/drivers/:id/jobs/active - Add active job
POST   /api/drivers/:id/jobs/complete - Complete & credit earnings
```

## Key Files

### Frontend
- `src/components/CreateTaskModal.tsx` - Job creation form
- `src/components/DriverPanel.tsx` - Driver dashboard
- `src/stores/jobStore.ts` - Job state management
- `src/stores/vehicleStore.ts` - Vehicle tracking
- `src/App.tsx` - Main app with job-vehicle integration

### Backend
- `server/models/Job.js` - Job schema
- `server/models/Driver.js` - Driver schema
- `server/routes/jobs.js` - Job API routes
- `server/routes/drivers.js` - Driver API routes

## How to Use

### As Admin
1. Click "Create New Task" button
2. Fill in job details:
   - Title and description
   - Pickup and delivery addresses
   - Cargo type and weight
   - Distance and duration
   - Priority level
3. Payment auto-calculated (or override)
4. Submit - job appears to all drivers
5. When driver takes job, vehicle appears on map
6. Track delivery in real-time

### As Driver
1. Login with driver credentials
2. View available jobs in "Available Jobs" tab
3. Check job details:
   - Payment amount
   - Distance and duration
   - Cargo weight (must be within vehicle capacity)
   - Pickup/delivery times (check for conflicts)
4. Click "Take Job" button
5. Job moves to "My Active Jobs"
6. Track progress with real-time timer
7. When 80%+ complete, click "Complete Delivery"
8. Payment automatically credited to account
9. View earnings in "Earnings" tab

## Smart Features

### Capacity Checking
- Jobs automatically filtered by vehicle capacity
- Shows warning if cargo too heavy
- Prevents taking jobs that exceed capacity

### Time Conflict Detection
- Checks if new job overlaps with existing jobs
- Shows "Time Conflict" if busy during that time
- Prevents double-booking

### Progress Tracking
- Real-time timer shows elapsed time
- Progress bar shows completion percentage
- Complete button enabled at 80% progress

### Automatic Payments
- Payment calculated based on multiple factors
- Priority multiplier increases urgent job pay
- Automatically credited on completion
- Tracked in earnings history

## Testing

### Create a Job
1. Login as admin
2. Click "Create New Task"
3. Fill form and submit
4. Check database: `db.jobs.find()`

### Take a Job
1. Login as driver
2. View available jobs
3. Click "Take Job"
4. Check admin map - vehicle should appear
5. Check database: job status should be "in-progress"

### Complete a Job
1. Wait for 80% progress (or simulate)
2. Click "Complete Delivery"
3. Check driver earnings - should increase
4. Check admin map - vehicle should disappear
5. Check database: job status should be "completed"

## Troubleshooting

### Job not appearing for drivers
- Check job status is "available"
- Check cargo weight vs vehicle capacity
- Refresh driver panel

### Vehicle not appearing on map
- Check job was assigned and started
- Check vehicle store has the vehicle
- Check GPS simulation is running

### Payment not credited
- Check job completion API call succeeded
- Check driver earnings history in database
- Check console for errors

## Future Enhancements

1. **Real GPS Integration** - Replace simulation with actual GPS
2. **Push Notifications** - Notify drivers of new jobs
3. **Route Optimization** - Suggest best routes
4. **Payment Processing** - Integrate payment gateway
5. **Rating System** - Let customers rate drivers
6. **Multi-stop Deliveries** - Support multiple pickups/drops
7. **Geocoding API** - Auto-fill lat/lng from addresses
8. **Admin Approval** - Approve payments before crediting
