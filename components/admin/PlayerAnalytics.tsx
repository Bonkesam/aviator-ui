import { useState } from "react";

// components/admin/PlayerAnalytics.tsx
export function PlayerAnalytics({ playerStats, isLoading }: { playerStats: any[]; isLoading: boolean }) {
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedPlayers = [...playerStats].sort((a, b) => {
    const aValue = parseFloat(a[sortBy]) || 0;
    const bValue = parseFloat(b[sortBy]) || 0;
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Player Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Players" value="89" change="+12" />
        <StatCard title="Active Players" value="23" change="+5" />
        <StatCard title="Avg. Volume" value="2.1 ETH" change="+8.5%" />
        <StatCard title="Avg. Win Rate" value="15.3%" change="-0.2%" />
      </div>

      {/* Top Players Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Player Leaderboard</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                  Player Address
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('rounds')}
                >
                  Rounds {sortBy === 'rounds' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('volume')}
                >
                  Volume {sortBy === 'volume' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('winRate')}
                >
                  Win Rate {sortBy === 'winRate' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('profit')}
                >
                  P&L {sortBy === 'profit' && (sortOrder === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {sortedPlayers.map((player, index) => (
                <tr key={player.address} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${index < 3 ? 'bg-yellow-400' : 'bg-slate-600'}`} />
                      {player.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {player.rounds}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {player.volume} ETH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      player.winRate > 15 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {player.winRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      parseFloat(player.profit) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {player.profit} ETH
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-white text-xl font-bold">{value}</p>
        </div>
        <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {change}
        </div>
      </div>
    </div>
  );
}
