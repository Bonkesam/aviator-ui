// components/game/3d/models/AircraftModel.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Detailed } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface AircraftModelProps {
  mode: 'idle' | 'preparing' | 'ready' | 'flying' | 'landed' | 'crashed';
  speed: number;
}

export function AircraftModel({ mode, speed }: AircraftModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [engineGlow, setEngineGlow] = useState(0);

  // Engine effects based on mode
  useEffect(() => {
    if (mode === 'flying') {
      setEngineGlow(1);
    } else if (mode === 'ready') {
      setEngineGlow(0.3);
    } else {
      setEngineGlow(0);
    }
  }, [mode]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Realistic flight dynamics
    if (mode === 'flying') {
      // Banking effect
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      // Pitch variation
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      // Engine vibration
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 10) * 0.02;
    }

    // Takeoff animation
    if (mode === 'ready') {
      groupRef.current.rotation.x = -0.1; // Nose up for takeoff
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Aircraft Body */}
      <Detailed distances={[0, 50, 100]}>
        {/* High Detail LOD */}
        <HighDetailAircraft engineGlow={engineGlow} speed={speed} />
        
        {/* Medium Detail LOD */}
        <MediumDetailAircraft engineGlow={engineGlow} />
        
        {/* Low Detail LOD */}
        <LowDetailAircraft />
      </Detailed>

      {/* Engine Trail Effects */}
      {mode === 'flying' && <EngineTrails intensity={engineGlow} />}
      
      {/* Propeller Animation */}
      <PropellerSystem speed={speed} mode={mode} />
    </group>
  );
}

// High Detail Aircraft (for close-up views)
function HighDetailAircraft({ engineGlow, speed }: { engineGlow: number; speed: number }) {
  return (
    <group>
      {/* Fuselage */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 12, 16]} />
        <meshPhysicalMaterial 
          color="#e8e8e8"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Wings */}
      <group position={[0, 0, 2]}>
        {/* Main Wings */}
        <mesh castShadow receiveShadow position={[0, -0.2, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[16, 0.3, 3]} />
          <meshPhysicalMaterial 
            color="#f0f0f0"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Wing Tips */}
        <mesh position={[8, -0.1, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshPhysicalMaterial 
            color="#ff6b6b"
            emissive="#ff6b6b"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh position={[-8, -0.1, 0]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshPhysicalMaterial 
            color="#4ecdc4"
            emissive="#4ecdc4"
            emissiveIntensity={0.2}
          />
        </mesh>
      </group>

      {/* Tail */}
      <group position={[0, 0, -5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 4, 1]} />
          <meshPhysicalMaterial 
            color="#e8e8e8"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, -0.8]}>
          <boxGeometry args={[6, 0.3, 1]} />
          <meshPhysicalMaterial 
            color="#e8e8e8"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Cockpit */}
      <mesh position={[0, 0.5, 4]} castShadow>
        <sphereGeometry args={[1, 12, 8]} />
        <meshPhysicalMaterial 
          color="#87CEEB"
          metalness={0}
          roughness={0}
          transmission={0.9}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Landing Gear */}
      <LandingGear />

      {/* Engine Glow */}
      <mesh position={[0, -0.5, 6]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color="#ff6b35"
          transparent={true}
          opacity={engineGlow * 0.8}
        />
      </mesh>
    </group>
  );
}

// Medium Detail Aircraft
function MediumDetailAircraft({ engineGlow }: { engineGlow: number }) {
  return (
    <group>
      {/* Simplified Fuselage */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1.2, 12, 8]} />
        <meshStandardMaterial color="#e8e8e8" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Simplified Wings */}
      <mesh castShadow receiveShadow position={[0, -0.2, 2]}>
        <boxGeometry args={[16, 0.3, 3]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Simplified Tail */}
      <mesh castShadow receiveShadow position={[0, 2, -5]}>
        <boxGeometry args={[0.3, 4, 1]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>

      {/* Engine Glow */}
      <mesh position={[0, -0.5, 6]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshBasicMaterial 
          color="#ff6b35"
          transparent={true}
          opacity={engineGlow * 0.6}
        />
      </mesh>
    </group>
  );
}

// Low Detail Aircraft (for distant views)
function LowDetailAircraft() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[2, 1, 12]} />
        <meshBasicMaterial color="#e8e8e8" />
      </mesh>
      <mesh position={[0, 0, 2]}>
        <boxGeometry args={[16, 0.2, 2]} />
        <meshBasicMaterial color="#f0f0f0" />
      </mesh>
    </group>
  );
}

// Landing Gear Component
function LandingGear() {
  return (
    <group>
      {/* Main Gear */}
      <mesh position={[0, -1.5, 1]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[0, -2.5, 1]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Front Gear */}
      <mesh position={[0, -1.2, 4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.5]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      <mesh position={[0, -2, 4]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

// Propeller System
function PropellerSystem({ speed, mode }: { speed: number; mode: string }) {
  const propRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!propRef.current) return;

    if (mode === 'flying') {
      propRef.current.rotation.z += delta * speed * 2;
    } else if (mode === 'ready') {
      propRef.current.rotation.z += delta * 5;
    }
  });

  return (
    <group position={[0, 0, 6.5]}>
      {/* Propeller Hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.5]} />
        <meshStandardMaterial color="#444" metalness={0.8} />
      </mesh>

      {/* Propeller Blades */}
      <mesh ref={propRef}>
        <group>
          {[0, 1, 2].map((i) => (
            <mesh 
              key={i} 
              rotation={[0, 0, (i * Math.PI * 2) / 3]}
              position={[2, 0, 0]}
              castShadow
            >
              <boxGeometry args={[4, 0.1, 0.3]} />
              <meshStandardMaterial 
                color="#8B4513" 
                opacity={mode === 'flying' ? 0.3 : 1}
                transparent={mode === 'flying'}
              />
            </mesh>
          ))}
        </group>
      </mesh>
    </group>
  );
}

// Engine Trail Effects
function EngineTrails({ intensity }: { intensity: number }) {
  const trailRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!trailRef.current) return;
    
    // Animate trail particles
    trailRef.current.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        child.position.z -= delta * 50;
        child.material.opacity = Math.max(0, child.material.opacity - delta * 2);
        
        if (child.position.z < -20) {
          child.position.z = 1;
          child.material.opacity = intensity;
        }
      }
    });
  });

  return (
    <group ref={trailRef} position={[0, -0.5, 5]}>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[0, 0, -i * 1]}>
          <sphereGeometry args={[0.2 + Math.random() * 0.3, 6, 6]} />
          <meshBasicMaterial 
            color={new THREE.Color().setHSL(0.1, 0.8, 0.8)}
            transparent={true}
            opacity={intensity * (1 - i / 20)}
          />
        </mesh>
      ))}
    </group>
  );
}