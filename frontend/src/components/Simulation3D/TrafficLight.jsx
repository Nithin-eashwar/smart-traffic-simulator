import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const TrafficLight = ({ angle, isGreen }) => {
  const redLightRef = useRef();
  const greenLightRef = useRef();

  const distance = 7;
  const height = 4;

  const position = [
    Math.sin((angle * Math.PI) / 180) * distance,
    height,
    Math.cos((angle * Math.PI) / 180) * distance,
  ];

  const rotation = [0, ((angle + 180) * Math.PI) / 180, 0];

  // Animate lights
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (redLightRef.current && !isGreen) {
      redLightRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
    }
    
    if (greenLightRef.current && isGreen) {
      greenLightRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Pole */}
      <mesh position={[0, -height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, height]} />
        <meshStandardMaterial color="#4a5568" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Light housing */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 1.4, 0.35]} />
        <meshStandardMaterial color="#2d3748" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Red light */}
      <mesh ref={redLightRef} position={[0.12, 0.8, 0.18]}>
        <circleGeometry args={[0.18, 16]} />
        <meshBasicMaterial color={isGreen ? "#5a2a2a" : "#ef4444"} />
      </mesh>

      {/* Yellow light */}
      <mesh position={[0.12, 0.5, 0.18]}>
        <circleGeometry args={[0.18, 16]} />
        <meshBasicMaterial color="#6b5a00" />
      </mesh>

      {/* Green light */}
      <mesh ref={greenLightRef} position={[0.12, 0.2, 0.18]}>
        <circleGeometry args={[0.18, 16]} />
        <meshBasicMaterial color={isGreen ? "#22c55e" : "#1a4d2e"} />
      </mesh>

      {/* Light glow effect when active */}
      {isGreen && (
        <pointLight
          position={[0.15, 0.2, 0.3]}
          color="#22c55e"
          intensity={0.5}
          distance={4}
        />
      )}
      {!isGreen && (
        <pointLight
          position={[0.15, 0.8, 0.3]}
          color="#ef4444"
          intensity={0.5}
          distance={4}
        />
      )}
    </group>
  );
};

export default TrafficLight;
