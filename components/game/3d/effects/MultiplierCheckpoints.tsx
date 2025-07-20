// components/game/3d/effects/MultiplierCheckpoints.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, Ring, Sphere } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface MultiplierCheckpointsProps {
  multipliers: Array<{
    position: bigint;
    value: bigint;
    hitByPlane: boolean;
  }>;
  aircraftPosition: number;
}

export function MultiplierCheckpoints({ multipliers, aircraftPosition }: MultiplierCheckpointsProps) {
  return (
    <group>
      {multipliers.map((multiplier, index) => (
        <MultiplierCheckpoint
          key={index}
          position={Number(multiplier.position)}
          value={Number(multiplier.value) / 10000}
          isHit={multiplier.hitByPlane}
          aircraftPosition={aircraftPosition}
          index={index}
        />
      ))}
    </group>
  );
}

interface MultiplierCheckpointProps {
  position: number;
  value: number;
  isHit: boolean;
  aircraftPosition: number;
  index: number;
}

function MultiplierCheckpoint({ 
  position, 
  value, 
  isHit, 
  aircraftPosition, 
  index 
}: MultiplierCheckpointProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isActive, setIsActive] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Determine multiplier type and color
  const getMultiplierType = (value: number) => {
    if (value < 1) return { type: 'slowdown', color: '#FF4444', emoji: '⬇️' };
    if (value > 1.5) return { type: 'major-boost', color: '#00FF44', emoji: '🚀' };
    return { type: 'boost', color: '#44AAFF', emoji: '⚡' };
  };

  const multiplierType = getMultiplierType(value);

  // Activation when aircraft approaches
  useEffect(() => {
    const distance = Math.abs(aircraftPosition - position);
    if (distance < 50 && !hasTriggered) {
      setIsActive(true);
    }
    
    if (distance < 10 && !hasTriggered) {
      triggerHitEffect();
      setHasTriggered(true);
    }
  }, [aircraftPosition, position, hasTriggered]);

  const triggerHitEffect = () => {
    if (!groupRef.current) return;

    // Dramatic hit animation
    gsap.timeline()
      .to(groupRef.current.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
      .to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 0.8,
        ease: "power2.out"
      }, 0)
      .to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.in",
        delay: 0.5
      });
  };

  useFrame((state, delta) => {
    if (!ringRef.current || !glowRef.current) return;

    // Continuous rotation
    ringRef.current.rotation.z += delta * 2;
    
    // Pulsing glow effect
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.3;
    glowRef.current.scale.setScalar(pulse);
    
    // Active state effects
    if (isActive) {
      ringRef.current.rotation.z += delta * 5; // Faster rotation when active
    }
  });

  return (
    <group ref={groupRef} position={[position, 15, 0]}>
      {/* Outer Glow Ring */}
      <mesh ref={glowRef}>
        <ringGeometry args={[8, 12, 32]} />
        <meshBasicMaterial 
          color={multiplierType.color}
          transparent={true}
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main Checkpoint Ring */}
      <group ref={ringRef}>
        <Ring 
          args={[4, 6, 32]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial 
            color={multiplierType.color}
            transparent={true}
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </Ring>
        
        {/* Inner Energy Core */}
        <Sphere args={[2, 16, 16]}>
          <meshBasicMaterial 
            color={multiplierType.color}
            transparent={true}
            opacity={0.6}
          />
        </Sphere>
      </group>

      {/* Multiplier Value Display */}
      <Billboard position={[0, 8, 0]}>
        <Text
          color={multiplierType.color}
          fontSize={3}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="/fonts/GeistMono-Bold.woff"
        >
          {multiplierType.emoji} {value.toFixed(1)}x
        </Text>
      </Billboard>

      {/* Particle Effects */}
      <ParticleSystem 
        color={multiplierType.color}
        intensity={isActive ? 1 : 0.3}
        type={multiplierType.type}
      />

      {/* Energy Pillars */}
      <EnergyPillars 
        color={multiplierType.color}
        active={isActive}
        value={value}
      />
    </group>
  );
}

// Particle System for Multipliers
function ParticleSystem({ 
  color, 
  intensity, 
  type 
}: { 
  color: string; 
  intensity: number; 
  type: string; 
}) {
  const particlesRef = useRef<THREE.Group>(null);
  const particleCount = type === 'major-boost' ? 50 : 30;

  useFrame((state, delta) => {
    if (!particlesRef.current) return;

    particlesRef.current.children.forEach((particle, index) => {
      if (particle instanceof THREE.Mesh) {
        // Upward spiral motion
        particle.position.y += delta * 10 * intensity;
        particle.position.x = Math.sin(state.clock.elapsedTime + index) * 5;
        particle.position.z = Math.cos(state.clock.elapsedTime + index) * 5;
        
        // Reset when too high
        if (particle.position.y > 20) {
          particle.position.y = -5;
        }
        
        // Fade based on height
        if (particle.material instanceof THREE.MeshBasicMaterial) {
          particle.material.opacity = (20 - particle.position.y) / 25 * intensity;
        }
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {Array.from({ length: particleCount }, (_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 10,
          Math.random() * 20 - 5,
          (Math.random() - 0.5) * 10
        ]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshBasicMaterial 
            color={color}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// Energy Pillars around multiplier
function EnergyPillars({ 
  color, 
  active, 
  value 
}: { 
  color: string; 
  active: boolean; 
  value: number; 
}) {
  const pillarsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!pillarsRef.current) return;
    
    pillarsRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    
    // Scale based on multiplier value
    const scale = active ? 1 + (value - 1) * 0.5 : 0.5;
    pillarsRef.current.scale.setScalar(scale);
  });

  return (
    <group ref={pillarsRef}>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 8;
        const z = Math.sin(angle) * 8;
        
        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.3, 0.3, 15]} />
            <meshBasicMaterial 
              color={color}
              transparent={true}
              opacity={active ? 0.8 : 0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}