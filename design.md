# Design Document

## Overview

Los Pollos Tracker is a single-page React application that simulates real-time fleet monitoring for 12 delivery vehicles. The system features role-based authentication (Admin and Driver views), uses Leaflet.js for interactive mapping, implements a sophisticated three-tier status algorithm based on ETA calculations, and features Breaking Bad theming for maximum memorability at hackathon judging.

The application runs entirely client-side with no backend dependencies, using simulated authentication and GPS data that updates every 4 seconds. This design choice ensures zero infrastructure costs, instant deployment, and eliminates potential server failures during demos.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Application                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Login Screen Component                     │ │
│  │  (Admin / Driver Role Selection)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│         ┌────────────────┴────────────────┐                 │
│         │                                 │                 │
│         ▼                                 ▼                 │
│  ┌──────────────────┐           ┌──────────────────┐       │
│  │  Admin Dashboard │           │  Driver Dashboard│       │
│  └──────────────────┘           └──────────────────┘       │
│                                                              │
│  Admin View:                     Driver View:               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Navigation Bar Component                   │ │
│  │  (Logo, Status Counters, Clock, Export Button)         │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────┬─────────────────────────────┐ │
│  │                          │                             │ │
│  │   Map Component          │   Detail Panel Component    │ │
│  │   (Leaflet.js)           │   (Slide-in overlay)        │ │
│  │                          │                             │ │
│  │  - All Vehicle Markers   │   - Vehicle Info            │ │
│  │  - Status Halos          │   - ETA Calculations        │ │
│  │  - Route Animations      │   - Action Buttons          │ │
│  │                          │                             │ │
│  └──────────────────────────┴─────────────────────────────┘ │
│                                                              │
│  Driver View:                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Driver Navigation Bar                      │ │
│  │  (Logo, My Status, Current Speed, ETA)                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────┬─────────────────────────────┐ │
│  │                          │                             │ │
│  │   Map Component          │   My Route Panel            │ │
│  │   (Leaflet.js)           │   (Always visible)          │ │
│  │                          │                             │ │
│  │  - My Vehicle Marker     │   - Destination Info        │ │
│  │  - My Route              │   - Turn-by-Turn Nav        │ │
│  │  - Destination Marker    │   - Status Updates          │ │
│  │                          │                             │ │
│  └──────────────────────────┴─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Auth State     │  │  Vehicle State  │  │  Status Engine  │
│  Management     │  │  Management     │  │  (ETA Logic)    │
│  (Zustand)      │  │  (Zustand)      │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18 with Vite for fast development and HMR
- **Styling**: Tailwind CSS with custom Breaking Bad color palette
- **UI Components**: shadcn/ui for consistent, accessible components
- **Mapping**: Leaflet.js 1.9+ with Jawg Maps Sunny tiles (desert aesthetic)
- **State Management**: Zustand for lightweight, performant global state
- **Animations**: Framer Motion for smooth transitions and marker movement
- **Audio**: Howler.js for sound effects (jingle, phone call)
- **PDF Export**: jsPDF for client-side report generation
- **Icons**: Lucide React + custom SVG chicken truck icons

### Design Principles

1. **Zero Backend**: All logic runs client-side for reliability and instant deployment
2. **Performance First**: 60 FPS animations even with 12 simultaneous vehicle updates
3. **Mobile Responsive**: Touch-optimized from 320px to 2560px screens
4. **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
5. **Demo-Optimized**: Visually impressive within 10 seconds of loading

## Components and Interfaces

### Core Components

#### 1. App Component
Root component managing authentication, routing, and theme.

```typescript
interface AppProps {}

interface AppState {
  isDarkMode: boolean;
  currentUser: User | null;
  isAuthenticated: boolean;
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'driver';
  vehicleId?: string; // Only for drivers
}
```

#### 2. LoginScreen Component
Authentication interface with role selection.

```typescript
interface LoginScreenProps {
  onLogin: (user: User) => void;
}

interface LoginForm {
  username: string;
  password: string;
  role: 'admin' | 'driver';
}

// Demo credentials for hackathon
const DEMO_USERS = {
  admin: { username: 'gus', password: 'pollos', role: 'admin' },
  drivers: [
    { username: 'jesse', password: 'pinkman', role: 'driver', vehicleId: 'v1' },
    { username: 'saul', password: 'goodman', role: 'driver', vehicleId: 'v2' },
    // ... 10 more drivers
  ]
};
```

