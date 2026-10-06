/**
 * City Road Network Data
 * Intersections (Vertices) and Roads (Edges)
 * Coords mapped to both 2D SVG canvas (x, y) and realistic Geo Coordinates (lat, lng)
 */

export const INITIAL_INTERSECTIONS = [
  { id: 'A', name: 'Metro Terminal Junction', x: 80, y: 120, lat: 17.3850, lng: 78.4867, type: 'Transit Hub', activeSignals: 4 },
  { id: 'B', name: 'Financial District North', x: 260, y: 70, lat: 17.4100, lng: 78.4980, type: 'Commercial', activeSignals: 4 },
  { id: 'C', name: 'University Central Square', x: 190, y: 240, lat: 17.3980, lng: 78.4650, type: 'Educational', activeSignals: 3 },
  { id: 'D', name: 'Tech City Outer Ring', x: 420, y: 130, lat: 17.4350, lng: 78.5120, type: 'IT Corridor', activeSignals: 4 },
  { id: 'E', name: 'General Hospital Circle', x: 340, y: 310, lat: 17.3700, lng: 78.4480, type: 'Healthcare Zone', activeSignals: 4 },
  { id: 'F', name: 'Downtown Expressway Plaza', x: 550, y: 260, lat: 17.4150, lng: 78.4720, type: 'Civic Core', activeSignals: 6 },
  { id: 'G', name: 'Airport Corridor Hub', x: 720, y: 360, lat: 17.3500, lng: 78.5300, type: 'Logistics Hub', activeSignals: 4 },
  { id: 'H', name: 'Eco Park Boulevard', x: 620, y: 100, lat: 17.4480, lng: 78.4600, type: 'Residential', activeSignals: 3 }
];

export const INITIAL_ROADS = [
  {
    id: 'R1',
    from: 'A',
    to: 'B',
    name: 'Metro Linkway A-B',
    weight: 4.2, // km
    lanes: 4,
    trafficStatus: 'Low', // Low, Medium, High, Critical
    density: 28, // %
    currentSpeed: 52, // km/h
    status: 'Open', // Open, Congested, Closed
    incidents: null
  },
  {
    id: 'R2',
    from: 'A',
    to: 'C',
    name: 'University Expressway A-C',
    weight: 3.5,
    lanes: 3,
    trafficStatus: 'Medium',
    density: 56,
    currentSpeed: 38,
    status: 'Open',
    incidents: 'Moderate morning student commute flow'
  },
  {
    id: 'R3',
    from: 'B',
    to: 'D',
    name: 'Tech Parkway B-D',
    weight: 5.1,
    lanes: 6,
    trafficStatus: 'High',
    density: 78,
    currentSpeed: 24,
    status: 'Open',
    incidents: 'Corporate peak-hour surge'
  },
  {
    id: 'R4',
    from: 'C',
    to: 'D',
    name: 'Central Bypass C-D',
    weight: 6.0,
    lanes: 4,
    trafficStatus: 'Low',
    density: 32,
    currentSpeed: 48,
    status: 'Open',
    incidents: null
  },
  {
    id: 'R5',
    from: 'C',
    to: 'E',
    name: 'Health Highway C-E',
    weight: 2.8,
    lanes: 4,
    trafficStatus: 'Medium',
    density: 50,
    currentSpeed: 40,
    status: 'Open',
    incidents: 'Designated Ambulance Corridor'
  },
  {
    id: 'R6',
    from: 'D',
    to: 'F',
    name: 'Grand Trunk Crossroad D-F',
    weight: 4.8,
    lanes: 6,
    trafficStatus: 'Critical',
    density: 92,
    currentSpeed: 12,
    status: 'Open',
    incidents: 'Multi-vehicle stall near Sector 4'
  },
  {
    id: 'R7',
    from: 'E',
    to: 'F',
    name: 'Plaza Link Arterial E-F',
    weight: 5.4,
    lanes: 4,
    trafficStatus: 'Low',
    density: 22,
    currentSpeed: 55,
    status: 'Open',
    incidents: null
  },
  {
    id: 'R8',
    from: 'F',
    to: 'G',
    name: 'Airport Skyway F-G',
    weight: 7.2,
    lanes: 6,
    trafficStatus: 'Medium',
    density: 46,
    currentSpeed: 62,
    status: 'Open',
    incidents: null
  },
  {
    id: 'R9',
    from: 'B',
    to: 'H',
    name: 'Eco North Connector B-H',
    weight: 3.9,
    lanes: 2,
    trafficStatus: 'Low',
    density: 18,
    currentSpeed: 45,
    status: 'Open',
    incidents: null
  },
  {
    id: 'R10',
    from: 'H',
    to: 'D',
    name: 'Cyber Ridge Pass H-D',
    weight: 4.1,
    lanes: 4,
    trafficStatus: 'Medium',
    density: 54,
    currentSpeed: 36,
    status: 'Open',
    incidents: null
  }
];

