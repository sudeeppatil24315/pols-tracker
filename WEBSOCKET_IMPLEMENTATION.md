# WebSocket Implementation Guide

## Overview
Real-time communication using Socket.io for instant updates across all connected clients.

## What's Implemented

### Server Side (`server/index.js`)
- ✅ Socket.io server integrated with Express
- ✅ CORS configured for frontend connection
- ✅ Room-based communication (admin/driver rooms)
- ✅ Connection/disconnection handling

### Events Emitted by Server

#### Job Events
- `job:created` - When admin creates a new job → Sent to all drivers
- `job:assigned` - When driver takes a job → Sent to all admins + specific driver
- `job:started` - When job starts → Sent to all admins
- `job:completed` - When job completes → Sent to all admins + all drivers

#### Vehicle Events
- `vehicle:updated` - When driver position updates → Sent to all admins

### Client Side

#### Socket Service (`src/services/socket.ts`)
- Manages WebSocket connection
- Auto-reconnection with exponential backoff
- Event listeners for all job and vehicle events
- Clean disconnect handling

#### Job Store Integration (`src/stores/jobStore.ts`)
- `initializeSocketListeners()` - Sets up real-time job updates
- `cleanupSocketListeners()` - Removes listeners on unmount
- Automatically updates job list when events received

#### App Integration (`src/App.tsx`)
- Connects socket when user logs in
- Joins appropriate room (admin/driver)
- Disconnects on logout
- Cleans up listeners on unmount

## How It Works

### 1. User Logs In
```
User Login → Socket connects → Joins room based on role
```

### 2. Admin Creates Job
```
Admin clicks "New Job" 
  ↓
Job saved to database
  ↓
Server emits 'job:created' to 'driver' room
  ↓
All drivers receive update instantly
  ↓
Job appears in driver's available jobs list
```

### 3. Driver Takes Job
```
Driver clicks "Take Job"
  ↓
Job assigned in database
  ↓
Server emits 'job:assigned' to 'admin' room + driver
  ↓
Admin sees vehicle appear on map instantly
  ↓
Driver sees job in "My Active Jobs"
```

### 4. Job Completion
```
Driver completes job
  ↓
Payment credited in database
  ↓
Server emits 'job:completed' to all
  ↓
Admin sees vehicle disappear from map
  ↓
Driver sees updated earnings
  ↓
Job moves to history
```

## Benefits

### Before WebSockets (Polling)
- ❌ Updates every 10 seconds
- ❌ High server load
- ❌ Delayed notifications
- ❌ Wasted bandwidth

### After WebSockets
- ✅ Instant updates (< 100ms)
- ✅ Low server load
- ✅ Real-time notifications
- ✅ Efficient bandwidth usage

## Testing

### Test Real-Time Updates

1. **Open two browser windows:**
   - Window 1: Login as Admin
   - Window 2: Login as Driver

2. **Test Job Creation:**
   - Admin: Create a new job
   - Driver: Should see job appear instantly (no refresh needed)

3. **Test Job Taking:**
   - Driver: Take a job
   - Admin: Should see vehicle appear on map instantly

4. **Test Job Completion:**
   - Driver: Complete the job
   - Admin: Should see vehicle disappear instantly
   - Driver: Should see earnings update instantly

### Check Console Logs
- `🔌 Connected to WebSocket server` - Connection successful
- `📦 New job created:` - Job event received
- `📦 Job assigned:` - Assignment event received
- `📦 Job completed:` - Completion event received

## Troubleshooting

### Socket Not Connecting
1. Check server is running: `http://localhost:5001`
2. Check console for connection errors
3. Verify CORS settings in `server/index.js`

### Events Not Received
1. Check user joined correct room (admin/driver)
2. Verify socket listeners are initialized
3. Check server console for emit logs

### Reconnection Issues
1. Socket auto-reconnects up to 5 times
2. Check network connection
3. Restart server if needed

## Future Enhancements

- [ ] Add typing indicators
- [ ] Add online/offline status
- [ ] Add chat between admin and drivers
- [ ] Add push notifications
- [ ] Add delivery status updates
- [ ] Add real-time GPS tracking (every second)
- [ ] Add driver availability status
- [ ] Add job acceptance timeout

## Technical Details

### Connection URL
```
http://localhost:5001
```

### Transports
- Primary: WebSocket
- Fallback: Long polling

### Reconnection Strategy
- Initial delay: 1 second
- Max delay: 5 seconds
- Max attempts: 5
- Exponential backoff

### Room Structure
```
admin - All admin users
driver - All driver users
{userId} - Individual user room
```

## Code Examples

### Emit Custom Event (Server)
```javascript
const io = req.app.get('io');
io.to('admin').emit('custom:event', data);
```

### Listen to Custom Event (Client)
```typescript
socketService.getSocket()?.on('custom:event', (data) => {
  console.log('Received:', data);
});
```

### Emit from Client
```typescript
socketService.getSocket()?.emit('custom:event', data);
```