#### 3. NavigationBar Component (Admin)
Top bar with branding, status counters, and controls.

```typescript
interface NavigationBarProps {
  user: User;
  onExportReport: () => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

interface StatusCounters {
  total: number;
  onTime: number;      // Green
  warning: number;     // Yellow
  critical: number;    // Red
}
```

#### 4. DriverNavigationBar Component
Simplified navigation for driver view.

```typescript
interface DriverNavigationBarProps {
  user: User;
  vehicle: Vehicle;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

interface DriverStats {
  currentSpeed: number;
  status: VehicleStatus;
  etaMinutes: number;
  distanceRemaining: number;
}
```

#### 5. MapView Component
Leaflet map container with vehicle markers and interactions.

```typescript
interface MapViewProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleClick: (vehicleId: string) => void;
  suggestedRoute: Route | null;
  viewMode: 'admin' | 'driver';
  currentUserId?: string; // For driver view
}

interface MapViewState {
  mapCenter: [number, number];
  zoomLevel: number;
}

// Admin view: Shows all 12 vehicles
// Driver view: Shows only their vehicle + destination marker
```

#### 6. VehicleMarker Component
Custom Leaflet marker with status-based styling and animations.

```typescript
interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
  isCurrentUser?: boolean; // Highlight driver's own vehicle
}

interface MarkerStyle {
  color: 'green' | 'yellow' | 'red';
  rotation: number;
  showHalo: boolean;
  size: 'normal' | 'large'; // Larger for driver's own vehicle
}
```

#### 7. DetailPanel Component (Admin)
Slide-in panel showing vehicle information and actions.

```typescript
interface DetailPanelProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onCallGus: () => void;
  onSuggestReroute: () => void;
}

interface DetailPanelContent {
  driverName: string;
  currentSpeed: number;
  requiredSpeed: number;
  timeSinceLastStop: number;
  cargoStatus: string;
  scheduledETA: Date;
  projectedETA: Date;
  etaDifference: number; // minutes
  status: VehicleStatus;
}
```

#### 8. MyRoutePanel Component (Driver)
Always-visible panel showing driver's route and navigation.

```typescript
interface MyRoutePanelProps {
  vehicle: Vehicle;
  onReportIssue: () => void;
}

interface MyRoutePanelContent {
  destination: string;
  distanceRemaining: number;
  etaMinutes: number;
  currentSpeed: number;
  requiredSpeed: number;
  status: VehicleStatus;
  nextTurn?: string; // Simulated turn-by-turn
  cargoStatus: string;
}
```

## Data Models

### Vehicle Model

```typescript
interface Vehicle {
  id: string;
  driverName: string;
  position: {
    lat: number;
    lng: number;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  currentSpeed: number; // km/h
  heading: number; // degrees, 0-360
  scheduledETA: Date;
  cargoStatus: 'Fresh' | 'Frozen' | 'Mixed';
  lastStopTime: Date | null;
  status: VehicleStatus;
  statusHistory: StatusHistoryEntry[];
}

interface StatusHistoryEntry {
  timestamp: Date;
  status: VehicleStatus;
  speed: number;
  position: { lat: number; lng: number };
}

type VehicleStatus = 'on-time' | 'warning' | 'critical';
```

### Route Model

```typescript
interface Route {
  vehicleId: string;
  waypoints: { lat: number; lng: number }[];
  distance: number; // km
  estimatedDuration: number; // minutes
  reason: string; // AI-generated explanation
}
```

### Status Calculation Model

```typescript
interface StatusCalculation {
  vehicleId: string;
  remainingDistance: number; // km
  timeUntilScheduledETA: number; // minutes
  requiredAverageSpeed: number; // km/h
  currentSpeed: number; // km/h
  status: VehicleStatus;
  projectedETA: Date;
  etaDifferenceMinutes: number;
}
```

## Status Engine Logic

### ETA Calculation Algorithm

The core intelligence of the system is the status calculation that runs every 4 seconds for each vehicle.

