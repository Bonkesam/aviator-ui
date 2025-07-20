'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';

export function SoundControls() {
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volumes, setVolumes] = useState({
    master: 70,
    engine: 80,
    ui: 60,
    ambient: 40,
    effects: 90
  });

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    // Would integrate with actual audio system
    console.log('Audio muted:', newMuted);
  };

  const handleVolumeChange = (category: string, value: number) => {
    setVolumes(prev => ({ ...prev, [category]: value }));
    console.log(`${category} volume:`, value);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mb-2">
            <h3 className="text-white font-semibold mb-3">Audio Settings</h3>
            
            <div className="space-y-3 w-48">
              {Object.entries(volumes).map(([category, value]) => (
                <div key={category} className="flex items-center justify-between">
                  <label className="text-slate-300 text-sm capitalize">
                    {category}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleVolumeChange(category, Number(e.target.value))}
                      className="w-20 h-1 bg-slate-600 rounded-lg appearance-none slider"
                    />
                    <span className="text-slate-400 text-xs w-8">{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleMute}
            className={`p-3 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
              isMuted 
                ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}