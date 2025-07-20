import { useState } from "react";

// components/game/GameHistory.tsx
export function GameHistory() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState<'all' | 'wins' | 'losses'>('all');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Flight History</h1>
        
        <div className="flex items-center space-x-4">
          {/* Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Flights</option>
            <option value="wins">Wins Only</option>
            <option value="losses">Losses Only</option>
          </select>

          {/* Time Range */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Flights" value="156" />
        <StatCard title="Win Rate" value="15.4%" />
        <StatCard title="Total Wagered" value="12.4 ETH" />
        <StatCard title="Net P&L" value="+2.1 ETH" positive />
      </div>

      {/* History Table */}
      <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Round</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Bet</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Result</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Multipliers</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Payout</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {/* Table rows would be populated with actual history data */}
              <tr className="hover:bg-slate-700/30">
                <td className="px-6 py-4 text-white font-medium">#1247</td>
                <td className="px-6 py-4 text-slate-300">2 hours ago</td>
                <td className="px-6 py-4 text-slate-300">0.1 ETH</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Landed
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">1.2x, 1.8x</td>
                <td className="px-6 py-4 text-green-400 font-medium">+0.2 ETH</td>
                <td className="px-6 py-4">
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                    Replay
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, positive }: { title: string; value: string; positive?: boolean }) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <div className="text-slate-400 text-sm">{title}</div>
      <div className={`text-2xl font-bold ${positive ? 'text-green-400' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}