```typescript
function calculateVehicleStatus(vehicle: Vehicle): StatusCalculation {
  const now = new Date();
  
  // Calculate remaining distance using Haversine formula
  const remainingDistance = calculateDistance(
    vehicle.position,
    vehicle.destination
  );
  
  // Time until scheduled ETA in minutes
  const timeUntilScheduledETA = 
    (vehicle.scheduledETA.getTime() - now.getTime()) / (1000 * 60);
  
  // Required average speed to arrive on time (km/h)
  const requiredAverageSpeed = 
    (remainingDistance / timeUntilScheduledETA) * 60;
  
  // Project ETA based on current speed
  const hoursToDestination = remainingDistance / vehicle.currentSpeed;
  const projectedETA = new Date(
    now.getTime() + hoursToDestination * 60 * 60 * 1000
  );
  
  const etaDifferenceMinutes = 
    (projectedETA.getTime() - vehicle.scheduledETA.getTime()) / (1000 * 60);
  
  // Determine status
  let status: VehicleStatus;
  
  // Check for critical delay (stationary for 10+ minutes)
  const isStationary = checkIfStationary(vehicle);
  
  if (isStationary) {
    status = 'critical';
  } else if (vehicle.currentSpeed >= requiredAverageSpeed) {
    status = 'on-time';
  } else {
    status = 'warning';
  }
  
  return {
    vehicleId: vehicle.id,
    remainingDistance,
    timeUntilScheduledETA,
    requiredAverageSpeed,
    currentSpeed: vehicle.currentSpeed,
    status,
    projectedETA,
    etaDifferenceMinutes
  };
}

function checkIfStationary(vehicle: Vehicle): boolean {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  
  // Check status history for last 10 minutes
  const recentHistory = vehicle.statusHistory.filter(
    entry => entry.timestamp >= tenMinutesAgo
  );
  
  // If all recent speeds are below 8 km/h, vehicle is stationary
  return recentHistory.every(entry => entry.speed < 8);
}

function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  // Haversine formula for great-circle distance
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * 
    Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
```

### GPS Simulation Logic

```typescript
interface SimulationConfig {
  updateInterval: 4000; // ms
  speedVariation: 0.15; // ±15% random variation
  directionChange: 5; // max degrees per update
}

function simulateGPSUpdate(vehicle: Vehicle): Vehicle {
  // Calculate movement based on current speed and heading
  const distanceKm = (vehicle.currentSpeed / 3600) * 4; // 4 seconds of travel
  
  // Add slight random variation to speed (±15%)
  const speedVariation = (Math.random() - 0.5) * 2 * 0.15;
  const newSpeed = vehicle.currentSpeed * (1 + speedVariation);
  
  // Add slight random variation to heading (±5 degrees)
  const headingVariation = (Math.random() - 0.5) * 2 * 5;
  const newHeading = (vehicle.heading + headingVariation + 360) % 360;
  
  // Calculate new position
  const newPosition = calculateNewPosition(
    vehicle.position,
    distanceKm,
    newHeading
  );
  
  return {
    ...vehicle,
    position: newPosition,
    currentSpeed: Math.max(0, newSpeed),
    heading: newHeading
  };
}
```

## Animation System

### Marker Movement Animation

Using Framer Motion for smooth 4-second transitions between GPS updates:

```typescript
interface MarkerAnimationConfig {
  duration: 4; // seconds
  ease: 'linear';
  rotate: true; // rotate icon to match heading
}

// Framer Motion animation props
const markerAnimation = {
  animate: {
    x: newPosition.lng,
    y: newPosition.lat,
    rotate: vehicle.heading
  },
  transition: {
    duration: 4,
    ease: 'linear'
  }
};
```

### Status Halo Animation

Pulsing red halo for critical delays:

```typescript
const haloAnimation = {
  animate: {
    scale: [1, 1.3, 1],
    opacity: [0.7, 0.3, 0.7]
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut'
  }
};
```

### Route Suggestion Animation

Animated polyline drawing for suggested routes:

