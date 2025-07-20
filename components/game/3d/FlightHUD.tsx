// components/game/3d/FlightHUD.tsx
interface FlightHUDProps {
  mode: 'idle' | 'preparing' | 'ready' | 'flying' | 'landed' | 'crashed';
  roundInfo?: any;
  flightProgress: number;
}

export function FlightHUD({ mode, roundInfo, flightProgress }: FlightHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Flight Status */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
          <div className="text-cyan-400 text-sm font-medium uppercase tracking-wider">
            Flight Status
          </div>
          <div className="text-white text-xl font-bold capitalize">
            {mode === 'flying' ? 'In Flight' : mode}
          </div>
        </div>

        {/* Speed & Altitude */}
        {mode === 'flying' && (
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-cyan-400 text-xs uppercase">Speed</div>
                <div className="text-white text-lg font-bold">
                  {Math.round(200 + flightProgress * 100)} km/h
                </div>
              </div>
              <div>
                <div className="text-cyan-400 text-xs uppercase">Altitude</div>
                <div className="text-white text-lg font-bold">
                  {Math.round(1000 + Math.sin(flightProgress * Math.PI) * 500)} ft
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flight Progress */}
      {mode === 'flying' && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-cyan-400 text-sm font-medium">Flight Progress</span>
              <span className="text-white text-sm font-bold">{Math.round(flightProgress * 100)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                style={{ width: `${flightProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Crosshair */}
      {mode === 'flying' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 border-2 border-cyan-400 rounded-full border-dashed animate-spin opacity-60" />
        </div>
      )}
    </div>
  );
}

// UI Overlays Component
export function UIOverlays({ mode, roundInfo }: { mode: string; roundInfo?: any }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse opacity-30" />
      
      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/50" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/50" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/50" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/50" />
    </div>
  );
}