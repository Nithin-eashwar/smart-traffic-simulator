import React from "react";

const Grid = () => {
  return (
    <group>
      {/* Main grid for reference */}
      <gridHelper
        args={[100, 100, "#2c3e50", "#34495e"]}
        position={[0, 0.01, 0]}
      />

      {/* Center marker */}
      <mesh position={[0, 0.02, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial
          color="#3498db"
          emissive="#3498db"
          emissiveIntensity={0.3}
          side={2}
        />
      </mesh>

      {/* Compass indicators */}
      {["N", "E", "S", "W"].map((dir, i) => {
        const angle = i * 90;
        const distance = 45;
        return (
          <mesh
            key={dir}
            position={[
              Math.sin((angle * Math.PI) / 180) * distance,
              0.02,
              Math.cos((angle * Math.PI) / 180) * distance,
            ]}
            rotation={[0, (-angle * Math.PI) / 180, 0]}
          >
            <textGeometry args={[dir, { font: {}, size: 3, height: 0.1 }]} />
            <meshStandardMaterial
              color={dir === "N" ? "#e74c3c" : "#7f8c8d"}
              emissive={dir === "N" ? "#e74c3c" : "#7f8c8d"}
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default Grid;
