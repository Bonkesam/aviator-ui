// components/game/TournamentMode.tsx
'use client';

import { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Star } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

interface Tournament {
  id: string;
  name: string;
  description: string;
  entryFee: string;
  prizePool: string;
  maxParticipants: number;
  currentParticipants: number;
  startTime: number;
  endTime: number;
  status: 'upcoming' | 'active' | 'ended';
  leaderboard: TournamentEntry[];
}

interface TournamentEntry {
  rank: number;
  player: string;
  score: number;
  rounds: number;
  bestMultiplier: number;
  winRate: number;
}

export function TournamentMode() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [playerStats, setPlayerStats] = useState<TournamentEntry | null>(null);
  const { trackUserAction } = useAnalytics();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    // Simulate tournament data
    const mockTournaments: Tournament[] = [
      {
        id: 'weekly-champion',
        name: 'Weekly Champion',
        description: 'Compete for the highest win rate this week',
        entryFee: '0.1',
        prizePool: '5.0',
        maxParticipants: 100,
        currentParticipants: 67,
        startTime: Date.now() - 86400000, // Started yesterday
        endTime: Date.now() + 518400000, // Ends in 6 days
        status: 'active',
        leaderboard: [
          { rank: 1, player: '0x742d...35B1', score: 2450, rounds: 23, bestMultiplier: 2.5, winRate: 26.1 },
          { rank: 2, player: '0x8A3f...92C4', score: 2380, rounds: 19, bestMultiplier: 2.2, winRate: 31.6 },
          { rank: 3, player: '0x1B5e...78D9', score: 2320, rounds: 28, bestMultiplier: 2.8, winRate: 21.4 },
        ]
      },
      {
        id: 'high-roller',
        name: 'High Roller Challenge',
        description: 'Minimum 1 ETH bets only',
        entryFee: '1.0',
        prizePool: '25.0',
        maxParticipants: 50,
        currentParticipants: 23,
        startTime: Date.now() + 3600000, // Starts in 1 hour
        endTime: Date.now() + 259200000, // Ends in 3 days
        status: 'upcoming',
        leaderboard: []
      }
    ];

    setTournaments(mockTournaments);
  };

  const joinTournament = async (tournament: Tournament) => {
    trackUserAction('tournament_join', { tournamentId: tournament.id });
    // Implement tournament joining logic
    console.log('Joining tournament:', tournament.id);
  };

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Tournament Mode</h1>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Compete against other players in skill-based tournaments and climb the leaderboards
        </p>
      </div>

      {/* Active Tournaments */}
      <div className="grid md:grid-cols-2 gap-6">
        {tournaments.map((tournament) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            onJoin={() => joinTournament(tournament)}
            onView={() => setSelectedTournament(tournament)}
          />
        ))}
      </div>

      {/* Tournament Details Modal */}
      {selectedTournament && (
        <TournamentDetails
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          playerStats={playerStats}
        />
      )}
    </div>
  );
}

function TournamentCard({ 
  tournament, 
  onJoin, 
  onView 
}: { 
  tournament: Tournament; 
  onJoin: () => void; 
  onView: () => void; 
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'ended': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const timeUntilStart = tournament.startTime - Date.now();
  const timeUntilEnd = tournament.endTime - Date.now();

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
          <p className="text-slate-300 text-sm">{tournament.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tournament.status)}`}>
          {tournament.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-slate-400 text-sm">Entry Fee</div>
          <div className="text-white font-bold">{tournament.entryFee} ETH</div>
        </div>
        <div>
          <div className="text-slate-400 text-sm">Prize Pool</div>
          <div className="text-white font-bold">{tournament.prizePool} ETH</div>
        </div>
        <div>
          <div className="text-slate-400 text-sm">Participants</div>
          <div className="text-white font-bold">
            {tournament.currentParticipants}/{tournament.maxParticipants}
          </div>
        </div>
        <div>
          <div className="text-slate-400 text-sm">
            {tournament.status === 'upcoming' ? 'Starts In' : 'Ends In'}
          </div>
          <div className="text-white font-bold">
            {tournament.status === 'upcoming' 
              ? formatTimeRemaining(timeUntilStart)
              : formatTimeRemaining(timeUntilEnd)
            }
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onView}
          className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          View Details
        </button>
        {tournament.status === 'upcoming' && (
          <button
            onClick={onJoin}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            Join Tournament
          </button>
        )}
      </div>
    </div>
  );
}

function TournamentDetails({ 
  tournament, 
  onClose, 
  playerStats 
}: { 
  tournament: Tournament; 
  onClose: () => void; 
  playerStats: TournamentEntry | null; 
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <span>{tournament.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tournament Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Tournament Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prize Pool:</span>
                    <span className="text-white font-bold">{tournament.prizePool} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Entry Fee:</span>
                    <span className="text-white font-bold">{tournament.entryFee} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Participants:</span>
                    <span className="text-white font-bold">
                      {tournament.currentParticipants}/{tournament.maxParticipants}
                    </span>
                  </div>
                </div>
              </div>

              {/* Player Stats */}
              {playerStats && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Rank:</span>
                      <span className="text-white font-bold">#{playerStats.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Score:</span>
                      <span className="text-white font-bold">{playerStats.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className="text-white font-bold">{playerStats.winRate}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
              <div className="space-y-3">
                {tournament.leaderboard.map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-black' :
                        entry.rank === 2 ? 'bg-slate-400 text-black' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-slate-600 text-white'
                      }`}>
                        {entry.rank}
                      </div>
                      <div>
                        <div className="text-white font-medium">{entry.player}</div>
                        <div className="text-slate-400 text-sm">{entry.rounds} rounds</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{entry.score}</div>
                      <div className="text-slate-400 text-sm">{entry.winRate}% WR</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Ended';
  
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

