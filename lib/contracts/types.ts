
// lib/contracts/types.ts
export interface MultiplierBoost {
  position: bigint;
  value: bigint;
  hitByPlane: boolean;
}

export interface Round {
  id: bigint;
  startTime: bigint;
  endTime: bigint;
  betAmount: bigint;
  hiddenRunwayPosition: bigint;
  finalPosition: bigint;
  currentSpeed: bigint;
  vrfRequestId: bigint;
  player: string;
  state: RoundState;
  multipliers: MultiplierBoost[];
  payoutProcessed: boolean;
}

export enum RoundState {
  WAITING_FOR_VRF = 0,
  READY_TO_LAUNCH = 1,
  FLYING = 2,
  LANDED_SAFE = 3,
  CRASHED = 4,
  CANCELLED = 5
}

export interface GameConfig {
  minBet: bigint;
  maxBet: bigint;
  houseEdge: bigint;
  targetWinRate: bigint;
  minRunwayDistance: bigint;
  maxRunwayDistance: bigint;
  roundDuration: bigint;
  emergencyStop: boolean;
}

export interface PlayerRoundState {
  roundId: bigint;
  state: RoundState;
  betAmount: bigint;
  readyToLaunch: boolean;
}