// User and Authentication Types
export interface User {
  id: string;
  name: string;
  role: 'admin' | 'driver';
  vehicleId?: string; // Only for drivers
  username?: string; // For authentication
  password?: string; // For authentication (not stored after login)
}

// Driver Profile Type
export interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  vehicleId: string;
  status: 'active' | 'inactive' | 'on-duty' | 'off-duty';
  rating: number;
  totalDeliveries: number;
  totalJobs: number;
  successfulDeliveries: number;
  totalDistanceCovered: number;
  onTimeDeliveryRate: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  pendingEarnings: number;
  averageEarningsPerJob: number;
  joinedDate: Date;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    type: string;
    registrationNumber: string;
    currentOdometer: number;
    capacity: number; // Vehicle capacity in kg
  };
  completedJobs: any[];
  earningsHistory: any[];
  activeJobs: any[];
}

// Vehicle Types
export type VehicleStatus = 'on-time' | 'warning' | 'critical';

export type CargoStatus = 'Fresh' | 'Frozen' | 'Mixed';

export interface Position {
  lat: number;
  lng: number;
}

export interface Destination extends Position {
  address: string;
}

export interface StatusHistoryEntry {
  timestamp: Date;
  status: VehicleStatus;
  speed: number;
  position: Position;
}

export interface Vehicle {
  id: string;
  driverId?: string; // Driver ID from database
  driverName: string;
  position: Position;
  destination: Destination;
  currentSpeed: number; // km/h
  heading?: number; // degrees, 0-360
  scheduledETA?: Date;
  cargoStatus?: CargoStatus;
  cargoTemperature?: number; // Celsius, for refrigerated cargo
  lastStopTime?: Date | null;
  status: VehicleStatus;
  statusHistory?: StatusHistoryEntry[];
  reportedIssue?: string; // Issue category if driver reported
  jobId?: string; // Associated job ID
  batteryLevel?: number;
  lastUpdate?: Date;
  route?: Position[];
  cargoType?: CargoStatus;
  estimatedDuration?: number;
  estimatedDistance?: number; // km
}

// Route Types
export interface Route {
  vehicleId: string;
  waypoints: Position[];
  distance: number; // km
  estimatedDuration: number; // minutes
  reason: string; // AI-generated explanation
}

// Status Calculation Types
export interface StatusCalculation {
  vehicleId: string;
  remainingDistance: number; // km
  timeUntilScheduledETA: number; // minutes
  requiredAverageSpeed: number; // km/h
  currentSpeed: number; // km/h
  status: VehicleStatus;
  projectedETA: Date;
  etaDifferenceMinutes: number;
}

// Component Props Types
export interface MapViewProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onVehicleClick: (vehicleId: string) => void;
  suggestedRoute: Route | null;
  viewMode: 'admin' | 'driver';
  currentUserId?: string;
}

export interface VehicleMarkerProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onClick: () => void;
  isCurrentUser?: boolean;
}

export interface DetailPanelProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onCallGus: () => void;
  onSuggestReroute: () => void;
}

export interface NavigationBarProps {
  user: User;
  onExportReport: () => void;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

export interface DriverNavigationBarProps {
  user: User;
  vehicle: Vehicle;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
}

export interface MyRoutePanelProps {
  vehicle: Vehicle;
  onReportIssue: () => void;
}

export interface StatusCounters {
  total: number;
  onTime: number;
  warning: number;
  critical: number;
}
