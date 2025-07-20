// components/game/3d/environment/RunwayEnvironment.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard, Plane } from '@react-three/drei';
import * as THREE from 'three';

interface RunwayEnvironmentProps {
  runwayPosition: number;
}

export function RunwayEnvironment({ runwayPosition }: RunwayEnvironmentProps) {
  const terrainRef = useRef<THREE.Group>(null);
  const runwayRef = useRef<THREE.Group>(null);

  // Generate realistic terrain
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(2000, 200, 200, 20);
    const positions = geometry.attributes.position;
    
    // Add realistic height variations
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const height = Math.sin(x * 0.01) * 2 + Math.cos(y * 0.02) * 1;
      positions.setZ(i, height);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // Create runway lights pattern
  const runwayLights = useMemo(() => {
    const lights = [];
    for (let i = 0; i < 50; i++) {
      const x = (runwayPosition - 100) + (i * 4);
      lights.push(
        <RunwayLight 
          key={`left-${i}`} 
          position={[x, 0.5, -6]} 
          color={i % 5 === 0 ? "#FFD700" : "#FFFFFF"}
        />,
        <RunwayLight 
          key={`right-${i}`} 
          position={[x, 0.5, 6]} 
          color={i % 5 === 0 ? "#FFD700" : "#FFFFFF"}
        />
      );
    }
    return lights;
  }, [runwayPosition]);

  return (
    <group>
      {/* Terrain Base */}
      <group ref={terrainRef} position={[0, -5, 0]}>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <primitive object={terrainGeometry} />
          <meshLambertMaterial 
            color="#2d5016"
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Grass Texture Overlay */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <planeGeometry args={[2000, 200]} />
          <meshLambertMaterial 
            color="#4a7c59"
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* Main Runway */}
      <group ref={runwayRef}>
        <RunwayStrip runwayPosition={runwayPosition} />
        
        {/* Runway Markings */}
        <RunwayMarkings runwayPosition={runwayPosition} />
        
        {/* Landing Zone Indicators */}
        <LandingZone position={runwayPosition} />
        
        {/* Runway Lights */}
        {runwayLights}
        
        {/* Airport Infrastructure */}
        <AirportBuildings />
        
        {/* Distance Markers */}
        <DistanceMarkers />
      </group>

      {/* Atmospheric Elements */}
      <EnvironmentalDetails />
    </group>
  );
}

// Main Runway Strip
function RunwayStrip({ runwayPosition }: { runwayPosition: number }) {
  return (
    <group>
      {/* Main Runway Surface */}
      <mesh receiveShadow position={[runwayPosition / 2, 0, 0]}>
        <boxGeometry args={[runwayPosition + 200, 0.2, 12]} />
        <meshLambertMaterial color="#2c2c2c" />
      </mesh>
      
      {/* Runway Center Line */}
      <mesh position={[runwayPosition / 2, 0.11, 0]}>
        <boxGeometry args={[runwayPosition + 200, 0.01, 0.3]} />
        <meshBasicMaterial color="#FFFF00" />
      </mesh>
      
      {/* Runway Edge Lines */}
      <mesh position={[runwayPosition / 2, 0.11, 5.8]}>
        <boxGeometry args={[runwayPosition + 200, 0.01, 0.4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[runwayPosition / 2, 0.11, -5.8]}>
        <boxGeometry args={[runwayPosition + 200, 0.01, 0.4]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
}

// Runway Markings and Numbers
function RunwayMarkings({ runwayPosition }: { runwayPosition: number }) {
  return (
    <group>
      {/* Touchdown Zone Markings */}
      {Array.from({ length: 6 }, (_, i) => (
        <group key={`touchdown-${i}`} position={[50 + i * 100, 0.12, 0]}>
          <mesh>
            <boxGeometry args={[12, 0.01, 0.8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0, 2]}>
            <boxGeometry args={[12, 0.01, 0.8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 0, -2]}>
            <boxGeometry args={[12, 0.01, 0.8]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
      
      {/* Distance Markers */}
      {Array.from({ length: 10 }, (_, i) => (
        <Billboard key={`marker-${i}`} position={[i * 100, 2, 15]}>
          <Text
            color="#FFFFFF"
            fontSize={3}
            maxWidth={200}
            lineHeight={1}
            letterSpacing={0.02}
            textAlign="center"
            font="/fonts/GeistMono-Bold.woff"
          >
            {i * 100}m
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

// Landing Zone Visualization
function LandingZone({ position }: { position: number }) {
  const zoneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!zoneRef.current) return;
    
    // Pulsing effect for landing zone
    const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    zoneRef.current.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.material.opacity = intensity;
      }
    });
  });

  return (
    <group ref={zoneRef} position={[position, 0.15, 0]}>
      {/* Landing Zone Boundary */}
      <mesh>
        <boxGeometry args={[50, 0.01, 12]} />
        <meshBasicMaterial 
          color="#00FF00" 
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Landing Zone Markers */}
      <mesh position={[-25, 0, 0]}>
        <boxGeometry args={[2, 0.02, 1]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>
      <mesh position={[25, 0, 0]}>
        <boxGeometry args={[2, 0.02, 1]} />
        <meshBasicMaterial color="#00FF00" />
      </mesh>
      
      {/* Success Indicator */}
      <Billboard position={[0, 10, 0]}>
        <Text
          color="#00FF00"
          fontSize={4}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="/fonts/GeistMono-Bold.woff"
        >
          🎯 LANDING ZONE
        </Text>
      </Billboard>
    </group>
  );
}

// Individual Runway Light
function RunwayLight({ position, color }: { position: [number, number, number]; color: string }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!lightRef.current || !meshRef.current) return;
    
    // Animated intensity
    const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + position[0] * 0.1) * 0.3;
    lightRef.current.intensity = intensity;
    
    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = intensity;
    }
  });

  return (
    <group position={position}>
      {/* Light Source */}
      <pointLight 
        ref={lightRef}
        color={color}
        intensity={1}
        distance={10}
        decay={2}
      />
      
      {/* Light Housing */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.2, 0.2, 0.5]} />
        <meshBasicMaterial 
          color={color}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Light Glow */}
      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent={true}
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}