export const INITIAL_EMERGENCY_REQUESTS = [
  {
    id: 'ER-101',
    vehicleId: 'AMB-ALPHA-01',
    type: 'Ambulance',
    priority: 1, // 1: Critical
    priorityLabel: 'Critical',
    source: 'A',
    destination: 'E',
    patientCondition: 'Cardiac Arrest - CPR in progress',
    status: 'En Route',
    assignedSignalClearance: true,
    timestamp: Date.now() - 360000
  },
  {
    id: 'ER-102',
    vehicleId: 'FIRE-BRAVO-04',
    type: 'Fire Service',
    priority: 1, // 1: Critical
    priorityLabel: 'Critical',
    source: 'B',
    destination: 'F',
    patientCondition: 'Commercial High-Rise Fire Alarm 3',
    status: 'Dispatched',
    assignedSignalClearance: true,
    timestamp: Date.now() - 240000
  },
  {
    id: 'ER-103',
    vehicleId: 'POLICE-CHARLIE-09',
    type: 'Police',
    priority: 2, // 2: High
    priorityLabel: 'High',
    source: 'C',
    destination: 'G',
    patientCondition: 'Highway Armed Escort & Crash Clearance',
    status: 'Dispatched',
    assignedSignalClearance: false,
    timestamp: Date.now() - 120000
  },
  {
    id: 'ER-104',
    vehicleId: 'AMB-DELTA-12',
    type: 'Ambulance',
    priority: 3, // 3: Medium
    priorityLabel: 'Medium',
    source: 'D',
    destination: 'E',
    patientCondition: 'Inter-facility Patient Transfer',
    status: 'Standby',
    assignedSignalClearance: false,
    timestamp: Date.now() - 60000
  },
  {
    id: 'ER-105',
    vehicleId: 'POLICE-ECHO-15',
    type: 'Police',
    priority: 4, // 4: Low
    priorityLabel: 'Low',
    source: 'H',
    destination: 'B',
    patientCondition: 'Routine Traffic Density Escort',
    status: 'Queued',
    assignedSignalClearance: false,
    timestamp: Date.now() - 10000
  }
];

export const INITIAL_SIGNALS = [
  {
    id: 'SIG-A',
    intersectionId: 'A',
    name: 'Metro Terminal 4-Way',
    status: 'Green', // Green, Yellow, Red
    activeDirection: 'North-South',
    vehicleDensity: 'Low',
    greenTime: 45,
    redTime: 25,
    waitingVehicles: 14,
    emergencyPriority: false,
    cycleTime: 70
  },
  {
    id: 'SIG-B',
    intersectionId: 'B',
    name: 'Financial Ringway Cross',
    status: 'Green',
    activeDirection: 'East-West',
    vehicleDensity: 'Medium',
    greenTime: 55,
    redTime: 35,
    waitingVehicles: 32,
    emergencyPriority: false,
    cycleTime: 90
  },
  {
    id: 'SIG-C',
    intersectionId: 'C',
    name: 'University Square Tri-Way',
    status: 'Red',
    activeDirection: 'North-South',
    vehicleDensity: 'Medium',
    greenTime: 40,
    redTime: 40,
    waitingVehicles: 28,
    emergencyPriority: false,
    cycleTime: 80
  },
  {
    id: 'SIG-D',
    intersectionId: 'D',
    name: 'Tech City Outer Junction',
    status: 'Red',
    activeDirection: 'East-West',
    vehicleDensity: 'High',
    greenTime: 30,
    redTime: 60,
    waitingVehicles: 64,
    emergencyPriority: false,
    cycleTime: 90
  },
  {
    id: 'SIG-E',
    intersectionId: 'E',
    name: 'Hospital Med-Zone Square',
    status: 'Green',
    activeDirection: 'North-South',
    vehicleDensity: 'Medium',
    greenTime: 60,
    redTime: 20,
    waitingVehicles: 18,
    emergencyPriority: true, // Hospital priority
    cycleTime: 80
  },
  {
    id: 'SIG-F',
    intersectionId: 'F',
    name: 'Downtown Plaza 6-Point',
    status: 'Red',
    activeDirection: 'Outer Ring',
    vehicleDensity: 'Critical',
    greenTime: 25,
    redTime: 75,
    waitingVehicles: 89,
    emergencyPriority: false,
    cycleTime: 100
  },
  {
    id: 'SIG-G',
    intersectionId: 'G',
    name: 'Airport Expressway Split',
    status: 'Green',
    activeDirection: 'Highway Main',
    vehicleDensity: 'Low',
    greenTime: 50,
    redTime: 25,
    waitingVehicles: 12,
    emergencyPriority: false,
    cycleTime: 75
  },
  {
    id: 'SIG-H',
    intersectionId: 'H',
    name: 'Eco Ridge Roundabout',
    status: 'Green',
    activeDirection: 'Circular Flow',
    vehicleDensity: 'Low',
    greenTime: 40,
    redTime: 20,
    waitingVehicles: 8,
    emergencyPriority: false,
    cycleTime: 60
  }
];

