# Implementation Plan

- [x] 1. Set up project structure and dependencies
  - Initialize Vite + React + TypeScript project with `npm create vite@latest`
  - Install core dependencies: react-leaflet, leaflet, zustand, framer-motion, howler, tailwindcss
  - Install UI dependencies: @radix-ui/react-* (for shadcn/ui components), lucide-react
  - Configure Tailwind CSS with custom Los Pollos color palette
  - Set up project folder structure: /components, /stores, /utils, /types, /assets
  - Create base TypeScript interfaces for Vehicle, User, Route, StatusCalculation
  - _Requirements: 1.1, 1.3_

- [x] 2. Implement authentication system
  - [x] 2.1 Create authentication store with Zustand
    - Define User interface with id, name, role, vehicleId
    - Implement login function with demo credential validation
    - Implement logout function with localStorage cleanup
    - Implement session persistence using localStorage
    - Create 12 demo driver accounts (Jesse, Saul, Hank, etc.) and 1 admin account (Gus)
    - _Requirements: 10.1, 10.3, 10.5_
  
  - [x] 2.2 Build LoginScreen component
    - Create form with username, password, and role selection inputs
    - Implement form validation and error display
    - Add Breaking Bad themed styling with Los Pollos branding
    - Implement login submission with authentication store
    - Display error messages for invalid credentials
    - _Requirements: 10.1, 10.2, 10.4_

- [x] 3. Create vehicle state management and simulation
  - [x] 3.1 Implement vehicle store with Zustand
    - Define Vehicle interface with position, speed, heading, status, destination
    - Create initial state with 12 vehicles at different starting positions
    - Implement GPS update simulation function that runs every 4 seconds
    - Add vehicle selection state management
    - _Requirements: 1.1, 1.2, 2.7_
  
  - [x] 3.2 Implement status calculation engine
    - Create calculateDistance function using Haversine formula
    - Implement calculateVehicleStatus function with ETA logic
    - Calculate required average speed based on remaining distance and time
    - Implement three-tier status determination (on-time, warning, critical)
    - Add checkIfStationary function for 10-minute window detection
    - Calculate projected ETA and time difference
    - _Requirements: 2.1, 2.2, 2.4, 2.7_
  
  - [x] 3.3 Create GPS simulation logic
    - Implement simulateGPSUpdate function with speed and heading variation
    - Calculate new position based on speed, heading, and time interval
    - Add realistic movement patterns (slight speed/direction changes)
    - Update vehicle status history for stationary detection
    - _Requirements: 1.2, 9.1_

- [x] 4. Build core map component with Leaflet
  - [x] 4.1 Create MapView component
    - Initialize Leaflet map with Jawg Maps Sunny tiles (desert theme)
    - Set initial map center and zoom level (Albuquerque, NM area)
    - Configure map controls and interaction handlers
    - Implement view mode switching (admin shows all vehicles, driver shows only their vehicle)
    - Add destination markers for driver view
    - _Requirements: 1.1, 1.4, 1.5, 11.1, 12.1_
  
  - [x] 4.2 Create VehicleMarker component
    - Design custom chicken truck SVG icon in three colors (green, yellow, red)
    - Implement marker rendering with Leaflet
    - Add marker rotation based on vehicle heading
    - Implement click handler to open detail panel
    - Add larger marker size for driver's own vehicle in driver view
    - _Requirements: 1.3, 2.1, 2.2, 2.3, 9.2_
  
  - [x] 4.3 Implement marker animations
    - Use Framer Motion for smooth 4-second position transitions
    - Implement rotation animation to match heading changes
    - Add easing functions for natural acceleration/deceleration
    - Ensure 60 FPS performance with 12 simultaneous animations
    - Prevent marker jitter during updates
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 4.4 Create status halo animation for critical delays
    - Implement pulsing red halo effect using Framer Motion
    - Add scale and opacity animations (1 to 1.3 scale, 0.7 to 0.3 opacity)
    - Set infinite loop with 2-second duration
    - Only show halo for vehicles with critical status
    - _Requirements: 2.2, 2.5_

