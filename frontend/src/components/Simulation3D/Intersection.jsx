import React, { useMemo } from "react";
import { Grid } from "@react-three/drei";
import Road from "./Road";
import TrafficLight from "./TrafficLight";
import "./Intersection.css";

const Intersection = ({ simulationState }) => {
  const { roads, current_green } = simulationState;

  const roadConfigs = useMemo(
    () => [
      { angle: 0, name: "NORTH", lanes: 3, color: "#3498db" },
      { angle: 45, name: "NORTHEAST", lanes: 2, color: "#2ecc71" },
      { angle: 90, name: "EAST", lanes: 3, color: "#e74c3c" },
      { angle: 135, name: "SOUTHEAST", lanes: 2, color: "#9b59b6" },
      { angle: 180, name: "SOUTH", lanes: 3, color: "#1abc9c" },
      { angle: 225, name: "SOUTHWEST", lanes: 2, color: "#f39c12" },
      { angle: 270, name: "WEST", lanes: 3, color: "#34495e" },
      { angle: 315, name: "NORTHWEST", lanes: 2, color: "#7f8c8d" },
    ],
    []
  );

  return (
    <group>
      {/* Grid for reference */}
      <Grid
        args={[50, 50]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#2c3e50"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#34495e"
        fadeDistance={100}
        fadeStrength={1}
      />

      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a252f" roughness={0.8} />
      </mesh>

      {/* Roads */}
      {roadConfigs.map((config) => {
        const roadData = roads?.[config.angle];
        return (
          <Road
            key={config.angle}
            angle={config.angle}
            name={config.name}
            lanes={config.lanes}
            color={config.color}
            vehicles={roadData?.vehicles || []}
            isActive={current_green === config.angle}
            vehicleCount={roadData?.vehicle_count || 0}
            density={roadData?.density || 0}
          />
        );
      })}

      {/* Traffic Lights */}
      {roadConfigs.map((config) => (
        <TrafficLight
          key={`light-${config.angle}`}
          angle={config.angle}
          isGreen={current_green === config.angle}
        />
      ))}

      {/* Intersection Center */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[8, 8, 0.1, 32]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

export default Intersection;
