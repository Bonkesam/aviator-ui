// components/game/3d/camera/CinematicCamera.tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CinematicCameraProps {
  mode: 'idle' | 'preparing' | 'ready' | 'flying' | 'landed' | 'crashed';
  target?: React.RefObject<THREE.Group | null>;
}

export function CinematicCamera({ mode, target }: CinematicCameraProps) {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(camera as THREE.PerspectiveCamera);

  useEffect(() => {
    // Camera position based on flight mode
    switch (mode) {
      case 'idle':
        gsap.to(camera.position, {
          x: 0,
          y: 50,
          z: 100,
          duration: 2,
          ease: "power2.out"
        });
        gsap.to(camera.rotation, {
          x: -0.3,
          y: 0,
          z: 0,
          duration: 2,
          ease: "power2.out"
        });
        break;
        
      case 'ready':
        gsap.to(camera.position, {
          x: -30,
          y: 15,
          z: 30,
          duration: 1.5,
          ease: "power2.inOut"
        });
        break;
        
      case 'flying':
        // Dynamic chase camera during flight
        break;
        
      case 'landed':
        gsap.to(camera.position, {
          x: target?.current?.position.x || 0,
          y: 25,
          z: 50,
          duration: 2,
          ease: "power2.out"
        });
        break;
        
      case 'crashed':
        // Dramatic crash camera angle
        gsap.to(camera.position, {
          x: (target?.current?.position.x || 0) + 20,
          y: 5,
          z: 20,
          duration: 1,
          ease: "power4.out"
        });
        break;
    }
  }, [mode, camera, target]);

  // Dynamic camera movement during flight
  useFrame((state, delta) => {
    if (mode === 'flying' && target?.current) {
      const targetPos = target.current.position;
      
      // Smooth follow with offset
      const idealOffset = new THREE.Vector3(-40, 20, 30);
      const idealPosition = targetPos.clone().add(idealOffset);
      
      camera.position.lerp(idealPosition, delta * 2);
      
      // Look ahead of the aircraft
      const lookTarget = targetPos.clone().add(new THREE.Vector3(50, 0, 0));
      camera.lookAt(lookTarget);
      
      // Add camera shake for realism
      camera.position.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.2
      ));
    }
  });

  return null;
}