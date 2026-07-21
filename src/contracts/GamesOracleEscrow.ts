// ============================================================
// GamesOracle AI — GamesOracleEscrow Contract Layer
// X Layer (EVM-compatible) · Solidity 0.8.24
// ============================================================

// ------ ABI --------------------------------------------------

export const GAMES_ORACLE_ESCROW_ABI = [
  {
    name: 'createMarket',
    type: 'function',
    inputs: [
      { name: 'marketId', type: 'bytes32' },
      { name: 'question',  type: 'string'  },
      { name: 'closeTime', type: 'uint256' },
      { name: 'oracle',    type: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'stake',
    type: 'function',
    inputs: [
      { name: 'marketId', type: 'bytes32' },
      { name: 'yes',      type: 'bool'    },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'resolveMarket',
    type: 'function',
    inputs: [
      { name: 'marketId', type: 'bytes32' },
      { name: 'outcome',  type: 'bool'    },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'claimPayout',
    type: 'function',
    inputs: [
      { name: 'marketId', type: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'markets',
    type: 'function',
    inputs: [{ name: 'marketId', type: 'bytes32' }],
    outputs: [
      { name: 'question',  type: 'string'  },
      { name: 'closeTime', type: 'uint256' },
      { name: 'status',    type: 'uint8'   },
      { name: 'outcome',   type: 'bool'    },
      { name: 'yesPool',   type: 'uint256' },
      { name: 'noPool',    type: 'uint256' },
      { name: 'oracle',    type: 'address' },
    ],
    stateMutability: 'view',
  },
] as const;

// ------ Types ------------------------------------------------

export type MarketStatus = 'Open' | 'Resolved' | 'Disputed';

export interface ContractMarket {
  question:  string;
  closeTime: number;
  status:    MarketStatus;
  outcome:   boolean;
  yesPool:   bigint;
  noPool:    bigint;
  oracle:    string;
}

export interface EscrowPosition {
  marketId:  string;
  side:      'YES' | 'NO';
  amount:    number;
  txHash:    string;
  timestamp: number;
}

export interface StakeResult {
  txHash:  string;
  success: boolean;
}

// ------ Helpers ----------------------------------------------

/** Generate a realistic-looking mock transaction hash */
function mockTxHash(): string {
  const hex = '0123456789abcdef';
  return '0x' + Array.from({ length: 64 }, () => hex[Math.floor(Math.random() * 16)]).join('');
}

/** Simulate network latency */
function simulateLatency(ms = 700): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ------ Mock useEscrow hook ----------------------------------
// Falls back to local simulation when no Web3 provider is present.
// Replace the function bodies with real ethers.js / viem calls
// once an X Layer provider is connected.

export function useEscrow() {
  /**
   * stake(marketId, side, amount)
   * Simulates a call to `GamesOracleEscrow.stake(marketId, yes)`.
   * Returns the simulated transaction hash.
   */
  const stake = async (
    marketId: string,
    side: 'YES' | 'NO',
    amount: number,
  ): Promise<StakeResult> => {
    await simulateLatency(600);
    console.info(`[Escrow] stake() called — market: ${marketId}, side: ${side}, amount: ${amount} USDT`);
    return { txHash: mockTxHash(), success: true };
  };

  /**
   * resolveMarket(marketId, outcome)
   * Simulates a call to `GamesOracleEscrow.resolveMarket(marketId, outcome)`.
   */
  const resolveMarket = async (
    marketId: string,
    outcome: boolean,
  ): Promise<void> => {
    await simulateLatency(500);
    console.info(`[Escrow] resolveMarket() — market: ${marketId}, outcome: ${outcome}`);
  };

  /**
   * claimPayout(marketId)
   * Simulates a call to `GamesOracleEscrow.claimPayout(marketId)`.
   * Returns the payout transaction hash on success.
   */
  const claimPayout = async (marketId: string): Promise<StakeResult> => {
    await simulateLatency(900);
    console.info(`[Escrow] claimPayout() — market: ${marketId}`);
    return { txHash: mockTxHash(), success: true };
  };

  return { stake, resolveMarket, claimPayout };
}

// ------ Contract address (X Layer Testnet) -------------------

export const CONTRACT_ADDRESS = '0x000000000000000000000000GamesOracleEscrow' as const;
export const X_LAYER_EXPLORER = 'https://www.oklink.com/x1-test/tx/';
