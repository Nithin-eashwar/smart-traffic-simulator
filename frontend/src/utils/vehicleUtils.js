import { VEHICLE_TYPES } from "./constants";

/**
 * Get vehicle configuration by type
 */
export const getVehicleConfig = (vehicleType) => {
  return VEHICLE_TYPES[vehicleType] || VEHICLE_TYPES.car;
};

/**
 * Calculate vehicle dimensions
 */
export const getVehicleDimensions = (vehicleType) => {
  const config = getVehicleConfig(vehicleType);
  return {
    width: config.size.width,
    height: config.size.height,
    length: config.size.length,
    volume: config.size.width * config.size.height * config.size.length,
  };
};

/**
 * Calculate vehicle priority
 */
export const calculateVehiclePriority = (
  vehicleType,
  waitingTime,
  isEmergency = false
) => {
  const config = getVehicleConfig(vehicleType);

  let priority = config.priority;

  // Increase priority with waiting time
  priority += waitingTime * 0.5;

  // Emergency vehicles get highest priority
  if (isEmergency) {
    priority += 50;
  }

  // Additional factors
  if (vehicleType === "bus") {
    priority += 5; // Public transport priority
  }

  return Math.min(priority, 100);
};

/**
 * Calculate vehicle emissions
 */
export const calculateVehicleEmissions = (
  vehicleType,
  idleTime,
  movingTime = 0
) => {
  const config = getVehicleConfig(vehicleType);

  const idleEmissions = idleTime * config.emissionFactor * 0.8; // Lower emissions when idle
  const movingEmissions = movingTime * config.emissionFactor;

  return {
    total: parseFloat((idleEmissions + movingEmissions).toFixed(2)),
    idle: parseFloat(idleEmissions.toFixed(2)),
    moving: parseFloat(movingEmissions.toFixed(2)),
  };
};

/**
 * Calculate vehicle fuel consumption
 */
export const calculateVehicleFuelConsumption = (
  vehicleType,
  idleTime,
  movingTime = 0
) => {
  const config = getVehicleConfig(vehicleType);

  const idleFuel = idleTime * config.fuelConsumption * 0.5; // Lower fuel consumption when idle
  const movingFuel = movingTime * config.fuelConsumption;

  return {
    total: parseFloat((idleFuel + movingFuel).toFixed(2)),
    idle: parseFloat(idleFuel.toFixed(2)),
    moving: parseFloat(movingFuel.toFixed(2)),
  };
};

/**
 * Calculate vehicle speed through intersection
 */
export const calculateVehicleSpeed = (vehicleType, roadDensity) => {
  const config = getVehicleConfig(vehicleType);
  const baseSpeed = config.speed;

  // Reduce speed based on road density
  const densityFactor = Math.max(0.3, 1 - roadDensity / 100);

  return baseSpeed * densityFactor;
};

/**
 * Calculate time to clear intersection
 */
export const calculateClearanceTime = (vehicleType, distanceToIntersection) => {
  const config = getVehicleConfig(vehicleType);
  const speed = config.speed;

  // Time = Distance / Speed
  return distanceToIntersection / speed;
};

/**
 * Check if vehicle can fit in lane
 */
export const canVehicleFitInLane = (vehicleType, availableSpace) => {
  const dimensions = getVehicleDimensions(vehicleType);
  return dimensions.width <= availableSpace;
};

/**
 * Get vehicle display name
 */
export const getVehicleDisplayName = (vehicleType) => {
  const config = getVehicleConfig(vehicleType);
  return config.name;
};

/**
 * Get vehicle color
 */
export const getVehicleColor = (vehicleType, isEmergency = false) => {
  if (isEmergency) return "#ff0000";
  const config = getVehicleConfig(vehicleType);
  return config.color;
};

/**
 * Get vehicle icon
 */
export const getVehicleIcon = (vehicleType) => {
  const icons = {
    car: "🚗",
    motorcycle: "🏍️",
    truck: "🚚",
    bus: "🚌",
    emergency: "🚨",
    bicycle: "🚲",
  };

  return icons[vehicleType] || "🚗";
};

/**
 * Calculate vehicle queue position
 */
export const calculateQueuePosition = (
  queueIndex,
  laneIndex,
  totalLanes,
  laneWidth
) => {
  const laneOffset = (laneIndex - (totalLanes - 1) / 2) * laneWidth;
  const queueOffset = -queueIndex * 3; // 3 units spacing between vehicles

  return {
    laneOffset,
    queueOffset,
    totalOffset: queueOffset,
  };
};

/**
 * Generate vehicle data for simulation
 */
export const generateVehicleData = (vehicleType, timestamp) => {
  const config = getVehicleConfig(vehicleType);

  return {
    id: `${vehicleType}_${timestamp}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    type: vehicleType,
    name: config.name,
    color: config.color,
    priority: config.priority,
    emissionFactor: config.emissionFactor,
    fuelConsumption: config.fuelConsumption,
    speed: config.speed,
    dimensions: config.size,
    waitingTime: 0,
    enteredAt: timestamp,
    emergency: vehicleType === "emergency",
    processed: false,
  };
};

/**
 * Update vehicle waiting time
 */
export const updateVehicleWaitingTime = (vehicle, elapsedTime) => {
  return {
    ...vehicle,
    waitingTime: vehicle.waitingTime + elapsedTime,
    priority: calculateVehiclePriority(
      vehicle.type,
      vehicle.waitingTime + elapsedTime,
      vehicle.emergency
    ),
  };
};

/**
 * Calculate total vehicles by type
 */
export const calculateVehiclesByType = (vehicles) => {
  const counts = {
    car: 0,
    motorcycle: 0,
    truck: 0,
    bus: 0,
    emergency: 0,
    bicycle: 0,
    total: vehicles.length,
  };

  vehicles.forEach((vehicle) => {
    if (counts[vehicle.type] !== undefined) {
      counts[vehicle.type]++;
    }
  });

  return counts;
};

/**
 * Calculate average wait time by vehicle type
 */
export const calculateAverageWaitTimeByType = (vehicles) => {
  const totals = {
    car: { sum: 0, count: 0 },
    motorcycle: { sum: 0, count: 0 },
    truck: { sum: 0, count: 0 },
    bus: { sum: 0, count: 0 },
    emergency: { sum: 0, count: 0 },
    bicycle: { sum: 0, count: 0 },
  };

  vehicles.forEach((vehicle) => {
    if (totals[vehicle.type]) {
      totals[vehicle.type].sum += vehicle.waitingTime;
      totals[vehicle.type].count++;
    }
  });

  const averages = {};
  Object.keys(totals).forEach((type) => {
    const data = totals[type];
    averages[type] = data.count > 0 ? data.sum / data.count : 0;
  });

  return averages;
};
