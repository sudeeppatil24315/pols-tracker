# Los Pollos Tracker - Feature List

## 🎯 Core Features

### 1. Authentication System
- **Admin Login**: Full access to fleet management
  - Username: `admin`
  - Password: `gus123`
- **Driver Login**: Limited access to assigned vehicle only
  - Username: `driver`
  - Password: `driver123`
- Secure session management with Zustand

### 2. Real-Time GPS Tracking
- Live vehicle position updates every 4 seconds
- Realistic GPS simulation with:
  - Speed variations (±5%)
  - Traffic simulation (5% chance of slowdown)
  - Clear road conditions (3% chance of speedup)
  - Heading adjustments toward destination
- City-appropriate speed limits (5-65 km/h)

### 3. Interactive Map (Leaflet)
- **Bangalore, India** as the operational area
- Vehicle markers with status colors:
  - 🟢 Green: On-time
  - 🟡 Yellow: Warning
  - 🔴 Red: Critical (with pulsing animation)
- Click markers to view detailed information
- Zoom and pan controls
- Real-time marker updates

### 4. Status Calculation System
- **On-Time**: Vehicle traveling at or above required speed
- **Warning**: Vehicle below required speed but moving (≥8 km/h)
- **Critical**: 
  - Vehicle moving below 8 km/h, OR
  - Stationary for more than 10 minutes
- Automatic ETA projection based on current speed
- Required average speed calculation

### 5. Driver Management (MongoDB)
- **Register New Drivers**:
  - Full name
  - Email address
  - Phone number
  - License number
- **Driver Status Tracking**:
  - Available
  - On-duty
  - Off-duty
- Automatic status updates when assigned to tasks
- Duplicate prevention (email and license number)

### 6. Task Creation (Admin Only)
- **Select Driver**: Dropdown of available drivers from database
- **Starting Location**: Latitude/Longitude coordinates
- **Destination**: Coordinates + address
- **Cargo Type**: Fresh, Frozen, or Mixed
- **Estimated Duration**: In hours
- Automatic calculations:
  - Distance between points
  - Realistic scheduled ETA
  - Initial heading toward destination
  - Cargo temperature (for Frozen/Mixed)

### 7. Fleet Dashboard
- **Status Counters**:
  - Total vehicles
  - On-time count
  - Warning count
  - Critical count
- **Live Clock**: Real-time display
- **Role-Based Views**:
  - Admin: See all vehicles
  - Driver: See only assigned vehicle

### 8. Vehicle Detail Panel
- **Vehicle Information**:
  - Driver name and vehicle ID
  - Current status with color coding
  - Current speed vs required speed
  - Scheduled ETA vs projected ETA
  - ETA difference in minutes
  - Cargo status and temperature
  - Time since last stop
  - Destination address
  - Distance remaining
- **Status Alerts**: Warning messages for delayed vehicles
- **Action Buttons** (for critical/warning status):
  - Call Gus
  - Suggest Reroute
- Slide-in animation from right
- Keyboard shortcut: ESC to close

### 9. Export Fleet Report (Admin Only)
- **PDF Generation** with jsPDF
- **Report Contents**:
  - Professional header with branding
  - Generation timestamp
  - Fleet summary statistics
  - Color-coded status boxes
  - Detailed vehicle cards with:
    - Status indicator
    - Driver and vehicle info
    - Speed and ETA information
    - Cargo details
    - Destination
    - Delay/ahead indicators
- **Sorting**: Critical vehicles listed first
- **Automatic Naming**: Timestamped filename
- **Multi-Page Support**: Automatic page breaks

### 10. Navigation Bar
- **Branding**: Los Pollos logo and tagline
- **Status Dashboard**: Visual counters for fleet status
- **Admin Actions**:
  - Add Driver button
  - New Task button
  - Export Report button
- **User Controls**:
  - Dark mode toggle
  - User info display
  - Logout button

## 🎨 UI/UX Features

### Design Theme
- **Breaking Bad Inspired**: Yellow (#F9D71C) and dark theme
- **Professional Dashboard**: Clean, modern interface
- **Responsive Layout**: Adapts to different screen sizes

### Animations
- Pulsing red halo for critical vehicles
- Smooth slide-in for detail panel
- Fade-in notifications
- Hover effects on buttons

### Color Coding
- **Green**: On-time, success states
- **Yellow**: Warning states, branding
- **Red**: Critical states, alerts
- **Gray**: Neutral, backgrounds

## 🔧 Technical Features

### Frontend
- **React 19** with TypeScript
- **Zustand** for state management
- **Tailwind CSS** for styling
- **Leaflet** for maps
- **jsPDF** for report generation
- **Lucide React** for icons
- **Vite** for build tooling

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **CORS** enabled for development
- **dotenv** for configuration
- **RESTful API** design

### Database Schema
```javascript
Driver {
  name: String (required)
  email: String (required, unique)
  phone: String (required)
  licenseNumber: String (required, unique)
  vehicleId: String (optional)
  status: Enum ['available', 'on-duty', 'off-duty']
  createdAt: Date
}
```

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/available` - Get available drivers
- `POST /api/drivers` - Register new driver
- `PATCH /api/drivers/:id/status` - Update driver status
- `DELETE /api/drivers/:id` - Delete driver

## 📊 Data Flow

1. **GPS Simulation** → Updates vehicle positions every 4 seconds
2. **Status Calculation** → Determines vehicle status based on speed and ETA
3. **State Management** → Zustand stores update React components
4. **Map Rendering** → Leaflet displays updated vehicle positions
5. **Database Sync** → Driver assignments persist in MongoDB

## 🚀 Performance

- **Efficient Updates**: Only changed vehicles re-render
- **Optimized Calculations**: Haversine formula for accurate distances
- **Lazy Loading**: Components load on demand
- **Minimal Re-renders**: Zustand selectors prevent unnecessary updates

## 🔐 Security Features

- Session-based authentication
- Password validation
- Input sanitization
- CORS configuration
- Environment variable protection

## 📱 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern browsers with ES6+ support

## 🎯 Future Enhancement Ideas

- [ ] Real-time notifications for status changes
- [ ] Route optimization suggestions
- [ ] Historical tracking data
- [ ] Driver performance analytics
- [ ] Mobile app version
- [ ] Push notifications
- [ ] Weather integration
- [ ] Traffic data integration
- [ ] Multi-language support
- [ ] Custom alert thresholds
