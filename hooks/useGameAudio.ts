import { useCallback } from "react";
import { useAudio } from "./useAudio";

// hooks/useGameAudio.ts - Game-specific audio hooks
export function useGameAudio() {
  const { play, stop, fadeIn, fadeOut, setVolume } = useAudio();

  const playEngineSound = useCallback((mode: 'idle' | 'takeoff' | 'flight') => {
    // Stop all engine sounds first
    stop('engine_idle');
    stop('engine_takeoff');
    stop('engine_flight');
    stop('propeller');

    switch (mode) {
      case 'idle':
        play('engine_idle');
        play('propeller', { volume: 0.3 });
        break;
      case 'takeoff':
        play('engine_takeoff');
        play('propeller', { volume: 0.7, rate: 1.2 });
        break;
      case 'flight':
        play('engine_flight');
        play('propeller', { volume: 0.6, rate: 1.5 });
        break;
    }
  }, [play, stop]);

  const playUISound = useCallback((action: 'click' | 'hover' | 'success' | 'error' | 'notification') => {
    const soundMap = {
      click: 'button_click',
      hover: 'button_hover',
      success: 'success',
      error: 'error',
      notification: 'notification'
    };
    
    play(soundMap[action]);
  }, [play]);

  const playEffectSound = useCallback((effect: 'multiplier_hit' | 'crash' | 'landing' | 'whoosh') => {
    play(effect, { volume: 0.8 });
  }, [play]);

  const startAmbientSounds = useCallback(() => {
    fadeIn('wind', 0.3, 2000);
    fadeIn('airport_ambient', 0.2, 3000);
  }, [fadeIn]);

  const stopAmbientSounds = useCallback(() => {
    fadeOut('wind', 1000);
    fadeOut('airport_ambient', 1000);
  }, [fadeOut]);

  const adjustEngineBySpeed = useCallback((speed: number) => {
    const normalizedSpeed = Math.max(0, Math.min(1, speed / 300)); // Normalize to 0-1
    const rate = 0.8 + (normalizedSpeed * 0.7); // Rate from 0.8 to 1.5
    const volume = 0.5 + (normalizedSpeed * 0.3); // Volume from 0.5 to 0.8
    
    setVolume('engine_flight', volume);
    setVolume('propeller', volume * 0.8);
    
    // Note: Rate adjustment would need to be implemented in the audio manager
  }, [setVolume]);

  return {
    playEngineSound,
    playUISound,
    playEffectSound,
    startAmbientSounds,
    stopAmbientSounds,
    adjustEngineBySpeed
  };
}
