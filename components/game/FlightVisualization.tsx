// components/game/FlightVisualization.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { PlayerRoundState } from '@/lib/contracts/types';
import { RoundState } from '@/lib/contracts/types';
import { useGSAPRef } from '@/lib/gsap';
import { GSAPAnimations } from '@/lib/gsap';
import { FlightScene } from './3d/FlightScene';
import { FlightHUD, UIOverlays } from './3d/FlightHUD';
import { LoadingScreen } from './3d/LoadingScreen';

interface FlightVisualizationProps {
  view: 'betting' | 'flight' | 'results';
  playerRoundState?: PlayerRoundState;
  roundInfo?: any;
}

export function FlightVisualization({ 
  view, 
  playerRoundState, 
  roundInfo 
}: FlightVisualizationProps) {
  const containerRef = useGSAPRef<HTMLDivElement>();
  const [isLoading, setIsLoading] = useState(true);
  const [flightProgress, setFlightProgress] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      GSAPAnimations.fadeInUp(containerRef.current);
    }
  }, []);

  const getSceneMode = () => {
    if (!playerRoundState) return 'idle';
    
    switch (playerRoundState.state) {
      case RoundState.WAITING_FOR_VRF:
        return 'preparing';
      case RoundState.READY_TO_LAUNCH:
        return 'ready';
      case RoundState.FLYING:
        return 'flying';
      case RoundState.LANDED_SAFE:
        return 'landed';
      case RoundState.CRASHED:
        return 'crashed';
      default:
        return 'idle';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] rounded-2xl overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 shadow-2xl border border-slate-700"
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: [0, 50, 100], 
          fov: 60,
          near: 0.1,
          far: 2000
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          shadowMap: true,
        }}
        shadows="soft"
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <FlightScene 
            mode={getSceneMode()}
            roundInfo={roundInfo}
            onProgress={setFlightProgress}
            onLoadingComplete={() => setIsLoading(false)}
          />
        </Suspense>
      </Canvas>

      {/* Loading Overlay */}
      {isLoading && <LoadingScreen />}

      {/* Flight HUD */}
      <FlightHUD 
        mode={getSceneMode()}
        roundInfo={roundInfo}
        flightProgress={flightProgress}
      />

      {/* Premium UI Overlays */}
      <UIOverlays mode={getSceneMode()} roundInfo={roundInfo} />
    </div>
  );
}