```typescript
function animateSuggestedRoute(route: Route, map: L.Map) {
  const polyline = L.polyline(route.waypoints, {
    color: '#F9D71C',
    weight: 4,
    opacity: 0,
    dashArray: '10, 10'
  }).addTo(map);
  
  // Animate opacity and dash offset
  let opacity = 0;
  let dashOffset = 0;
  
  const animate = () => {
    opacity = Math.min(opacity + 0.05, 1);
    dashOffset += 2;
    
    polyline.setStyle({
      opacity: opacity,
      dashOffset: dashOffset.toString()
    });
    
    if (opacity < 1) {
      requestAnimationFrame(animate);
    } else {
      // Hold for 5 seconds, then fade out
      setTimeout(() => fadeOutRoute(polyline, map), 5000);
    }
  };
  
  animate();
}
```

## Error Handling

### GPS Update Failures

```typescript
function handleGPSUpdateError(vehicleId: string, error: Error) {
  console.error(`GPS update failed for vehicle ${vehicleId}:`, error);
  
  // Keep last known position
  // Show warning indicator on marker
  // Continue with other vehicles
  
  // Don't crash the entire application
}
```

### Map Loading Failures

```typescript
function handleMapLoadError(error: Error) {
  // Fallback to OpenStreetMap tiles if Jawg fails
  const fallbackTileLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  // Show user-friendly error message
  // Continue with degraded functionality
}
```

### Audio Playback Failures

```typescript
function handleAudioError(soundId: string, error: Error) {
  console.warn(`Audio playback failed for ${soundId}:`, error);
  
  // Show visual-only feedback
  // Don't block user interaction
  // Gracefully degrade to silent mode
}
```

## Testing Strategy

### Unit Tests

Focus on core logic that doesn't require DOM or external libraries:

1. **Status Calculation Tests**
   - Test `calculateVehicleStatus` with various speed/distance scenarios
   - Verify correct status assignment (on-time, warning, critical)
   - Test edge cases (arrived at destination, negative time remaining)

2. **Distance Calculation Tests**
   - Verify Haversine formula accuracy
   - Test with known city pairs (e.g., LA to SF)

3. **Stationary Detection Tests**
   - Test 10-minute window logic
   - Verify speed threshold (8 km/h)

### Integration Tests

Test component interactions:

1. **Vehicle Selection Flow**
   - Click marker → detail panel opens
   - Click outside → panel closes
   - Verify correct vehicle data displayed

2. **Status Counter Updates**
   - Simulate status changes
   - Verify counters update within 1 second

### Manual Testing Checklist

Critical paths to test before demo:

- [ ] All 12 vehicles render on map load
- [ ] Vehicles move smoothly every 4 seconds
- [ ] Status colors change correctly (green/yellow/red)
- [ ] Critical delay triggers red halo + sound
- [ ] Detail panel shows correct ETA calculations
- [ ] "Call Gus" button plays sound
- [ ] "Suggest Reroute" shows route animation
- [ ] Export PDF generates successfully
- [ ] Mobile responsive on iPhone/Android
- [ ] Dark mode toggle works
- [ ] No console errors during 5-minute run

## Performance Optimization

### Target Metrics

- Initial load: < 2 seconds
- Time to interactive: < 3 seconds
- Animation frame rate: 60 FPS sustained
- Memory usage: < 150 MB after 10 minutes
- Bundle size: < 500 KB gzipped

### Optimization Strategies

1. **Code Splitting**: Lazy load PDF export library
2. **Memoization**: Use React.memo for VehicleMarker components
3. **Debouncing**: Debounce map pan/zoom events
4. **Asset Optimization**: Compress SVG icons, use WebP for images
5. **State Updates**: Batch vehicle updates in single Zustand action

## Deployment

### Build Configuration

```bash
# Vite build optimized for production
vite build --mode production

# Output: dist/ folder ready for static hosting
```

### Hosting Options

1. **Vercel** (recommended): Zero-config deployment, instant HTTPS
2. **Netlify**: Drag-and-drop deployment
3. **GitHub Pages**: Free hosting for hackathon projects

### Environment Variables

```env
VITE_JAWG_ACCESS_TOKEN=your_token_here
VITE_ENABLE_SOUNDS=true
VITE_UPDATE_INTERVAL=4000
```

## Breaking Bad Theme Implementation

### Visual Elements