export const INITIAL_IOT_SENSORS = [
  {
    id: 'IOT-DENS-101',
    type: 'Traffic Density Sensor',
    icon: 'Activity',
    location: 'Inter. D - Tech Parkway',
    status: 'Online',
    lastUpdate: 'Just now',
    reading: '78.4%',
    unit: 'Occupancy',
    health: 98,
    firmware: 'v3.2.1'
  },
  {
    id: 'IOT-VEH-102',
    type: 'Vehicle Counting Radar',
    icon: 'Car',
    location: 'Road R6 - Grand Trunk',
    status: 'Online',
    lastUpdate: '4s ago',
    reading: '1,420',
    unit: 'veh / hr',
    health: 94,
    firmware: 'v2.8.0'
  },
  {
    id: 'IOT-SPD-103',
    type: 'Doppler Speed Detector',
    icon: 'Gauge',
    location: 'Road R8 - Airport Skyway',
    status: 'Online',
    lastUpdate: '2s ago',
    reading: '62.5',
    unit: 'km/h avg',
    health: 99,
    firmware: 'v3.4.0'
  },
  {
    id: 'IOT-AQI-104',
    type: 'Smart Air Quality Node',
    icon: 'Wind',
    location: 'Inter. F - Downtown Core',
    status: 'Warning',
    lastUpdate: '18s ago',
    reading: '184',
    unit: 'AQI (Unhealthy)',
    health: 81,
    firmware: 'v1.9.5'
  },
  {
    id: 'IOT-SURF-105',
    type: 'Road Surface Condition',
    icon: 'ShieldAlert',
    location: 'Inter. E - Hospital Circle',
    status: 'Online',
    lastUpdate: '1m ago',
    reading: 'Dry & Clear',
    unit: 'Friction Index: 0.88',
    health: 95,
    firmware: 'v2.1.2'
  },
  {
    id: 'IOT-OPT-106',
    type: 'Optical Camera Feed Analyzer',
    icon: 'Camera',
    location: 'Inter. B - Financial District',
    status: 'Offline',
    lastUpdate: '14m ago (Telemetry Timeout)',
    reading: 'NO_SIGNAL',
    unit: 'Optical Stream',
    health: 0,
    firmware: 'v3.0.0'
  }
];

export const INITIAL_AI_PREDICTIONS = [
  { time: '08:00', actual: 48, predicted: 45, confidence: 96, level: 'Medium', expectedDelaysMin: 4 },
  { time: '09:00', actual: 82, predicted: 84, confidence: 94, level: 'High', expectedDelaysMin: 18 },
  { time: '10:00', actual: 88, predicted: 91, confidence: 91, level: 'Critical', expectedDelaysMin: 26 },
  { time: '11:00', actual: 64, predicted: 62, confidence: 93, level: 'Medium', expectedDelaysMin: 8 },
  { time: '12:00', actual: 42, predicted: 40, confidence: 95, level: 'Low', expectedDelaysMin: 2 },
  { time: '13:00', actual: 50, predicted: 52, confidence: 92, level: 'Medium', expectedDelaysMin: 5 },
  { time: '14:00', actual: 45, predicted: 44, confidence: 94, level: 'Low', expectedDelaysMin: 3 },
  { time: '15:00', actual: 58, predicted: 60, confidence: 90, level: 'Medium', expectedDelaysMin: 7 },
  { time: '16:00', actual: 75, predicted: 78, confidence: 92, level: 'High', expectedDelaysMin: 14 },
  { time: '17:00', actual: 92, predicted: 95, confidence: 89, level: 'Critical', expectedDelaysMin: 28 },
  { time: '18:00', actual: 95, predicted: 97, confidence: 88, level: 'Critical', expectedDelaysMin: 34 },
  { time: '19:00', actual: 78, predicted: 74, confidence: 91, level: 'High', expectedDelaysMin: 16 }
];

export const BENCHMARK_SCENARIOS = {
  low: {
    label: 'Low Scale (Small City Core)',
    intersections: 15,
    roads: 28,
    avgDijkstraTimeMs: 0.12,
    nodesVisited: 8,
    pathLengthKm: 14.5,
    emergencyResponseMin: 4.8,
    complexity: 'O((V + E) log V) ≈ 140 operations'
  },
  medium: {
    label: 'Medium Scale (Metro District)',
    intersections: 250,
    roads: 720,
    avgDijkstraTimeMs: 1.45,
    nodesVisited: 92,
    pathLengthKm: 38.2,
    emergencyResponseMin: 7.4,
    complexity: 'O((V + E) log V) ≈ 7,760 operations'
  },
  high: {
    label: 'High Scale (Megacity Grid)',
    intersections: 1500,
    roads: 4800,
    avgDijkstraTimeMs: 9.85,
    nodesVisited: 640,
    pathLengthKm: 82.6,
    emergencyResponseMin: 14.2,
    complexity: 'O((V + E) log V) ≈ 66,150 operations'
  }
};
