// components/game/3d/FlightScene.tsx
import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Environment, 
  Sky, 
  Clouds,
  Float,
  Text3D,
  Center
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { RunwayEnvironment } from './environent/RunwayEnvironent';
import { CinematicCamera } from './camera/CinematicCamera';
import { AtmosphericEffects } from './effects/AtmosphericEffects';
import { AircraftModel } from './models/AircraftModel';
import { MultiplierCheckpoints } from './effects/MultiplierCheckpoints';

interface FlightSceneProps {
  mode: 'idle' | 'preparing' | 'ready' | 'flying' | 'landed' | 'crashed';
  roundInfo?: any;
  onProgress: (progress: number) => void;
  onLoadingComplete: () => void;
}

export function FlightScene({ 
  mode, 
  roundInfo, 
  onProgress, 
  onLoadingComplete 
}: FlightSceneProps) {
  const { camera, scene } = useThree();
  const aircraftRef = useRef<THREE.Group>(null);
  const [flightData, setFlightData] = useState({
    position: 0,
    altitude: 0,
    speed: 10,
    progress: 0
  });

  // Premium lighting setup
  useEffect(() => {
    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    scene.add(directionalLight);

    // Atmospheric fog
    scene.fog = new THREE.Fog(0x87CEEB, 100, 1000);

    onLoadingComplete();

    return () => {
      scene.remove(ambientLight);
      scene.remove(directionalLight);
    };
  }, [scene, onLoadingComplete]);

  // Flight animation controller
  useEffect(() => {
    if (mode === 'flying' && aircraftRef.current && roundInfo?.multipliers) {
      simulateFlight();
    }
  }, [mode, roundInfo]);

  const simulateFlight = () => {
    if (!aircraftRef.current || !roundInfo?.multipliers) return;

    const aircraft = aircraftRef.current;
    const duration = 15; // 15 second flight
    const flightPath = generateFlightPath();
    
    gsap.timeline()
      .to(flightData, {
        position: 1000,
        progress: 1,
        duration: duration,
        ease: "none",
        onUpdate: () => {
          updateAircraftPosition(aircraft, flightData.position);
          onProgress(flightData.progress);
        }
      });
  };

  const generateFlightPath = () => {
    // Generate realistic flight curve based on multipliers
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 5, 0),
      new THREE.Vector3(200, 25, 0),
      new THREE.Vector3(500, 45, 0),
      new THREE.Vector3(800, 35, 0),
      new THREE.Vector3(1000, 15, 0),
    ]);
    
    return path;
  };

  const updateAircraftPosition = (aircraft: THREE.Group, position: number) => {
    aircraft.position.x = position;
    aircraft.position.y = 5 + Math.sin(position * 0.01) * 5; // Realistic flight wobble
    aircraft.rotation.z = Math.sin(position * 0.005) * 0.1; // Banking
  };

  useFrame((state, delta) => {
    // Smooth camera follow for aircraft
    if (mode === 'flying' && aircraftRef.current) {
      const targetPosition = new THREE.Vector3(
        aircraftRef.current.position.x - 50,
        aircraftRef.current.position.y + 20,
        aircraftRef.current.position.z + 80
      );
      
      camera.position.lerp(targetPosition, delta * 2);
      camera.lookAt(aircraftRef.current.position);
    }
  });

  return (
    <>
      {/* Premium Sky Environment */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0}
        azimuth={0.25}
        rayleigh={0.5}
        turbidity={2}
        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />

      {/* Cinematic Camera Controller */}
      <CinematicCamera mode={mode} target={aircraftRef} />

      {/* Runway Environment */}
      <RunwayEnvironment 
        runwayPosition={roundInfo?.hiddenRunwayPosition || 1000}
      />

      {/* Aircraft Model */}
      <group ref={aircraftRef} position={[0, 5, 0]}>
        <AircraftModel 
          mode={mode}
          speed={flightData.speed}
        />
      </group>

      {/* Multiplier Checkpoints */}
      {roundInfo?.multipliers && (
        <MultiplierCheckpoints 
          multipliers={roundInfo.multipliers}
          aircraftPosition={flightData.position}
        />
      )}

      {/* Atmospheric Effects */}
      <AtmosphericEffects mode={mode} />

      {/* Dynamic Clouds */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.5}
      >
        <Clouds
          material={THREE.MeshLambertMaterial}
          limit={200}
          range={200}
        />
      </Float>

      {/* Premium Environment Map */}
      <Environment preset="sunset" />
    </>
  );
}

