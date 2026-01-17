// Road directions configuration
export const DIRECTIONS = [
  {
    angle: 0,
    name: "NORTH",
    color: "#3498db",
    arrow: "↑",
    lanes: 3,
    fullName: "North Road",
  },
  {
    angle: 45,
    name: "NORTHEAST",
    color: "#2ecc71",
    arrow: "↗",
    lanes: 2,
    fullName: "Northeast Road",
  },
  {
    angle: 90,
    name: "EAST",
    color: "#e74c3c",
    arrow: "→",
    lanes: 3,
    fullName: "East Road",
  },
  {
    angle: 135,
    name: "SOUTHEAST",
    color: "#9b59b6",
    arrow: "↘",
    lanes: 2,
    fullName: "Southeast Road",
  },
  {
    angle: 180,
    name: "SOUTH",
    color: "#1abc9c",
    arrow: "↓",
    lanes: 3,
    fullName: "South Road",
  },
  {
    angle: 225,
    name: "SOUTHWEST",
    color: "#f39c12",
    arrow: "↙",
    lanes: 2,
    fullName: "Southwest Road",
  },
  {
    angle: 270,
    name: "WEST",
    color: "#34495e",
    arrow: "←",
    lanes: 3,
    fullName: "West Road",
  },
  {
    angle: 315,
    name: "NORTHWEST",
    color: "#7f8c8d",
    arrow: "↖",
    lanes: 2,
    fullName: "Northwest Road",
  },
];

// Vehicle types configuration
export const VEHICLE_TYPES = {
  car: {
    name: "Car",
    color: "#3498db",
    size: { width: 1.8, height: 0.6, length: 3 },
    priority: 2,
    emissionFactor: 0.12, // kg CO2 per minute
    fuelConsumption: 0.08, // liters per minute
    speed: 1.0,
  },
  motorcycle: {
    name: "Motorcycle",
    color: "#2ecc71",
    size: { width: 0.8, height: 0.5, length: 1.5 },
    priority: 1,
    emissionFactor: 0.04,
    fuelConsumption: 0.03,
    speed: 1.2,
  },
  truck: {
    name: "Truck",
    color: "#7f8c8d",
    size: { width: 2.5, height: 1.2, length: 5 },
    priority: 3,
    emissionFactor: 0.25,
    fuelConsumption: 0.15,
    speed: 0.8,
  },
  bus: {
    name: "Bus",
    color: "#e74c3c",
    size: { width: 2.5, height: 1.5, length: 6 },
    priority: 3,
    emissionFactor: 0.2,
    fuelConsumption: 0.12,
    speed: 0.9,
  },
  emergency: {
    name: "Emergency",
    color: "#ff0000",
    size: { width: 1.8, height: 0.6, length: 3 },
    priority: 100,
    emissionFactor: 0.15,
    fuelConsumption: 0.1,
    speed: 1.5,
  },
  bicycle: {
    name: "Bicycle",
    color: "#9b59b6",
    size: { width: 0.5, height: 0.5, length: 1.2 },
    priority: 1,
    emissionFactor: 0,
    fuelConsumption: 0,
    speed: 0.6,
  },
};