1. **Color Palette**
   ```css
   --pollos-yellow: #F9D71C;
   --pollos-orange: #C14D00;
   --pollos-dark: #0F0F0F;
   --status-green: #22C55E;
   --status-red: #EF4444;
   ```

2. **Custom Chicken Truck SVG**
   - Normal state: Yellow truck with chicken logo
   - Warning state: Yellow truck with alert icon
   - Critical state: Red truck with flashing effect

3. **Typography**
   - Headings: Bold, uppercase for "LOS POLLOS TRACKER"
   - Body: Clean sans-serif (Inter or system font)

### Audio Elements

1. **Los Pollos Jingle** (normal): Cheerful chicken restaurant theme
2. **Distorted Jingle** (critical delay): Ominous, slowed-down version
3. **Phone Ring**: "Call Gus" button sound effect
4. **Voice Clip**: "The shipment is late" (text-to-speech or recorded)

### Easter Eggs

- Hover over logo: Gus Fring quote appears
- Konami code: All trucks turn blue (meth reference)
- Click logo 5 times: "Say my name" audio clip plays

## Future Enhancements

Features to add if time permits or for post-hackathon development:

1. **Historical Playback**: Scrub timeline to see past vehicle positions
2. **Weather Overlay**: Show weather conditions affecting routes
3. **Driver Profiles**: Photos and stats for each driver
4. **Geofencing**: Alert when vehicles enter/exit zones
5. **Multi-Fleet Support**: Switch between different delivery fleets
6. **Real Backend**: Connect to actual GPS tracking API
7. **Push Notifications**: Browser notifications for critical delays
8. **Voice Commands**: "Show me delayed vehicles"


## Authentication System

### Role-Based Access Control

The application supports two distinct user roles with different capabilities:

#### Admin Role (Dispatcher)
- **View**: Full fleet dashboard with all 12 vehicles
- **Capabilities**:
  - Monitor all vehicles simultaneously
  - View detailed information for any vehicle
  - Export fleet status reports
  - Call Gus for delayed vehicles
  - Suggest reroutes for any vehicle
  - View real-time status counters
- **Demo Credentials**: 
  - Username: `gus`
  - Password: `pollos`

#### Driver Role
- **View**: Personal navigation dashboard
- **Capabilities**:
  - See only their own vehicle on map
  - View their destination and route
  - See their current status (green/yellow/red)
  - View required speed vs current speed
  - Report issues to dispatch
  - Receive notifications about status changes
- **Demo Credentials** (12 drivers):
  - Jesse (v1): `jesse` / `pinkman`
  - Saul (v2): `saul` / `goodman`
  - Hank (v3): `hank` / `schrader`
  - Skyler (v4): `skyler` / `white`
  - Mike (v5): `mike` / `ehrmantraut`
  - Walter (v6): `walter` / `white`
  - Badger (v7): `badger` / `mayhew`
  - Combo (v8): `combo` / `ortega`
  - Huell (v9): `huell` / `babineaux`
  - Kuby (v10): `kuby` / `patrick`
  - Tyrus (v11): `tyrus` / `kitt`
  - Victor (v12): `victor` / `santiago`

### Authentication Flow

```typescript
interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

function login(username: string, password: string): Promise<boolean> {
  // Check against demo credentials
  const user = DEMO_USERS.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user));
    return Promise.resolve(true);
  }
  
  return Promise.resolve(false);
}

function logout() {
  localStorage.removeItem('currentUser');
  // Redirect to login screen
}

// On app load, check for existing session
function initAuth(): User | null {
  const stored = localStorage.getItem('currentUser');
  return stored ? JSON.parse(stored) : null;
}
```

### View Differences

#### Admin Dashboard Features
1. **Full Fleet Map**: All 12 vehicles visible with color-coded status
2. **Status Counters**: Real-time counts of on-time/warning/critical vehicles
3. **Click Any Vehicle**: Open detail panel for any driver
4. **Export Reports**: Generate PDF of entire fleet status
5. **Intervention Actions**: Call Gus, suggest reroutes for any vehicle