- [ ] 5. Implement admin dashboard
  - [ ] 5.1 Create NavigationBar component for admin
    - Display Los Pollos Hermanos logo and tagline
    - Implement live clock showing current time in 12-hour format
    - Create status counters showing total, on-time, warning, and critical vehicle counts
    - Add Export Report button
    - Add dark mode toggle button
    - Add logout button
    - Update counters in real-time when vehicle statuses change
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.2, 5.3, 10.6, 11.2_
  
  - [ ] 5.2 Build DetailPanel component for admin
    - Create slide-in panel with smooth 300ms animation from right side
    - Display vehicle information: driver name, current speed, required speed, time since last stop
    - Show cargo status, scheduled ETA, projected ETA, and ETA difference
    - Display status-specific information for warning/critical vehicles
    - Add close button and escape key handler
    - Implement click-outside-to-close functionality
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 11.3_
  
  - [ ] 5.3 Add intervention actions to DetailPanel
    - Add "Call Gus" button for warning/critical vehicles
    - Implement phone call sound effect using Howler.js
    - Add "Suggest Reroute" button for warning/critical vehicles
    - Generate simulated AI reroute suggestion with alternate route and reasoning
    - Display new required average speed after reroute
    - Provide visual feedback within 200ms for button clicks
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.6, 11.5_
  
  - [ ] 5.4 Implement route animation on map
    - Create animateSuggestedRoute function using Leaflet polylines
    - Animate polyline opacity from 0 to 1 over 1 second
    - Animate dash offset for moving dashes effect
    - Display route for 5 seconds then fade out
    - Use Los Pollos yellow color (#F9D71C) for route line
    - _Requirements: 6.5_

- [ ] 6. Implement driver dashboard
  - [ ] 6.1 Create DriverNavigationBar component
    - Display Los Pollos logo and driver name
    - Show current status indicator (green/yellow/red)
    - Display current speed and required speed
    - Show ETA in minutes
    - Add dark mode toggle and logout button
    - _Requirements: 10.6, 12.2, 12.3_
  
  - [ ] 6.2 Build MyRoutePanel component
    - Create always-visible side panel with route information
    - Display destination address and distance remaining
    - Show scheduled ETA, projected ETA, and time difference
    - Display current speed vs required speed comparison
    - Show speed increase/decrease needed to arrive on time
    - Display cargo type and temperature (for refrigerated cargo)
    - Add Report Issue button
    - _Requirements: 12.2, 12.3, 12.4, 14.1, 14.2, 15.1_
  
  - [ ] 6.3 Implement turn-by-turn navigation
    - Generate simulated navigation instructions based on vehicle position
    - Display next turn direction (left, right, straight) with icon
    - Show distance to next turn in kilometers
    - Update instructions every 30 seconds
    - Highlight next turn instruction with visual emphasis
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 6.4 Add driver status alerts
    - Implement visual status indicator with color-coded glow
    - Display status-specific messages (encouraging for green, warning for yellow, urgent for red)
    - Play gentle alert sound when entering warning status
    - Play distorted Los Pollos jingle when entering critical status
    - Show exact speed increase needed for yellow status
    - _Requirements: 12.5, 2.3, 2.6_
  
  - [ ] 6.5 Create Report Issue modal
    - Build modal with issue category selection buttons
    - Provide categories: Traffic Jam, Vehicle Problem, Weather Conditions, Road Closure, Other
    - Implement issue submission with confirmation message
    - Add issue flag to vehicle marker in admin dashboard when issue is reported
    - Close modal after successful submission
    - _Requirements: 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 6.6 Implement cargo status monitoring
    - Display cargo type badge (Fresh/Frozen/Mixed) with appropriate styling
    - Show temperature indicator for refrigerated cargo
    - Implement temperature range validation (alert if out of range)
    - Update cargo status every 4 seconds with vehicle updates
    - Use color coding (green for normal, red for issues)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 7. Implement audio system
  - [ ] 7.1 Set up Howler.js audio manager
    - Initialize Howler.js with audio sprite configuration
    - Load Los Pollos jingle audio file (normal version)
    - Load distorted jingle audio file (critical delay version)
    - Load phone ring sound effect
    - Implement play functions for each sound
    - Add error handling for audio playback failures
    - _Requirements: 2.3, 2.6, 6.2_

- [ ] 8. Add Breaking Bad theming and polish
  - [ ] 8.1 Implement custom styling and branding
    - Create custom Tailwind theme with Los Pollos color palette
    - Design Los Pollos Hermanos logo with smiling chicken icon
    - Add tagline "Taste the Family... On Time" to navigation
    - Implement dark mode with brand colors maintained
    - Ensure WCAG 2.1 AA contrast ratios for accessibility
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [ ] 8.2 Add critical delay message overlay
    - Display "THE ONE WHO KNOCKS IS ANGRY" message near critical vehicles
    - Implement message positioning relative to vehicle marker
    - Add dramatic styling with red glow effect
    - Show message only for vehicles with critical status
    - _Requirements: 5.4_
  
  - [ ] 8.3 Add easter eggs and bonus features
    - Implement hover effect on logo showing Gus Fring quote
    - Add Konami code handler to turn all trucks blue (meth reference)
    - Add "Say my name" audio clip on 5 logo clicks
    - Create smooth transitions for all interactive elements
    - _Requirements: None (bonus feature)_

- [ ] 9. Implement PDF export functionality
  - [ ] 9.1 Create report generation system
    - Install and configure jsPDF library
    - Create generateFleetReport function
    - Include all vehicle data: ID, driver, status, speed, ETA difference
    - Add timestamp and Los Pollos branding to report
    - Format report with tables and status color coding
    - _Requirements: 7.2, 7.3_
  
  - [ ] 9.2 Add export button handler
    - Implement click handler for Export Report button
    - Generate PDF with current fleet status
    - Trigger browser download of PDF file
    - Display success confirmation message
    - Complete export within 3 seconds
    - _Requirements: 7.1, 7.4, 7.5_

- [ ] 10. Implement mobile responsiveness
  - [ ] 10.1 Optimize for mobile screens
    - Test and adjust layouts for 320px to 2560px widths
    - Convert DetailPanel to full-screen overlay on mobile
    - Increase touch target sizes to minimum 44px
    - Optimize map controls for touch interaction
    - Test on iOS Safari and Android Chrome
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 10.2 Optimize mobile performance
    - Implement lazy loading for PDF export library
    - Optimize asset sizes (compress SVGs, use WebP images)
    - Ensure load time under 3 seconds on mobile networks
    - Test animation performance on mobile devices
    - _Requirements: 8.5_

- [ ] 11. Final integration and testing
  - [ ] 11.1 Connect all components and test flows
    - Test admin login → full dashboard → vehicle selection → detail panel → interventions
    - Test driver login → personal dashboard → navigation → issue reporting
    - Verify status calculations update correctly every 4 seconds
    - Test logout and session persistence
    - Verify all 12 vehicles move smoothly with correct status colors
    - _Requirements: All_
  
  - [ ] 11.2 Performance optimization and bug fixes
    - Profile application performance with React DevTools
    - Optimize re-renders using React.memo and useMemo
    - Fix any console errors or warnings
    - Test for memory leaks during extended use
    - Ensure 60 FPS animation performance
    - _Requirements: All_
  
  - [ ] 11.3 Write unit tests for core logic
    - Test calculateVehicleStatus with various scenarios
    - Test calculateDistance Haversine formula accuracy
    - Test checkIfStationary with different speed histories
    - Test authentication login/logout functions
    - _Requirements: All_
  
  - [ ] 11.4 Prepare demo and deployment
    - Practice demo flow: login as admin, show fleet, login as driver, show navigation
    - Prepare talking points about ETA algorithm and status system
    - Deploy to Vercel or Netlify for live demo
    - Test deployed version on multiple devices
    - Create backup plan (local server) in case of network issues
    - _Requirements: All_
