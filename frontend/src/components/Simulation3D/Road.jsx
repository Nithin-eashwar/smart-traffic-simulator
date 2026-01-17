import React, { useMemo } from "react";
import Vehicle from "./Vehicle";

const Road = ({
  angle,
  name,
  lanes,
  color,
  vehicles,
  isActive,
  vehicleCount,
  density,
}) => {
  const roadLength = 25;
  const roadWidth = lanes * 3;
  const roadRotation = angle * (Math.PI / 180);

  // Calculate vehicle positions in the queue
  const vehiclePositions = useMemo(() => {
    const positions = [];
    const laneWidth = 2.5;

    vehicles.forEach((vehicle, index) => {
      const lane = index % lanes;
      const laneOffset = (lane - (lanes - 1) / 2) * laneWidth;

      // Position in queue - start further from center, space vehicles apart
      const queuePosition = 12 + index * 3.5;

      // Calculate base position based on angle
      const rad = (angle * Math.PI) / 180;
      const baseX = Math.sin(rad) * queuePosition;
      const baseZ = Math.cos(rad) * queuePosition;

      // Adjust for lane offset
      const x = baseX + Math.cos(rad) * laneOffset;
      const z = baseZ - Math.sin(rad) * laneOffset;
      const rotation = angle + 180;

      positions.push({
        x,
        z,
        rotation,
        lane,
        vehicle,
      });
    });

    return positions;
  }, [vehicles, angle, lanes]);

  // Congestion color indicator
  const congestionColor = useMemo(() => {
    if (density >= 80) return "#e74c3c";
    if (density >= 60) return "#f39c12";
    if (density >= 40) return "#f1c40f";
    if (density >= 20) return "#2ecc71";
    return "#3498db";
  }, [density]);

  return (
    <group>
      {/* Road Surface */}
      <mesh
        rotation={[0, roadRotation, 0]}
        position={[
          Math.sin(roadRotation) * (roadLength / 2),
          0,
          Math.cos(roadRotation) * (roadLength / 2),
        ]}
        receiveShadow
      >
        <boxGeometry args={[roadWidth, 0.15, roadLength]} />
        <meshStandardMaterial
          color={isActive ? "#27ae60" : "#2c3e50"}
          roughness={0.9}
        />
      </mesh>

      {/* Lane Markings - dashed lines */}
      {Array.from({ length: lanes - 1 }).map((_, i) => {
        const laneOffset = i + 1 - lanes / 2;
        return (
          <mesh
            key={`lane-${i}`}
            rotation={[0, roadRotation, 0]}
            position={[
              Math.sin(roadRotation) * (roadLength / 2) +
                Math.cos(roadRotation) * laneOffset * 3,
              0.16,
              Math.cos(roadRotation) * (roadLength / 2) -
                Math.sin(roadRotation) * laneOffset * 3,
            ]}
          >
            <boxGeometry args={[0.15, 0.02, roadLength]} />
            <meshBasicMaterial color="#f1c40f" />
          </mesh>
        );
      })}

      {/* Road edge lines */}
      <mesh
        rotation={[0, roadRotation, 0]}
        position={[
          Math.sin(roadRotation) * (roadLength / 2) +
            Math.cos(roadRotation) * (roadWidth / 2 - 0.1),
          0.16,
          Math.cos(roadRotation) * (roadLength / 2) -
            Math.sin(roadRotation) * (roadWidth / 2 - 0.1),
        ]}
      >
        <boxGeometry args={[0.1, 0.02, roadLength]} />
        <meshBasicMaterial color="#ecf0f1" />
      </mesh>
      <mesh
        rotation={[0, roadRotation, 0]}
        position={[
          Math.sin(roadRotation) * (roadLength / 2) -
            Math.cos(roadRotation) * (roadWidth / 2 - 0.1),
          0.16,
          Math.cos(roadRotation) * (roadLength / 2) +
            Math.sin(roadRotation) * (roadWidth / 2 - 0.1),
        ]}
      >
        <boxGeometry args={[0.1, 0.02, roadLength]} />
        <meshBasicMaterial color="#ecf0f1" />
      </mesh>

      {/* Direction arrow at road end */}
      <mesh
        position={[
          Math.sin(roadRotation) * 22,
          0.2,
          Math.cos(roadRotation) * 22,
        ]}
        rotation={[-Math.PI / 2, 0, roadRotation + Math.PI]}
      >
        <coneGeometry args={[0.6, 1.5, 3]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Congestion Indicator Cube */}
      <mesh
        position={[
          Math.sin(roadRotation) * 20,
          0.6,
          Math.cos(roadRotation) * 20,
        ]}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshBasicMaterial color={congestionColor} transparent opacity={0.8} />
      </mesh>

      {/* Vehicle count display sphere */}
      <mesh
        position={[
          Math.sin(roadRotation) * 18,
          1.5,
          Math.cos(roadRotation) * 18,
        ]}
      >
        <sphereGeometry args={[0.5 + vehicleCount * 0.03, 12, 12]} />
        <meshStandardMaterial
          color={vehicleCount > 10 ? "#e74c3c" : vehicleCount > 5 ? "#f39c12" : "#2ecc71"}
          roughness={0.5}
        />
      </mesh>

      {/* Render Vehicles */}
      {vehiclePositions.map((pos, index) => (
        <Vehicle
          key={`vehicle-${angle}-${index}`}
          position={[pos.x, 0.5, pos.z]}
          rotation={[0, pos.rotation * (Math.PI / 180), 0]}
          type={pos.vehicle.type}
          emergency={pos.vehicle.emergency}
          waitingTime={pos.vehicle.waiting_time}
        />
      ))}
    </group>
  );
};

export default Road;