#### Driver Dashboard Features
1. **Personal Map**: Only their vehicle and destination visible
2. **My Status Bar**: Current speed, required speed, ETA
3. **Route Panel**: Always-visible navigation information
4. **Turn-by-Turn**: Simulated navigation instructions
5. **Status Alerts**: Visual/audio alerts when falling behind schedule
6. **Report Issue**: Button to notify dispatch of problems

### UI Differences

```typescript
// Admin view renders full dashboard
if (user.role === 'admin') {
  return (
    <AdminDashboard
      vehicles={allVehicles}
      onVehicleClick={handleVehicleClick}
      onExportReport={handleExport}
    />
  );
}

// Driver view renders personal navigation
if (user.role === 'driver') {
  const myVehicle = vehicles.find(v => v.id === user.vehicleId);
  
  return (
    <DriverDashboard
      vehicle={myVehicle}
      onReportIssue={handleReportIssue}
    />
  );
}
```

### Security Considerations

For hackathon demo purposes:
- Client-side authentication only (no backend)
- Credentials stored in localStorage
- No actual security (demo accounts hardcoded)
- Session persists until logout

For production (post-hackathon):
- JWT tokens with backend authentication
- Encrypted password storage
- Role-based API permissions
- Session timeout and refresh tokens

## Driver Experience Design

### Driver Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Los Pollos Tracker | Driver: Jesse | Status: ⚠️ Warning    │
│  Speed: 45 km/h | Required: 52 km/h | ETA: 23 min | Logout  │
└─────────────────────────────────────────────────────────────┘
┌──────────────────────────┬─────────────────────────────────┐
│                          │  MY ROUTE                       │
│                          │                                 │
│      [MAP]               │  📍 Destination:                │
│                          │  1213 Juan Tabo Blvd            │
│   My Truck (Yellow)      │  Albuquerque, NM                │
│        ↓                 │                                 │
│        │                 │  Distance: 18.5 km              │
│        │                 │  Scheduled ETA: 2:45 PM         │
│        │                 │  Current ETA: 2:52 PM (+7 min)  │
│        ↓                 │                                 │
│   Destination (Flag)     │  ⚠️ SPEED UP TO ARRIVE ON TIME  │
│                          │                                 │
│                          │  Current: 45 km/h               │
│                          │  Required: 52 km/h              │
│                          │  Increase by: 7 km/h            │
│                          │                                 │
│                          │  Next Turn:                     │
│                          │  ➡️ Turn right on Central Ave   │
│                          │  in 2.3 km                      │
│                          │                                 │
│                          │  Cargo: Fresh (Refrigerated)    │
│                          │  Temp: 4°C ✓                    │
│                          │                                 │
│                          │  [🚨 Report Issue]              │
│                          │                                 │
└──────────────────────────┴─────────────────────────────────┘
```

### Driver Status Notifications

Drivers receive visual and audio feedback based on their status:

**Green (On-Time)**
- Calm green glow around status indicator
- Encouraging message: "Great pace! Keep it up"
- No audio alerts

**Yellow (Warning)**
- Pulsing yellow status indicator
- Warning message: "Speed up to arrive on time"
- Shows exact speed increase needed
- Gentle alert sound (once when entering warning)

**Red (Critical)**
- Flashing red status indicator
- Urgent message: "CRITICAL DELAY - Contact dispatch"
- Distorted Los Pollos jingle plays
- "Report Issue" button highlighted

### Driver Interaction Features

1. **Report Issue Button**
   - Opens modal with issue categories:
     - Traffic jam
     - Vehicle problem
     - Weather conditions
     - Road closure
     - Other
   - Sends notification to admin dashboard
   - Admin sees issue flag on vehicle marker

2. **Turn-by-Turn Navigation**
   - Simulated navigation instructions
   - Updates every 30 seconds
   - Shows distance to next turn
   - Direction arrow (left/right/straight)

3. **Cargo Status Monitor**
   - Shows cargo type (Fresh/Frozen/Mixed)
   - Temperature indicator (for refrigerated cargo)
   - Alert if temperature out of range

### Mobile Optimization for Drivers

Drivers likely use mobile devices, so driver view is optimized for:
- Portrait orientation
- Large touch targets (buttons 44px minimum)
- Simplified map controls
- Voice-friendly status updates
- Minimal text entry (issue reporting uses buttons)
