import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Animated Airplane */}
        <div className="relative">
          <div className="text-6xl animate-bounce">✈️</div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse rounded-full blur-xl"></div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">Preparing Flight</h3>
          <p className="text-slate-300">Loading premium 3D environment...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-cyan-400 font-semibold">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}