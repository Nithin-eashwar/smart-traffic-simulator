import React, { useMemo } from "react";

const Vehicle = ({ position, rotation, type, emergency, waitingTime }) => {
  // Vehicle configurations - using simple colors and basic materials
  const vehicleConfig = useMemo(() => {
    const configs = {
      car: { width: 1.8, height: 0.6, length: 3, color: "#3498db" },
      motorcycle: { width: 0.8, height: 0.5, length: 1.5, color: "#2ecc71" },
      truck: { width: 2.5, height: 1.2, length: 5, color: "#7f8c8d" },
      bus: { width: 2.5, height: 1.5, length: 6, color: "#e74c3c" },
      emergency: { width: 1.8, height: 0.6, length: 3, color: "#ff0000" },
      bicycle: { width: 0.5, height: 0.5, length: 1.2, color: "#9b59b6" },
    };
    return configs[type] || configs.car;
  }, [type]);

  // Priority color based on waiting time
  const priorityColor = useMemo(() => {
    if (waitingTime > 10) return "#e74c3c";
    if (waitingTime > 5) return "#f39c12";
    if (waitingTime > 2) return "#f1c40f";
    return "#2ecc71";
  }, [waitingTime]);

  return (
    <group position={position} rotation={rotation}>
      {/* Main vehicle body */}
      <mesh castShadow>
        <boxGeometry args={[vehicleConfig.width, vehicleConfig.height, vehicleConfig.length]} />
        <meshStandardMaterial 
          color={emergency ? "#ff0000" : vehicleConfig.color}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Cabin/roof for larger vehicles */}
      {(type === "car" || type === "emergency") && (
        <mesh position={[0, 0.4, -0.2]} castShadow>
          <boxGeometry args={[1.4, 0.4, 1.5]} />
          <meshStandardMaterial 
            color={emergency ? "#cc0000" : "#2980b9"}
            roughness={0.7}
          />
        </mesh>
      )}

      {/* Emergency lights */}
      {emergency && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 6]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
      )}

      {/* Waiting time indicator (small sphere above vehicle) */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshBasicMaterial color={priorityColor} />
      </mesh>

      {/* Simplified wheels - only for larger vehicles */}
      {["car", "truck", "bus", "emergency"].includes(type) && (
        <>
          {/* Front left */}
          <mesh position={[-vehicleConfig.width/2, -0.2, vehicleConfig.length/3]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 8]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          {/* Front right */}
          <mesh position={[vehicleConfig.width/2, -0.2, vehicleConfig.length/3]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 8]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          {/* Back left */}
          <mesh position={[-vehicleConfig.width/2, -0.2, -vehicleConfig.length/3]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 8]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
          {/* Back right */}
          <mesh position={[vehicleConfig.width/2, -0.2, -vehicleConfig.length/3]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 8]} />
            <meshBasicMaterial color="#1a1a1a" />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Vehicle;
