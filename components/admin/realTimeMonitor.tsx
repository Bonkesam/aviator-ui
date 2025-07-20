import { Activity } from "lucide-react";

// components/admin/RealTimeMonitor.tsx
export function RealTimeMonitor({ activeRounds }: { activeRounds: any[] }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Live Rounds</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-400">{activeRounds.length} Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {activeRounds.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active rounds</p>
          </div>
        ) : (
          activeRounds.map((round) => (
            <RoundMonitorCard key={round.id} round={round} />
          ))
        )}
      </div>
    </div>
  );
}

function RoundMonitorCard({ round }: { round: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'flying': return 'text-blue-400 bg-blue-500/20';
      case 'ready': return 'text-green-400 bg-green-500/20';
      case 'waiting_vrf': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-bold text-white">#{round.id}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(round.status)}`}>
            {round.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <span className="text-slate-300 font-medium">{round.amount} ETH</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Player: {round.player}</span>
        {round.status === 'flying' && (
          <span className="text-blue-400 font-medium">{round.progress}% complete</span>
        )}
      </div>

      {round.status === 'flying' && (
        <div className="mt-3">
          <div className="w-full h-2 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-1000"
              style={{ width: `${round.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
