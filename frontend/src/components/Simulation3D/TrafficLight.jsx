import React from "react";

const TrafficLight = ({ angle, isGreen }) => {
  const distance = 7;
  const height = 4;

  const position = [
    Math.sin((angle * Math.PI) / 180) * distance,
    height,
    Math.cos((angle * Math.PI) / 180) * distance,
  ];

  const rotation = [0, ((angle + 180) * Math.PI) / 180, 0];

  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, -height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, height, 8]} />
        <meshBasicMaterial color="#4a5568" />
      </mesh>

      {/* Light housing */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 1.4, 0.35]} />
        <meshBasicMaterial color="#2d3748" />
      </mesh>

      {/* Red light */}
      <mesh position={[0.12, 0.8, 0.18]}>
        <circleGeometry args={[0.18, 12]} />
        <meshBasicMaterial color={isGreen ? "#5a2a2a" : "#ef4444"} />
      </mesh>

      {/* Yellow light */}
      <mesh position={[0.12, 0.5, 0.18]}>
        <circleGeometry args={[0.18, 12]} />
        <meshBasicMaterial color="#6b5a00" />
      </mesh>

      {/* Green light */}
      <mesh position={[0.12, 0.2, 0.18]}>
        <circleGeometry args={[0.18, 12]} />
        <meshBasicMaterial color={isGreen ? "#22c55e" : "#1a4d2e"} />
      </mesh>
    </group>
  );
};

export default TrafficLight;
