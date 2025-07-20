import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from 'three';

// components/game/3d/effects/AtmosphericEffects.tsx
export function AtmosphericEffects({ mode }: { mode: string }) {
  return (
    <group>
      {/* Weather Effects */}
      <WeatherSystem mode={mode} />
      
      {/* Atmospheric Particles */}
      <AtmosphericParticles />
      
      {/* Dynamic Lighting */}
      <DynamicLighting mode={mode} />
      
      {/* Sound Zones */}
      <SoundZones mode={mode} />
    </group>
  );
}

function WeatherSystem({ mode }: { mode: string }) {
  const cloudsRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!cloudsRef.current) return;
    
    // Move clouds
    cloudsRef.current.position.x += delta * 2;
    if (cloudsRef.current.position.x > 500) {
      cloudsRef.current.position.x = -500;
    }
  });

  return (
    <group ref={cloudsRef} position={[0, 50, 0]}>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.random() - 0.5) * 1000,
            Math.random() * 30,
            (Math.random() - 0.5) * 200
          ]}
        >
          <sphereGeometry args={[8 + Math.random() * 12, 8, 8]} />
          <meshLambertMaterial 
            color="#FFFFFF"
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function AtmosphericParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = Math.random() * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    particlesRef.current.rotation.y += delta * 0.05;
    const mat = particlesRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <primitive object={particleGeometry} />
      <pointsMaterial
        color="#87CEEB"
        size={0.5}
        transparent={true}
        opacity={0.4}
      />
    </points>
  );
}

function DynamicLighting({ mode }: { mode: string }) {
  const lightRef = useRef<THREE.SpotLight>(null);
  
  useFrame((state) => {
    if (!lightRef.current) return;
    
    // Dynamic lighting based on flight mode
    if (mode === 'flying') {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
      lightRef.current.color.setHSL(0.6, 0.8, 0.8);
    } else if (mode === 'crashed') {
      lightRef.current.intensity = 0.3;
      lightRef.current.color.setHSL(0, 0.8, 0.5);
    } else {
      lightRef.current.intensity = 1;
      lightRef.current.color.setHSL(0.15, 0.3, 0.9);
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 100, 0]}
      angle={Math.PI / 3}
      penumbra={0.5}
      intensity={1}
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
  );
}

function SoundZones({ mode }: { mode: string }) {
  // Audio zones for immersive sound experience
  // This would integrate with Howler.js for spatial audio
  return (
    <group>
      {/* Engine Sound Zone */}
      <mesh position={[0, 5, 0]} visible={false}>
        <sphereGeometry args={[50]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Wind Sound Zone */}
      <mesh position={[0, 20, 0]} visible={false}>
        <sphereGeometry args={[100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}