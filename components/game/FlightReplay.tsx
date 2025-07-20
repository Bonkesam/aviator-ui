// components/game/FlightReplay.tsx
import { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Download } from 'lucide-react';

interface FlightReplayProps {
  roundData?: any;
  onClose: () => void;
}

export function FlightReplay({ roundData, onClose }: FlightReplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const resetReplay = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const downloadReplay = () => {
    // Generate replay data and download
    const replayData = {
      roundId: roundData?.id,
      flightPath: roundData?.flightPath,
      multipliers: roundData?.multipliers,
      result: roundData?.result,
      timestamp: Date.now()
    };

    const blob = new Blob([JSON.stringify(replayData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flight-replay-${roundData?.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">
            Flight Replay - Round #{roundData?.id}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 3D Replay Viewport */}
        <div className="relative h-96 bg-gradient-to-b from-blue-900 to-slate-800">
          {/* Replay canvas would go here */}
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <div className="text-center space-y-2">
              <div className="text-4xl">✈️</div>
              <div>3D Replay Visualization</div>
            </div>
          </div>

          {/* Replay Overlay Info */}
          <div className="absolute top-4 left-4 right-4">
            <div className="flex justify-between items-center">
              <div className="bg-black/40 backdrop-blur rounded-lg p-3">
                <div className="text-cyan-400 text-sm">Progress</div>
                <div className="text-white font-bold">{Math.round(progress)}%</div>
              </div>
              <div className="bg-black/40 backdrop-blur rounded-lg p-3">
                <div className="text-cyan-400 text-sm">Speed</div>
                <div className="text-white font-bold">{speed}x</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>00:00</span>
              <span>15:00</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={resetReplay}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={togglePlayback}
              className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white transition-colors"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            <button
              onClick={downloadReplay}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-slate-400 text-sm">Speed:</span>
            {[0.5, 1, 1.5, 2].map((speedOption) => (
              <button
                key={speedOption}
                onClick={() => handleSpeedChange(speedOption)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  speed === speedOption
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {speedOption}x
              </button>
            ))}
          </div>

          {/* Flight Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
            <div className="text-center">
              <div className="text-slate-400 text-sm">Bet Amount</div>
              <div className="text-white font-bold">{roundData?.betAmount || '0.1'} ETH</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-sm">Max Speed</div>
              <div className="text-white font-bold">{roundData?.maxSpeed || '245'} km/h</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-sm">Multipliers Hit</div>
              <div className="text-white font-bold">{roundData?.multipliersHit || '3'}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-400 text-sm">Result</div>
              <div className={`font-bold ${roundData?.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                {roundData?.result === 'win' ? 'Landed' : 'Crashed'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}