// components/game/AchievementSystem.tsx
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'milestone' | 'skill' | 'streak' | 'special';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: number;
  reward?: {
    type: 'badge' | 'multiplier' | 'title';
    value: string;
  };
}

export function AchievementSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentUnlocks, setRecentUnlocks] = useState<Achievement[]>([]);
  const { trackUserAction } = useAnalytics();

  useEffect(() => {
    loadAchievements();
    checkForNewAchievements();
  }, []);

  const loadAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: 'first-flight',
        title: 'First Flight',
        description: 'Complete your first round',
        icon: '🛫',
        type: 'milestone',
        progress: 1,
        maxProgress: 1,
        unlocked: true,
        unlockedAt: Date.now() - 86400000
      },
      {
        id: 'high-roller',
        title: 'High Roller',
        description: 'Place a bet of 1 ETH or more',
        icon: '💎',
        type: 'milestone',
        progress: 0,
        maxProgress: 1,
        unlocked: false
      },
      {
        id: 'ace-pilot',
        title: 'Ace Pilot',
        description: 'Win 5 rounds in a row',
        icon: '🎖️',
        type: 'streak',
        progress: 2,
        maxProgress: 5,
        unlocked: false
      },
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Hit a 2.5x multiplier',
        icon: '⚡',
        type: 'skill',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        reward: { type: 'multiplier', value: '1.1x luck boost' }
      },
      {
        id: 'century-club',
        title: 'Century Club',
        description: 'Complete 100 rounds',
        icon: '💯',
        type: 'milestone',
        progress: 47,
        maxProgress: 100,
        unlocked: false
      }
    ];

    setAchievements(mockAchievements);
  };

  const checkForNewAchievements = () => {
    // This would be called after game events to check for achievement unlocks
    // Implementation would compare current stats against achievement requirements
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => 
      achievement.id === achievementId 
        ? { ...achievement, unlocked: true, unlockedAt: Date.now() }
        : achievement
    ));

    const unlockedAchievement = achievements.find(a => a.id === achievementId);
    if (unlockedAchievement) {
      setRecentUnlocks(prev => [unlockedAchievement, ...prev.slice(0, 4)]);
      trackUserAction('achievement_unlocked', { achievementId });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'from-blue-500 to-cyan-500';
      case 'skill': return 'from-purple-500 to-pink-500';
      case 'streak': return 'from-orange-500 to-red-500';
      case 'special': return 'from-yellow-500 to-orange-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Star className="h-8 w-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Achievements</h1>
        </div>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Unlock achievements by completing challenges and showcase your piloting skills
        </p>
      </div>

      {/* Recent Unlocks */}
      {recentUnlocks.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/50">
          <h2 className="text-xl font-bold text-white mb-4">🎉 Recently Unlocked</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {recentUnlocks.slice(0, 2).map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div>
                  <div className="text-white font-bold">{achievement.title}</div>
                  <div className="text-yellow-200 text-sm">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['milestone', 'skill', 'streak', 'special'].map((type) => {
          const count = achievements.filter(a => a.type === type && a.unlocked).length;
          const total = achievements.filter(a => a.type === type).length;
          
          return (
            <div key={type} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-slate-400 text-sm capitalize">{type}</div>
              <div className="text-white text-2xl font-bold">{count}/{total}</div>
              <div className="w-full h-2 bg-slate-700 rounded-full mt-2">
                <div 
                  className={`h-full bg-gradient-to-r ${getTypeColor(type)} rounded-full transition-all duration-500`}
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <AchievementCard 
            key={achievement.id} 
            achievement={achievement}
            onUnlock={() => unlockAchievement(achievement.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ 
  achievement, 
  onUnlock 
}: { 
  achievement: Achievement; 
  onUnlock: () => void; 
}) {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
  const isComplete = achievement.progress >= achievement.maxProgress;

  return (
    <div className={`relative rounded-2xl p-6 border transition-all duration-300 ${
      achievement.unlocked 
        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg' 
        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
    }`}>
      {/* Unlock Animation Overlay */}
      {achievement.unlocked && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 animate-pulse" />
      )}

      <div className="relative z-10">
        {/* Icon and Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
              {achievement.icon}
            </div>
            <div>
              <h3 className={`font-bold ${achievement.unlocked ? 'text-white' : 'text-slate-400'}`}>
                {achievement.title}
              </h3>
              <p className={`text-sm ${achievement.unlocked ? 'text-slate-200' : 'text-slate-500'}`}>
                {achievement.description}
              </p>
            </div>
          </div>
          
          {achievement.unlocked && (
            <div className="text-yellow-400">
              <Star className="h-6 w-6 fill-current" />
            </div>
          )}
        </div>

        {/* Progress */}
        {!achievement.unlocked && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-slate-300">
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Reward */}
        {achievement.reward && achievement.unlocked && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Reward</div>
            <div className="text-white font-medium">{achievement.reward.value}</div>
          </div>
        )}

        {/* Unlock Date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="mt-4 text-xs text-slate-400">
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}