# Requirements Document

## Introduction

Los Pollos Tracker is a real-time dynamic route status dashboard for monitoring a fleet of delivery vehicles. Themed after Breaking Bad's Los Pollos Hermanos, the system simulates GPS tracking of refrigerated chicken trucks, providing immediate visual feedback on delivery status, delays, and route optimization. The application targets logistics dispatchers who need to monitor fleet status and respond to delays in real-time.

## Glossary

- **Dashboard**: The web-based monitoring interface displaying the map and vehicle status
- **Vehicle Marker**: Visual representation of a truck on the map
- **Critical Delay Status**: Condition when a vehicle travels below 8 km/h for more than 10 minutes (stationary/stuck)
- **Warning Status**: Condition when a vehicle travels below the Required Average Speed but above 8 km/h
- **On-Time Status**: Condition when a vehicle travels at or above the Required Average Speed
- **Required Average Speed**: Calculated speed needed to reach destination by scheduled ETA based on remaining distance
- **Detail Panel**: Slide-in interface showing comprehensive vehicle information
- **Status Counter**: Real-time display of active and delayed shipments
- **GPS Update**: Simulated location data received every 4 seconds
- **Route Animation**: Visual path displayed on the map showing suggested alternate routes

## Requirements

### Requirement 1

**User Story:** As a dispatcher, I want to see all active delivery vehicles on an interactive map, so that I can monitor the entire fleet at a glance

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Dashboard SHALL display an interactive map with 12 vehicle markers
2. THE Dashboard SHALL update vehicle marker positions every 4 seconds to simulate real-time GPS movement
3. THE Dashboard SHALL render vehicle markers using custom chicken truck SVG icons
4. WHEN a user interacts with the map, THE Dashboard SHALL support pan, zoom, and marker click operations
5. THE Dashboard SHALL display the map using Leaflet.js with desert-themed tile styling

### Requirement 2

**User Story:** As a dispatcher, I want vehicles to be color-coded based on their ability to meet scheduled delivery times, so that I can prioritize interventions effectively

#### Acceptance Criteria

1. THE Dashboard SHALL calculate Required Average Speed for each vehicle using the formula: remaining distance divided by time until scheduled ETA
2. WHEN a vehicle travels at or above Required Average Speed, THE Dashboard SHALL display the vehicle marker in green color
3. WHEN a vehicle travels below Required Average Speed but above 8 km/h, THE Dashboard SHALL display the vehicle marker in yellow color
4. WHEN a vehicle travels below 8 km/h continuously for more than 10 minutes, THE Dashboard SHALL display the vehicle marker in red color
5. WHILE a vehicle has Critical Delay Status, THE Dashboard SHALL display a flashing red halo animation around the marker
6. WHEN a vehicle enters Critical Delay Status, THE Dashboard SHALL play the Los Pollos Hermanos jingle in distorted form
7. THE Dashboard SHALL recalculate Required Average Speed every 4 seconds when GPS Update occurs
8. THE Dashboard SHALL transition marker colors smoothly over 500 milliseconds when status changes

### Requirement 3

**User Story:** As a dispatcher, I want to view detailed information about a specific vehicle, so that I can assess its current status and make informed decisions

#### Acceptance Criteria

1. WHEN a user clicks a vehicle marker, THE Dashboard SHALL display a Detail Panel with vehicle information
2. THE Detail Panel SHALL include driver name, current speed, Required Average Speed, time since last stop, cargo status, scheduled ETA, and current ETA projection
3. THE Detail Panel SHALL display the difference between scheduled ETA and projected ETA in minutes
4. THE Detail Panel SHALL slide in from the right side with smooth animation completing within 300 milliseconds
5. WHEN a user clicks outside the Detail Panel or presses escape key, THE Dashboard SHALL close the panel
6. WHERE a vehicle has Warning Status or Critical Delay Status, THE Detail Panel SHALL display status-specific information including time below required speed

### Requirement 4

**User Story:** As a dispatcher, I want to see real-time fleet statistics, so that I can understand overall operational status

#### Acceptance Criteria

