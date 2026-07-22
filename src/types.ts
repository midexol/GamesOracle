// Shared application types for GamesOracle AI

export interface Market {
  id:         string;
  sport:      string;
  title:      string;
  prob:       number;   // AI probability 0–100
  line:       number;   // Market implied line 0–100
  vol:        string;   // Volume string e.g. "1,204"
  close:      string;   // Time to close e.g. "6h", "1d"
  confidence: number;   // AI confidence score 0–100
  isNew?:     boolean;
  reasoning?: string;
}

export interface LedgerPosition {
  sport:       string;
  marketTitle: string;
  side:        'YES' | 'NO';
  staked:      string;    // e.g. "20 USDT"
  status:      'Awaiting result' | 'won' | 'lost';
  result?:     string;
  pnl?:        string;    // e.g. "8.10" or "-15.00"
  txHash?:     string;
}

export interface ChatMessage {
  id:     number;
  sender: 'user' | 'agent';
  text:   string;
}

export type AppTab = 'start' | 'landing' | 'markets' | 'dispatch' | 'ledger' | 'whitepaper' | 'schedule' | 'verdicts' | 'accuracy' | 'api';

export interface ScheduleEvent {
  id:          string;
  sport:       string;
  eventTitle:  string;
  day:         string;
  time:        string;
  venue:       string;
  marketId?:   string;
}

export interface ResolvedMarket {
  id:            string;
  sport:         string;
  title:         string;
  aiProb:        number;
  consensusLine: number;
  outcome:       'YES' | 'NO';
  payoutPool:    string;
  postMortem:    string;
  date:          string;
}

