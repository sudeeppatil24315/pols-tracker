# Road-Based Routing Implementation Guide

## 🛣️ Problem
Currently, trucks move in straight lines between points, not following actual roads.

## ✅ Solution
Implement road-based routing using OSRM (Open Source Routing Machine).

---

## 📦 What's Been Created

### 1. `routeService.ts`
- **getRoute()** - Get road route between two points
- **snapToRoad()** - Snap GPS point to nearest road
- **getRoadDistance()** - Calculate distance along roads
- **Free OSRM API** - No API key required

### 2. `roadBasedSimulation.ts`
- **initializeVehicleRoute()** - Fetch route when vehicle starts
- **getNextRoadPosition()** - Move along road points
- **Route caching** - Store routes for performance
- **Progress tracking** - Monitor route completion

---

## 🚀 How to Integrate

### Step 1: Update Vehicle Store

Modify `src/stores/vehicleStore.ts`:

```typescript
import { initializeVehicleRoute } from '../utils/roadBasedSimulation';

// In createInitialVehicles():
const vehicles = driverNames.map((name, index) => {
  const vehicle = {
    // ... existing vehicle creation
  };
  
  // Initialize route for each vehicle
  initializeVehicleRoute(vehicle);
  
  return vehicle;
});
```

### Step 2: Update GPS Simulation

Modify `src/utils/gpsSimulation.ts`:

```typescript
import { getNextRoadPosition } from './roadBasedSimulation';

export const simulateGPSUpdate = (vehicle: Vehicle): Vehicle => {
  // ... existing code ...

  // Get next position along road
  const roadPosition = getNextRoadPosition(vehicle);
  
  const newPosition = roadPosition || calculateNewPosition(
    vehicle.position,
    distanceKm,
    vehicle.heading
  );

  // ... rest of the code ...
};
```

### Step 3: Update Task Creation

Modify `src/components/CreateTaskModal.tsx`:

```typescript
import { initializeVehicleRoute } from '../utils/roadBasedSimulation';

const handleSubmit = async (e: React.FormEvent) => {
  // ... existing code ...
  
  addVehicle({
    // ... vehicle data
  });
  
  // Initialize route for new vehicle
  const newVehicle = vehicles[vehicles.length - 1];
  await initializeVehicleRoute(newVehicle);
};
```

---

## 🎯 Alternative Solutions

### Option 1: OSRM (Current - FREE) ⭐
```typescript
// Already implemented above
// Pros: Free, no API key, good quality
// Cons: Public server may have rate limits
```

### Option 2: Mapbox Directions API
```bash
npm install @mapbox/mapbox-sdk
```

```typescript
import mapboxgl from '@mapbox/mapbox-sdk/services/directions';

const directionsClient = mapboxgl({ 
  accessToken: 'pk.YOUR_TOKEN' 
});

const response = await directionsClient.getDirections({
  profile: 'driving',
  waypoints: [
    { coordinates: [start.lng, start.lat] },
    { coordinates: [end.lng, end.lat] }
  ],
  geometries: 'geojson'
}).send();
```

**Pros:**
- Highest quality
- Real-time traffic
- 50,000 free requests/month

**Get API Key:** https://account.mapbox.com/

### Option 3: OpenRouteService
```bash
npm install openrouteservice-js
```

```typescript
import Openrouteservice from 'openrouteservice-js';

const ors = new Openrouteservice.Directions({
  api_key: 'YOUR_KEY'
});

const route = await ors.calculate({
  coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
  profile: 'driving-car',
  format: 'geojson'
});
```

**Pros:**
- Free tier: 2000 requests/day
- Good quality
- Multiple profiles

**Get API Key:** https://openrouteservice.org/dev/#/signup

### Option 4: Google Maps Directions
```typescript
const response = await fetch(
  `https://maps.googleapis.com/maps/api/directions/json?` +
  `origin=${start.lat},${start.lng}&` +
  `destination=${end.lat},${end.lng}&` +
  `key=YOUR_API_KEY`
);
```

**Pros:**
- Most accurate
- Real-time traffic
- Familiar API

**Cons:**
- Expensive ($5 per 1000 requests)

---

## 🔧 Configuration Options

### OSRM Profiles
- `driving-car` - Default car routing
- `driving-hgv` - Heavy goods vehicle (trucks)
- `foot-walking` - Pedestrian
- `cycling-regular` - Bicycle

### Custom OSRM Server
For unlimited requests, host your own OSRM server:

```bash
docker run -t -i -p 5000:5000 osrm/osrm-backend osrm-routed --algorithm mld /data/india-latest.osrm
```

Then update the URL in `routeService.ts`:
```typescript
const url = `http://localhost:5000/route/v1/driving/...`;
```

---

## 📊 Performance Considerations

### Route Caching
- Routes are cached per vehicle
- Reduces API calls
- Improves performance

### Batch Initialization
```typescript
// Initialize all routes at once
await Promise.all(
  vehicles.map(v => initializeVehicleRoute(v))
);
```

### Rate Limiting
Public OSRM server limits:
- ~100 requests per minute
- For 12 vehicles, initialize once = 12 requests
- Updates use cached routes = 0 additional requests

---

## 🎨 Visual Improvements

### Show Planned Route
```typescript
// In MapView.tsx
<Polyline
  positions={plannedRoute}
  pathOptions={{
    color: '#888888',
    weight: 3,
    opacity: 0.5,
    dashArray: '10, 10'
  }}
/>
```

### Show Completed vs Remaining
```typescript
// Completed route (green)
<Polyline positions={completedRoute} color="#4CAF50" />

// Remaining route (gray)
<Polyline positions={remainingRoute} color="#888888" dashArray="5, 5" />
```

---

## 🐛 Troubleshooting

### Issue: Routes not loading
**Solution:** Check console for OSRM errors, may need to retry

### Issue: Vehicles jumping
**Solution:** Increase interpolation points in `getNextRoadPosition()`

### Issue: Slow performance
**Solution:** Use route caching, batch initialize routes

### Issue: OSRM server down
**Solution:** Implement fallback to direct movement

---

## 📈 Benefits

✅ **Realistic Movement** - Trucks follow actual roads
✅ **Accurate ETA** - Based on road distance, not straight line
✅ **Better Visualization** - Routes look professional
✅ **Traffic Awareness** - Can integrate real-time traffic
✅ **Turn-by-Turn** - Can add navigation instructions

---

## 🎯 Next Steps

1. **Integrate** the road-based simulation
2. **Test** with a few vehicles first
3. **Monitor** API usage
4. **Optimize** caching strategy
5. **Add** visual route display
6. **Consider** upgrading to Mapbox for production

---

## 💡 Quick Start

**Easiest way to test:**

1. Keep current simulation as fallback
2. Add road routing for new vehicles only
3. Gradually migrate existing vehicles
4. Monitor performance and accuracy

**Code snippet:**
```typescript
// In gpsSimulation.ts
const roadPosition = await getNextRoadPosition(vehicle);
const newPosition = roadPosition || calculateNewPosition(...); // Fallback
```

This way, if OSRM fails, vehicles still move!

---

## 📚 Resources

- **OSRM Documentation**: http://project-osrm.org/
- **Mapbox Directions**: https://docs.mapbox.com/api/navigation/directions/
- **OpenRouteService**: https://openrouteservice.org/dev/#/api-docs
- **Leaflet Routing**: https://www.liedman.net/leaflet-routing-machine/

---

**Ready to implement? Let me know which solution you prefer!** 🚀
