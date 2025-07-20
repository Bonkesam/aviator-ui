// components/game/LoadingOptimizer.tsx
import { useEffect, useState } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface LoadingOptimizerProps {
  children: React.ReactNode;
}

export function LoadingOptimizer({ children }: LoadingOptimizerProps) {
  const { optimalSettings, isMobile, quality } = useMobileOptimization();
  const [isOptimized, setIsOptimized] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  const loadingStages = [
    'Detecting device capabilities...',
    'Optimizing 3D settings...',
    'Loading audio system...',
    'Preparing flight engine...',
    'Ready for takeoff!'
  ];

  useEffect(() => {
    const optimizeApp = async () => {
      for (let i = 0; i < loadingStages.length; i++) {
        setLoadingStage(i);
        await new Promise(resolve => setTimeout(resolve, isMobile ? 200 : 400));
      }
      
      // Apply optimizations
      if (isMobile || quality === 'low') {
        // Reduce quality for mobile/low-end devices
        document.documentElement.style.setProperty('--particle-count', '50');
        document.documentElement.style.setProperty('--shadow-quality', 'low');
      }
      
      setIsOptimized(true);
    };

    optimizeApp();
  }, [isMobile, quality]);

  if (!isOptimized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          {/* Animated Plane */}
          <div className="relative mb-8">
            <div className="text-8xl animate-bounce">✈️</div>
            <div className="absolute inset-0 bg-gradient-radial from-cyan-400/30 via-transparent to-transparent animate-pulse rounded-full scale-150" />
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">Preparing Flight</h2>
            <p className="text-cyan-400 font-medium">
              {loadingStages[loadingStage]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
            />
          </div>

          {/* Device Info */}
          <div className="text-xs text-slate-400 space-y-1">
            <div>Quality: {quality.toUpperCase()}</div>
            <div>Device: {isMobile ? 'Mobile' : 'Desktop'}</div>
            {isMobile && <div>Tip: Rotate to landscape for best experience</div>}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}