// Metrics configuration
export const METRICS_CONFIG = [
  {
    key: "avg_wait_time",
    label: "Average Wait Time",
    unit: "min",
    icon: "⏱️",
    color: "#3498db",
    format: (value) => value?.toFixed(1) || "0.0",
    description: "Average waiting time per vehicle",
    min: 0,
    max: 30,
    goodThreshold: 2,
    warningThreshold: 5,
    criticalThreshold: 10,
  },
  {
    key: "congestion_level",
    label: "Congestion Level",
    unit: "%",
    icon: "🚗",
    color: "#2ecc71",
    format: (value) => value?.toFixed(1) || "0.0",
    description: "Overall traffic density",
    min: 0,
    max: 100,
    goodThreshold: 40,
    warningThreshold: 60,
    criticalThreshold: 80,
  },
  {
    key: "emergency_vehicles",
    label: "Emergency Vehicles",
    unit: "",
    icon: "🚨",
    color: "#e74c3c",
    format: (value) => value?.toString() || "0",
    description: "Emergency vehicles served",
    min: 0,
    max: 10,
    goodThreshold: 0,
    warningThreshold: 1,
    criticalThreshold: 3,
  },
  {
    key: "throughput",
    label: "Throughput",
    unit: "veh/hr",
    icon: "📊",
    color: "#9b59b6",
    format: (value) => value?.toFixed(0) || "0",
    description: "Vehicles processed per hour",
    min: 0,
    max: 1000,
    goodThreshold: 400,
    warningThreshold: 200,
    criticalThreshold: 100,
  },
  {
    key: "co2_saved",
    label: "CO2 Saved",
    unit: "kg",
    icon: "🌱",
    color: "#1abc9c",
    format: (value) => value?.toFixed(1) || "0.0",
    description: "Emissions reduced",
    min: 0,
    max: 100,
    goodThreshold: 10,
    warningThreshold: 5,
    criticalThreshold: 2,
  },
  {
    key: "fuel_saved",
    label: "Fuel Saved",
    unit: "L",
    icon: "⛽",
    color: "#f39c12",
    format: (value) => value?.toFixed(1) || "0.0",
    description: "Fuel consumption reduced",
    min: 0,
    max: 50,
    goodThreshold: 8,
    warningThreshold: 4,
    criticalThreshold: 2,
  },
  {
    key: "vehicles_processed",
    label: "Vehicles Processed",
    unit: "",
    icon: "🚘",
    color: "#3498db",
    format: (value) => value?.toString() || "0",
    description: "Total vehicles cleared",
    min: 0,
    max: 10000,
  },
  {
    key: "signal_changes",
    label: "Signal Changes",
    unit: "",
    icon: "🚦",
    color: "#2ecc71",
    format: (value) => value?.toString() || "0",
    description: "Traffic signal changes",
    min: 0,
    max: 1000,
  },
];

// Alert thresholds
export const ALERT_THRESHOLDS = {
  CONGESTION_HIGH: 80,
  CONGESTION_MEDIUM: 60,
  WAIT_TIME_HIGH: 10,
  WAIT_TIME_CRITICAL: 20,
  EMERGENCY_PENDING: 3,
  LOW_THROUGHPUT: 100,
  HIGH_EFFICIENCY: 90,
  LOW_EFFICIENCY: 60,
};

// Simulation constants
export const SIMULATION_CONSTANTS = {
  TIME_SCALE: 60, // 1 real second = 60 simulation minutes
  VEHICLE_GENERATION_RATE: 5, // vehicles per minute
  GREEN_SIGNAL_DURATION: 30, // seconds
  MAX_VEHICLES_PER_LANE: 20,
  LANE_WIDTH: 3,
  VEHICLE_SPACING: 3,
  INTERSECTION_RADIUS: 8,
  ROAD_LENGTH: 25,

  // Priority calculation weights
  WEIGHTS: {
    DENSITY: 1.0,
    EMERGENCY_VEHICLES: 50.0,
    WAIT_TIME: 0.5,
    VEHICLE_TYPE: 0.3,
    STARVATION_PREVENTION: 0.2,
  },
};

// Color scales for visualization
export const COLOR_SCALES = {
  CONGESTION: ["#2ecc71", "#f1c40f", "#e74c3c"], // Green -> Yellow -> Red
  WAIT_TIME: ["#2ecc71", "#f39c12", "#e74c3c"], // Green -> Orange -> Red
  PRIORITY: ["#3498db", "#9b59b6", "#e74c3c"], // Blue -> Purple -> Red
  EFFICIENCY: ["#e74c3c", "#f1c40f", "#2ecc71"], // Red -> Yellow -> Green
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:8000",
  WEBSOCKET_URL: "ws://localhost:8000/ws",
  GET_STATE: "/state",
  ADD_EMERGENCY: "/emergency",
  UPDATE_CONFIG: "/config",
};

// Chart configurations
export const CHART_CONFIGS = {
  LINE_CHART: {
    height: 200,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    colors: ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"],
    strokeWidth: 2,
    dotSize: 4,
  },
  BAR_CHART: {
    height: 200,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
    barSize: 20,
    colors: ["#3498db", "#2ecc71", "#e74c3c", "#9b59b6", "#f39c12"],
  },
  PIE_CHART: {
    height: 200,
    colors: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"],
  },
};
