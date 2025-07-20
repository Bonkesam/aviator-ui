// components/admin/SystemControls.tsx
import { useState } from 'react';
import { AlertTriangle, Power, Settings as SettingsIcon, Save } from 'lucide-react';

export function SystemControls() {
  const [gameConfig, setGameConfig] = useState({
    minBet: '0.01',
    maxBet: '10',
    houseEdge: '3',
    targetWinRate: '15',
    emergencyStop: false,
    maintenanceMode: false,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleConfigChange = (field: string, value: string | boolean) => {
    setGameConfig(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Implement save functionality
    console.log('Saving config:', gameConfig);
    setHasChanges(false);
  };

  const handleEmergencyStop = () => {
    setGameConfig(prev => ({ ...prev, emergencyStop: !prev.emergencyStop }));
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Controls */}
      <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-500/50">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-bold text-white">Emergency Controls</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={handleEmergencyStop}
            className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              gameConfig.emergencyStop
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <Power className="h-5 w-5" />
            <span>{gameConfig.emergencyStop ? 'Resume Game' : 'Emergency Stop'}</span>
          </button>

          <button
            onClick={() => handleConfigChange('maintenanceMode', !gameConfig.maintenanceMode)}
            className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              gameConfig.maintenanceMode
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-slate-600 hover:bg-slate-700 text-white'
            }`}
          >
            <SettingsIcon className="h-5 w-5" />
            <span>{gameConfig.maintenanceMode ? 'Exit Maintenance' : 'Maintenance Mode'}</span>
          </button>
        </div>
      </div>

      {/* Game Configuration */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Game Configuration</h3>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Minimum Bet (ETH)
              </label>
              <input
                type="number"
                value={gameConfig.minBet}
                onChange={(e) => handleConfigChange('minBet', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                step="0.001"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Maximum Bet (ETH)
              </label>
              <input
                type="number"
                value={gameConfig.maxBet}
                onChange={(e) => handleConfigChange('maxBet', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                House Edge (%)
              </label>
              <input
                type="number"
                value={gameConfig.houseEdge}
                onChange={(e) => handleConfigChange('houseEdge', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                step="0.1"
                min="0"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Win Rate (%)
              </label>
              <input
                type="number"
                value={gameConfig.targetWinRate}
                onChange={(e) => handleConfigChange('targetWinRate', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                step="0.1"
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* VRF Configuration */}
      <VRFConfiguration />
    </div>
  );
}

// VRF Configuration Component
function VRFConfiguration() {
  const [vrfConfig, setVrfConfig] = useState({
    subscriptionId: '7213047476357004314',
    callbackGasLimit: '200000',
    requestConfirmations: '3',
    keyHash: '0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c'
  });

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6">VRF Configuration</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Subscription ID
            </label>
            <input
              type="text"
              value={vrfConfig.subscriptionId}
              onChange={(e) => setVrfConfig(prev => ({ ...prev, subscriptionId: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Callback Gas Limit
            </label>
            <input
              type="number"
              value={vrfConfig.callbackGasLimit}
              onChange={(e) => setVrfConfig(prev => ({ ...prev, callbackGasLimit: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Request Confirmations
            </label>
            <input
              type="number"
              value={vrfConfig.requestConfirmations}
              onChange={(e) => setVrfConfig(prev => ({ ...prev, requestConfirmations: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
              min="1"
              max="200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Key Hash
            </label>
            <input
              type="text"
              value={vrfConfig.keyHash}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono text-sm"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}