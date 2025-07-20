// components/game/AdvancedSettings.tsx
import { useState, useEffect } from 'react';
import { Settings, Monitor, Volume2, Gamepad2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { FlightReplay } from './FlightReplay';
import { LoadingOptimizer } from './LoadingOptimizer';
import { SoundControls } from './SoundControls';
import { TouchControls } from './TouchControls';
import { PerformanceMonitor } from '@react-three/drei';
import { MobileControls, MobileControls } from './MobileControls';
import { useRealTimeEvents } from '@/hooks/useRealTimeEvents';

export function AdvancedSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    graphics: {
      quality: 'high',
      shadows: true,
      antialiasing: true,
      particleEffects: true,
      frameRate: 60
    },
    audio: {
      masterVolume: 70,
      engineVolume: 80,
      uiVolume: 60,
      ambientVolume: 40,
      effectsVolume: 90,
      spatialAudio: true
    },
    gameplay: {
      autoLaunch: false,
      quickBet: true,
      notifications: true,
      hapticFeedback: true,
      developerMode: false
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      largeText: false,
      colorBlindMode: 'none'
    }
  });

  const { setCategoryVolume } = useAudio();
  const { isMobile, optimalSettings } = useMobileOptimization();

  useEffect(() => {
    // Apply mobile optimizations
    if (isMobile) {
      setSettings(prev => ({
        ...prev,
        graphics: {
          ...prev.graphics,
          quality: 'medium',
          shadows: optimalSettings.shadows,
          antialiasing: optimalSettings.antialiasing,
          particleEffects: true
        }
      }));
    }
  }, [isMobile, optimalSettings]);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));

    // Apply audio settings immediately
    if (category === 'audio' && key.includes('Volume')) {
      const audioCategory = key.replace('Volume', '').toLowerCase();
      setCategoryVolume(audioCategory, value / 100);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-20 p-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors z-40"
      >
        <Settings className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>Game Settings</span>
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Graphics Settings */}
            <SettingsSection
              icon={<Monitor className="h-5 w-5" />}
              title="Graphics"
              settings={settings.graphics}
              onUpdate={(key, value) => updateSetting('graphics', key, value)}
              options={{
                quality: ['low', 'medium', 'high', 'ultra'],
                frameRate: [30, 60, 120, 144]
              }}
            />

            {/* Audio Settings */}
            <SettingsSection
              icon={<Volume2 className="h-5 w-5" />}
              title="Audio"
              settings={settings.audio}
              onUpdate={(key, value) => updateSetting('audio', key, value)}
              sliders={['masterVolume', 'engineVolume', 'uiVolume', 'ambientVolume', 'effectsVolume']}
            />

            {/* Gameplay Settings */}
            <SettingsSection
              icon={<Gamepad2 className="h-5 w-5" />}
              title="Gameplay"
              settings={settings.gameplay}
              onUpdate={(key, value) => updateSetting('gameplay', key, value)}
            />

            {/* Accessibility Settings */}
            <SettingsSection
              icon={<Settings className="h-5 w-5" />}
              title="Accessibility"
              settings={settings.accessibility}
              onUpdate={(key, value) => updateSetting('accessibility', key, value)}
              options={{
                colorBlindMode: ['none', 'protanopia', 'deuteranopia', 'tritanopia']
              }}
            />
          </div>

          {/* Performance Info */}
          <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Performance Recommendations</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400">Device Type:</div>
                <div className="text-white">{isMobile ? 'Mobile Device' : 'Desktop'}</div>
              </div>
              <div>
                <div className="text-slate-400">Recommended Quality:</div>
                <div className="text-white capitalize">{isMobile ? 'Medium' : 'High'}</div>
              </div>
              <div>
                <div className="text-slate-400">Memory Usage:</div>
                <div className="text-white">~{isMobile ? '150' : '300'}MB</div>
              </div>
              <div>
                <div className="text-slate-400">Battery Impact:</div>
                <div className="text-white">{isMobile ? 'Optimized' : 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                // Reset to defaults
                window.location.reload();
              }}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection({ 
  icon, 
  title, 
  settings, 
  onUpdate, 
  options = {}, 
  sliders = [] 
}: {
  icon: React.ReactNode;
  title: string;
  settings: any;
  onUpdate: (key: string, value: any) => void;
  options?: Record<string, string[] | number[]>;
  sliders?: string[];
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </h3>

      <div className="space-y-3">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-slate-300 text-sm capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>

            {typeof value === 'boolean' ? (
              <button
                onClick={() => onUpdate(key, !value)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  value ? 'bg-cyan-500' : 'bg-slate-600'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  value ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            ) : sliders.includes(key) ? (
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) => onUpdate(key, Number(e.target.value))}
                  className="w-20 h-1 bg-slate-600 rounded-lg appearance-none slider"
                />
                <span className="text-slate-400 text-xs w-8">{value}%</span>
              </div>
            ) : options[key] ? (
              <select
                value={typeof value === 'number' || typeof value === 'string' ? value as string | number : ''}
                onChange={(e) => onUpdate(key, typeof value === 'number' ? Number(e.target.value) : e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-white text-sm"
              >
                {options[key].map((option) => (
                  <option key={option} value={option}>
                    {String(option).charAt(0).toUpperCase() + String(option).slice(1)}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-slate-400 text-sm">{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Player Page with all new features
export function EnhancedPlayerPage() {
  // Call the useRealTimeEvents hook (adjust as needed based on its actual usage)
  const realTimeEvents = useRealTimeEvents();
  const [showReplay, setShowReplay] = useState(false);
  const [lastRoundData, setLastRoundData] = useState(null);

  return (
    <LoadingOptimizer>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
        {/* Original player page content */}
        
        {/* Enhanced Components */}
        <SoundControls />
        <PerformanceMonitor />
        <AdvancedSettings />
        <TouchControls 
          onLaunch={() => console.log('Launch')}
          onBet={(amount) => console.log('Bet:', amount)}
        />
        <MobileControls />
        
        {/* Flight Replay Modal */}
        {showReplay && (
          <FlightReplay
            roundData={lastRoundData}
            onClose={() => setShowReplay(false)}
          />
        )}
      </div>
    </LoadingOptimizer>
  );
}