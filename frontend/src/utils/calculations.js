import { DIRECTIONS, VEHICLE_TYPES, SIMULATION_CONSTANTS } from "./constants";

/**
 * Calculate position for a road element based on angle and distance
 */
export const calculateDirectionPosition = (angle, distance) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.sin(rad) * distance,
    z: Math.cos(rad) * distance,
    rotation: angle + 180, // Face towards intersection
  };
};

/**
 * Format simulation time from minutes to readable format
 */
export const formatSimulationTime = (minutes) => {
  if (!minutes && minutes !== 0) return "0m";

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
};

/**
 * Calculate vehicle positions in a queue
 */
export const calculateVehiclePositions = (vehicles, roadAngle, laneCount) => {
  const positions = [];
  const laneWidth = SIMULATION_CONSTANTS.LANE_WIDTH;
  const vehicleSpacing = SIMULATION_CONSTANTS.VEHICLE_SPACING;

  vehicles.forEach((vehicle, index) => {
    const lane = index % laneCount;
    const laneOffset = (lane - (laneCount - 1) / 2) * laneWidth;

    // Position in queue (further back for higher index)
    const queuePosition = -index * vehicleSpacing;

    // Calculate base position based on angle
    const rad = (roadAngle * Math.PI) / 180;
    const baseX = Math.sin(rad) * queuePosition;
    const baseZ = Math.cos(rad) * queuePosition;

    // Adjust for lane offset
    const x = baseX + Math.cos(rad) * laneOffset;
    const z = baseZ - Math.sin(rad) * laneOffset;
    const rotation = roadAngle + 180; // Face towards intersection

    positions.push({
      x,
      z,
      rotation,
      lane,
      positionInQueue: index,
      totalInLane: Math.ceil(vehicles.length / laneCount),
      vehicle,
    });
  });

  return positions;
};

/**
 * Calculate congestion color based on density level
 */
export const getCongestionColor = (level) => {
  if (level >= 80) return "#e74c3c"; // Red
  if (level >= 60) return "#f39c12"; // Orange
  if (level >= 40) return "#f1c40f"; // Yellow
  if (level >= 20) return "#2ecc71"; // Green
  return "#3498db"; // Blue
};

/**
 * Calculate priority color based on wait time
 */
export const getWaitTimeColor = (waitTime) => {
  if (waitTime > 10) return "#e74c3c"; // Red
  if (waitTime > 5) return "#f39c12"; // Orange
  if (waitTime > 2) return "#f1c40f"; // Yellow
  return "#2ecc71"; // Green
};

/**
 * Calculate environmental impact savings
 */
export const calculateEnvironmentalSavings = (
  waitTimeReduction,
  vehicleType
) => {
  const vehicleConfig = VEHICLE_TYPES[vehicleType] || VEHICLE_TYPES.car;

  const co2Saved = waitTimeReduction * vehicleConfig.emissionFactor;
  const fuelSaved = waitTimeReduction * vehicleConfig.fuelConsumption;

  return {
    co2Saved: parseFloat(co2Saved.toFixed(2)),
    fuelSaved: parseFloat(fuelSaved.toFixed(2)),
  };
};

/**
 * Calculate road priority score
 */
export const calculateRoadPriority = (
  vehicleCount,
  vehicleTypes,
  totalWaitTime,
  hasEmergency
) => {
  const maxCapacity = SIMULATION_CONSTANTS.MAX_VEHICLES_PER_LANE * 3; // Assuming 3 lanes max

  // Base density score
  const densityScore = (vehicleCount / maxCapacity) * 100;

  // Vehicle type score (emergency vehicles have high weight)
  let typeScore = 0;
  vehicleTypes.forEach((type) => {
    const vehicleConfig = VEHICLE_TYPES[type] || VEHICLE_TYPES.car;
    typeScore += vehicleConfig.priority;
  });
  typeScore = (typeScore / (vehicleCount || 1)) * 10;

  // Wait time score
  const waitTimeScore = Math.min(totalWaitTime / 100, 0.3) * 100;

  // Emergency vehicle boost
  const emergencyBoost = hasEmergency ? 50 : 0;

  // Total priority
  const totalPriority =
    densityScore * SIMULATION_CONSTANTS.WEIGHTS.DENSITY +
    typeScore * SIMULATION_CONSTANTS.WEIGHTS.VEHICLE_TYPE +
    waitTimeScore * SIMULATION_CONSTANTS.WEIGHTS.WAIT_TIME +
    emergencyBoost;

  return Math.min(totalPriority, 100);
};

/**
 * Calculate efficiency metrics
 */
export const calculateEfficiencyMetrics = (metrics) => {
  const {
    avg_wait_time = 0,
    congestion_level = 0,
    throughput = 0,
    emergency_vehicles = 0,
    vehicles_processed = 0,
    signal_changes = 0,
  } = metrics;

  // Traffic flow efficiency (0-100)
  const flowEfficiency = Math.max(
    0,
    100 - congestion_level * 0.7 - avg_wait_time * 3
  );

  // System responsiveness
  const responsiveness = emergency_vehicles > 0 ? 95 : 85;

  // Overall system efficiency
  const systemEfficiency =
    flowEfficiency * 0.5 +
    Math.min((throughput / 500) * 100, 100) * 0.3 +
    responsiveness * 0.2;

  return {
    flowEfficiency: parseFloat(flowEfficiency.toFixed(1)),
    systemEfficiency: parseFloat(systemEfficiency.toFixed(1)),
    responsiveness: parseFloat(responsiveness.toFixed(1)),
    congestionImpact: parseFloat(((congestion_level / 100) * 70).toFixed(1)),
    waitTimeImpact: parseFloat(
      ((Math.min(avg_wait_time, 10) / 10) * 30).toFixed(1)
    ),
  };
};

/**
 * Calculate traffic light timing
 */
export const calculateTrafficLightTiming = (
  density,
  hasEmergency,
  avgWaitTime
) => {
  const baseTime = SIMULATION_CONSTANTS.GREEN_SIGNAL_DURATION;

  let timing = baseTime;

  // Adjust based on density
  if (density > 80) {
    timing = Math.min(baseTime * 1.5, 60); // Extend for high density
  } else if (density < 20) {
    timing = Math.max(baseTime * 0.7, 15); // Shorten for low density
  }

  // Adjust for emergency vehicles
  if (hasEmergency) {
    timing = Math.min(timing * 1.2, 45);
  }

  // Adjust for long wait times
  if (avgWaitTime > 10) {
    timing = Math.min(timing * 1.3, 60);
  }

  return Math.round(timing);
};

/**
 * Get direction from angle
 */
export const getDirectionFromAngle = (angle) => {
  return DIRECTIONS.find((dir) => dir.angle === angle) || DIRECTIONS[0];
};

/**
 * Calculate distance between two points
 */
export const calculateDistance = (x1, z1, x2, z2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
};

/**
 * Generate random vehicle type based on probabilities
 */
export const generateRandomVehicleType = () => {
  const probabilities = [
    { type: "car", probability: 0.55 },
    { type: "motorcycle", probability: 0.15 },
    { type: "truck", probability: 0.1 },
    { type: "bus", probability: 0.08 },
    { type: "bicycle", probability: 0.1 },
    { type: "emergency", probability: 0.02 },
  ];

  const rand = Math.random();
  let cumulative = 0;

  for (const { type, probability } of probabilities) {
    cumulative += probability;
    if (rand <= cumulative) {
      return type;
    }
  }

  return "car";
};