// Airport Buildings and Infrastructure
function AirportBuildings() {
  return (
    <group position={[0, 0, -50]}>
      {/* Control Tower */}
      <group position={[200, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8, 40, 8]} />
          <meshLambertMaterial color="#cccccc" />
        </mesh>
        
        {/* Tower Top */}
        <mesh position={[0, 22, 0]} castShadow>
          <boxGeometry args={[12, 4, 12]} />
          <meshLambertMaterial color="#4a90e2" />
        </mesh>
        
        {/* Rotating Beacon */}
        <RotatingBeacon position={[0, 26, 0]} />
      </group>
      
      {/* Hangar */}
      <group position={[-100, 0, 20]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[60, 20, 40]} />
          <meshLambertMaterial color="#8b7355" />
        </mesh>
        
        {/* Hangar Doors */}
        <mesh position={[0, -5, 20.1]}>
          <boxGeometry args={[50, 10, 0.2]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
      </group>
      
      {/* Terminal Building */}
      <group position={[500, 0, 30]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[80, 15, 30]} />
          <meshLambertMaterial color="#f0f0f0" />
        </mesh>
        
        {/* Terminal Windows */}
        {Array.from({ length: 20 }, (_, i) => (
          <mesh key={i} position={[-35 + i * 4, 5, 15.1]}>
            <boxGeometry args={[2, 8, 0.1]} />
            <meshBasicMaterial color="#87CEEB" opacity={0.7} transparent={true} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Rotating Beacon
function RotatingBeacon({ position }: { position: [number, number, number] }) {
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!beaconRef.current) return;
    beaconRef.current.rotation.y += delta * 2;
  });

  return (
    <group ref={beaconRef} position={position}>
      <spotLight
        color="#FF0000"
        intensity={2}
        distance={100}
        angle={Math.PI / 6}
        penumbra={0.5}
        castShadow
      />
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 1]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>
    </group>
  );
}

// Distance Markers
function DistanceMarkers() {
  return (
    <group>
      {Array.from({ length: 20 }, (_, i) => {
        const distance = i * 50;
        return (
          <group key={i} position={[distance, 0, 20]}>
            {/* Marker Post */}
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 3]} />
              <meshLambertMaterial color="#FFFF00" />
            </mesh>
            
            {/* Distance Sign */}
            <Billboard position={[0, 2, 0]}>
              <Text
                color="#000000"
                fontSize={1}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign="center"
                font="/fonts/GeistMono-Bold.woff"
              >
                {distance}m
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

// Environmental Details
function EnvironmentalDetails() {
  return (
    <group>
      {/* Wind Socks */}
      <WindSock position={[100, 3, 25]} />
      <WindSock position={[800, 3, -25]} />
      
      {/* Trees and Vegetation */}
      <VegetationCluster position={[-50, 0, 50]} />
      <VegetationCluster position={[1200, 0, -80]} />
      
      {/* Ground Vehicles */}
      <GroundVehicles />
    </group>
  );
}

// Wind Sock
function WindSock({ position }: { position: [number, number, number] }) {
  const sockRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sockRef.current) return;
    sockRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.1, 6]} />
        <meshLambertMaterial color="#cccccc" />
      </mesh>
      
      {/* Wind Sock */}
      <mesh ref={sockRef} position={[1, 0, 0]}>
        <coneGeometry args={[0.5, 3, 8]} />
        <meshLambertMaterial color="#FF6600" />
      </mesh>
    </group>
  );
}

// Vegetation Cluster
function VegetationCluster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 40,
            Math.random() * 5 + 2,
            (Math.random() - 0.5) * 40
          ]}
          castShadow
        >
          <cylinderGeometry args={[0.5, 0.8, Math.random() * 8 + 4]} />
          <meshLambertMaterial color={new THREE.Color().setHSL(0.3, 0.7, 0.3 + Math.random() * 0.3)} />
        </mesh>
      ))}
    </group>
  );
}

// Ground Vehicles
function GroundVehicles() {
  return (
    <group>
      {/* Service Vehicle */}
      <group position={[300, 1, 30]}>
        <mesh castShadow>
          <boxGeometry args={[8, 3, 4]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        
        {/* Vehicle Wheels */}
        {[[-3, -1.5, 1.5], [3, -1.5, 1.5], [-3, -1.5, -1.5], [3, -1.5, -1.5]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 0.4]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
        ))}
      </group>
      
      {/* Fuel Truck */}
      <group position={[600, 1, -40]}>
        <mesh castShadow>
          <boxGeometry args={[12, 4, 6]} />
          <meshLambertMaterial color="#FF4444" />
        </mesh>
        
        {/* Fuel Tank */}
        <mesh position={[-2, 1, 0]} castShadow>
          <cylinderGeometry args={[2, 2, 8]} />
          <meshLambertMaterial color="#CCCCCC" />
        </mesh>
      </group>
    </group>
  );
}