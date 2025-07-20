// components/admin/RoundManagement.tsx
import { useState } from 'react';
import { Search, Filter, Eye, StopCircle, RotateCcw, Activity } from 'lucide-react';

export function RoundManagement({ activeRounds, isLoading }: { activeRounds: any[]; isLoading: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleEmergencyStop = (roundId: number) => {
    // Implement emergency stop functionality
    console.log(`Emergency stopping round ${roundId}`);
  };

  const handleViewDetails = (roundId: number) => {
    // Implement view details functionality
    console.log(`Viewing details for round ${roundId}`);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by round ID or player address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="all">All Status</option>
              <option value="flying">Flying</option>
              <option value="ready">Ready</option>
              <option value="waiting_vrf">Waiting VRF</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rounds Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Round Management</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Round ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Player</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Bet Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {activeRounds.map((round) => (
                <tr key={round.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    #{round.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {round.player}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {round.amount} ETH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(round.status)}`}>
                      {round.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {round.status === 'flying' ? `${round.progress}%` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(round.id)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {round.status === 'flying' && (
                        <button
                          onClick={() => handleEmergencyStop(round.id)}
                          className="p-1 text-red-400 hover:text-red-300 transition-colors"
                          title="Emergency Stop"
                        >
                          <StopCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {activeRounds.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No rounds found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function getStatusColor(status: string) {
    switch (status) {
      case 'flying': return 'text-blue-400 bg-blue-500/20';
      case 'ready': return 'text-green-400 bg-green-500/20';
      case 'waiting_vrf': return 'text-yellow-400 bg-yellow-500/20';
      case 'completed': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  }
}