1. THE Dashboard SHALL display a status counter showing total active shipments
2. THE Dashboard SHALL display a status counter showing vehicles with On-Time Status in green
3. THE Dashboard SHALL display a status counter showing vehicles with Warning Status in yellow
4. THE Dashboard SHALL display a status counter showing vehicles with Critical Delay Status in red
5. THE Dashboard SHALL update status counters within 1 second of any vehicle status change
6. THE Dashboard SHALL display a live clock showing current time in 12-hour format
7. THE Dashboard SHALL position the status counter in the top navigation bar for constant visibility

### Requirement 5

**User Story:** As a dispatcher, I want the interface to reflect Los Pollos Hermanos branding, so that the application is memorable and engaging

#### Acceptance Criteria

1. THE Dashboard SHALL use a color palette with green (#22C55E) for On-Time Status, yellow (#F9D71C) for Warning Status, red (#EF4444) for Critical Delay Status, accent orange (#C14D00), and dark background (#0F0F0F)
2. THE Dashboard SHALL display the Los Pollos Hermanos logo with smiling chicken icon in the navigation bar
3. THE Dashboard SHALL include the tagline "Taste the Family... On Time" in the navigation bar
4. WHEN a vehicle enters Critical Delay Status, THE Dashboard SHALL display the message "THE ONE WHO KNOCKS IS ANGRY" near the delayed vehicle marker
5. THE Dashboard SHALL support dark mode toggle while maintaining brand colors and contrast ratios

### Requirement 6

**User Story:** As a dispatcher, I want to interact with delayed vehicles, so that I can take corrective action

#### Acceptance Criteria

1. WHERE a vehicle has Warning Status or Critical Delay Status, THE Detail Panel SHALL display a "Call Gus" button
2. WHEN a user clicks the "Call Gus" button, THE Dashboard SHALL play a simulated phone call sound effect with the message "The shipment is late"
3. WHERE a vehicle has Warning Status or Critical Delay Status, THE Detail Panel SHALL display a "Suggest Reroute" button
4. WHEN a user clicks "Suggest Reroute", THE Dashboard SHALL display a simulated AI response suggesting an alternate route with new Required Average Speed calculation
5. WHEN a reroute is suggested, THE Dashboard SHALL animate the suggested route on the map for 5 seconds
6. THE Dashboard SHALL provide visual feedback for all button interactions within 200 milliseconds

### Requirement 7

**User Story:** As a dispatcher, I want to export fleet status reports, so that I can document operational performance

#### Acceptance Criteria

1. THE Dashboard SHALL display an "Export Report" button in the navigation bar
2. WHEN a user clicks "Export Report", THE Dashboard SHALL generate a PDF containing current fleet status
3. THE Dashboard SHALL include all active vehicles, their status, delay information, and timestamp in the exported report
4. THE Dashboard SHALL complete the export operation within 3 seconds
5. THE Dashboard SHALL provide download confirmation feedback to the user with success message

### Requirement 8

**User Story:** As a dispatcher using mobile devices, I want the dashboard to work on any screen size, so that I can monitor the fleet from anywhere

#### Acceptance Criteria

1. THE Dashboard SHALL render correctly on screen widths from 320px to 2560px
2. WHEN viewed on mobile devices, THE Dashboard SHALL adjust the Detail Panel to full-screen overlay
3. THE Dashboard SHALL maintain all core functionality on touch-enabled devices
4. THE Dashboard SHALL optimize map controls for touch interaction on mobile devices with larger touch targets
5. THE Dashboard SHALL load and render within 3 seconds on mobile network connections

### Requirement 9

**User Story:** As a dispatcher, I want smooth vehicle movement animations, so that the tracking feels realistic and professional

#### Acceptance Criteria

1. WHEN a vehicle receives a GPS Update, THE Dashboard SHALL animate the marker movement smoothly over 4 seconds
2. THE Dashboard SHALL rotate vehicle marker icons to match the direction of travel
3. THE Dashboard SHALL use easing functions for natural acceleration and deceleration of marker movement
4. WHEN multiple vehicles update simultaneously, THE Dashboard SHALL maintain smooth animation performance at 60 frames per second
5. THE Dashboard SHALL prevent marker jitter or jumping during position updates


### Requirement 10

**User Story:** As a user, I want to log in with my role (admin or driver), so that I can access the appropriate dashboard for my responsibilities

#### Acceptance Criteria

1. WHEN the Dashboard loads without an authenticated session, THE Dashboard SHALL display a login screen
2. THE Dashboard SHALL provide role selection options for admin and driver login
3. WHEN a user enters valid credentials, THE Dashboard SHALL authenticate the user and redirect to the appropriate dashboard
4. WHEN a user enters invalid credentials, THE Dashboard SHALL display an error message within 1 second
5. THE Dashboard SHALL persist the authenticated session in browser storage until logout
6. THE Dashboard SHALL provide a logout button that clears the session and returns to the login screen

### Requirement 11

**User Story:** As an admin, I want to see a full fleet dashboard with all vehicles, so that I can monitor and manage the entire delivery operation

#### Acceptance Criteria

1. WHEN an admin user logs in, THE Dashboard SHALL display the admin dashboard with all 12 vehicles visible on the map
2. THE Dashboard SHALL display status counters showing on-time, warning, and critical vehicle counts
3. THE Dashboard SHALL allow the admin to click any vehicle marker to view detailed information
4. THE Dashboard SHALL provide export report functionality accessible only to admin users
5. THE Dashboard SHALL provide intervention actions (Call Gus, Suggest Reroute) for delayed vehicles
6. THE Dashboard SHALL update all vehicle positions and statuses in real-time every 4 seconds

### Requirement 12

**User Story:** As a driver, I want to see my personal navigation dashboard, so that I can focus on my delivery and reach my destination on time

#### Acceptance Criteria

1. WHEN a driver user logs in, THE Dashboard SHALL display only their assigned vehicle and destination on the map
2. THE Dashboard SHALL display a My Route panel showing destination address, distance remaining, and ETA information
3. THE Dashboard SHALL display current speed compared to required average speed
4. THE Dashboard SHALL show the difference between scheduled ETA and projected ETA in minutes
5. WHERE the driver has Warning Status or Critical Delay Status, THE Dashboard SHALL display visual and audio alerts
6. THE Dashboard SHALL provide a Report Issue button for drivers to notify dispatch of problems

### Requirement 13

**User Story:** As a driver, I want to receive turn-by-turn navigation guidance, so that I can follow the optimal route to my destination

#### Acceptance Criteria

1. THE Dashboard SHALL display simulated turn-by-turn navigation instructions in the My Route panel
2. THE Dashboard SHALL update navigation instructions every 30 seconds based on vehicle position
3. THE Dashboard SHALL show distance to the next turn in kilometers
4. THE Dashboard SHALL display direction indicators (left, right, straight) for upcoming turns
5. THE Dashboard SHALL highlight the next turn instruction with visual emphasis

### Requirement 14

**User Story:** As a driver, I want to monitor my cargo status, so that I can ensure the delivery maintains proper conditions

#### Acceptance Criteria

1. THE Dashboard SHALL display cargo type (Fresh, Frozen, or Mixed) in the My Route panel
2. WHERE cargo is refrigerated, THE Dashboard SHALL display current temperature
3. WHERE temperature is out of acceptable range, THE Dashboard SHALL display a warning indicator
4. THE Dashboard SHALL update cargo status information every 4 seconds
5. THE Dashboard SHALL use color coding to indicate cargo status (green for normal, red for issues)

### Requirement 15

**User Story:** As a driver, I want to report issues to dispatch, so that I can get help when problems occur

#### Acceptance Criteria

1. THE Dashboard SHALL display a Report Issue button in the My Route panel
2. WHEN a driver clicks Report Issue, THE Dashboard SHALL display a modal with issue category options
3. THE Dashboard SHALL provide issue categories including Traffic Jam, Vehicle Problem, Weather Conditions, Road Closure, and Other
4. WHEN a driver submits an issue report, THE Dashboard SHALL display a confirmation message
5. WHERE a driver has reported an issue, THE Dashboard SHALL display an issue flag on the vehicle marker in the admin dashboard
