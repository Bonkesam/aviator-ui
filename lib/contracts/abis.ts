// lib/contracts/abis.ts
export const AVIATOR_ABI = [
  // View Functions
  {
    "inputs": [{"name": "_player", "type": "address"}],
    "name": "getPlayerRoundState",
    "outputs": [
      {"name": "roundId", "type": "uint256"},
      {"name": "state", "type": "uint8"},
      {"name": "betAmount", "type": "uint256"},
      {"name": "readyToLaunch", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_roundId", "type": "uint256"}],
    "name": "getVisibleRoundInfo",
    "outputs": [
      {"name": "multipliers", "type": "tuple[]", "components": [
        {"name": "position", "type": "uint128"},
        {"name": "value", "type": "uint128"},
        {"name": "hitByPlane", "type": "bool"}
      ]},
      {"name": "currentPosition", "type": "uint256"},
      {"name": "currentSpeed", "type": "uint256"},
      {"name": "state", "type": "uint8"},
      {"name": "betAmount", "type": "uint256"},
      {"name": "player", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameConfig",
    "outputs": [
      {"name": "minBet", "type": "uint256"},
      {"name": "maxBet", "type": "uint256"},
      {"name": "houseEdge", "type": "uint256"},
      {"name": "targetWinRate", "type": "uint256"},
      {"name": "minRunwayDistance", "type": "uint256"},
      {"name": "maxRunwayDistance", "type": "uint256"},
      {"name": "roundDuration", "type": "uint256"},
      {"name": "emergencyStop", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Write Functions
  {
    "inputs": [],
    "name": "placeBetAndCreateRound",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_roundId", "type": "uint256"}],
    "name": "launchPlane",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_roundId", "type": "uint256"}],
    "name": "claimPayout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "roundId", "type": "uint256"},
      {"indexed": true, "name": "player", "type": "address"},
      {"name": "betAmount", "type": "uint256"}
    ],
    "name": "RoundCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "roundId", "type": "uint256"},
      {"name": "multipliers", "type": "tuple[]", "components": [
        {"name": "position", "type": "uint128"},
        {"name": "value", "type": "uint128"},
        {"name": "hitByPlane", "type": "bool"}
      ]}
    ],
    "name": "RoundReadyToLaunch",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "roundId", "type": "uint256"},
      {"indexed": true, "name": "player", "type": "address"}
    ],
    "name": "RoundLaunched",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "roundId", "type": "uint256"},
      {"name": "position", "type": "uint256"},
      {"name": "value", "type": "uint256"},
      {"name": "newSpeed", "type": "uint256"}
    ],
    "name": "MultiplierHit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "roundId", "type": "uint256"},
      {"name": "state", "type": "uint8"},
      {"name": "finalPosition", "type": "uint256"},
      {"name": "runwayPosition", "type": "uint256"}
    ],
    "name": "RoundEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "roundId", "type": "uint256"},
      {"indexed": true, "name": "player", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "PayoutProcessed",
    "type": "event"
  }
] as const;