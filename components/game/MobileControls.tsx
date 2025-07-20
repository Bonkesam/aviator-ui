// components/game/MobileControls.tsx
'use client';

import { useState, useEffect } from 'react';
import { Maximize, RotateCcw } from 'lucide-react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

export function MobileControls() {
  const { isMobile, orientation } = useMobileOptimization();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isMobile) return null;

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.log('Fullscreen not supported');
    }
  };

  const exitFullscreen = async () => {
    try {
      await document.exitFullscreen();
      setIsFullscreen(false);
    } catch (error) {
      console.log('Exit fullscreen failed');
    }
  };

  const handleRotateHint = () => {
    // Visual hint for rotation - could trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-slate-900/90 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-700 flex items-center space-x-4">
        {/* Fullscreen Toggle */}
        <button
          onClick={isFullscreen ? exitFullscreen : enterFullscreen}
          className="p-2 text-slate-400 hover:text-white transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <Maximize className="h-5 w-5" />
        </button>

        {/* Orientation Hint */}
        {orientation === 'portrait' && (
          <button
            onClick={handleRotateHint}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            title="Rotate for better experience"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="text-xs">Rotate</span>
          </button>
        )}

        {/* Quality Indicator */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Optimized</span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>
    </div>
  );
}