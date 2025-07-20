// hooks/useAudio.ts
import { AudioManager } from '@/lib/audio/AudioManager';
import { useEffect, useRef, useCallback } from 'react';

export function useAudio() {
  const audioManager = useRef<AudioManager>(AudioManager.getInstance());
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeAudio = async () => {
      if (!isInitialized.current) {
        await audioManager.current.initialize();
        isInitialized.current = true;
      }
    };

    // Initialize on user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const play = useCallback((trackId: string, options?: any) => {
    return audioManager.current.play(trackId, options);
  }, []);

  const stop = useCallback((trackId: string, soundId?: number) => {
    audioManager.current.stop(trackId, soundId);
  }, []);

  const setVolume = useCallback((trackId: string, volume: number, soundId?: number) => {
    audioManager.current.setVolume(trackId, volume, soundId);
  }, []);

  const fadeIn = useCallback((trackId: string, volume: number, duration?: number) => {
    return audioManager.current.fadeIn(trackId, volume, duration);
  }, []);

  const fadeOut = useCallback((trackId: string, duration?: number) => {
    audioManager.current.fadeOut(trackId, duration);
  }, []);

  const mute = useCallback((muted: boolean) => {
    audioManager.current.mute(muted);
  }, []);

  const setCategoryVolume = useCallback((category: string, volume: number) => {
    audioManager.current.setCategoryVolume(category, volume);
  }, []);

  return {
    play,
    stop,
    setVolume,
    fadeIn,
    fadeOut,
    mute,
    setCategoryVolume,
    isPlaying: (trackId: string) => audioManager.current.isPlaying(trackId),
    getDuration: (trackId: string) => audioManager.current.getDuration(trackId),
  };
}