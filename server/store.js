// In-memory market/portfolio store for the GamesOracle brain server.
// Hackathon scope — no DB. Resets on server restart.

export const markets = [
  { id: 'market-1', sport: 'Athletics', title: "Jamaica gold, Women's 100m", prob: 34, line: 38, vol: '1,204', close: '6h', confidence: 71, status: 'open',
    reasoning: "Season bests favour Jamaica narrowly (60% weight); head-to-head record vs the field leader is close (25%); fitness reports are clean (15%)." },
  { id: 'market-2', sport: 'Swimming', title: 'Australia, 2+ golds Day 2', prob: 57, line: 50, vol: '860', close: '3h', confidence: 82, status: 'open',
    reasoning: 'Strong relay entries and individual depth in the freestyle sprints, weighted 50% season times / 30% relay dynamics / 20% historical record.' },
];

export const portfolios = {}; // wallet_address -> [{ marketId, side, amount, txHash, timestamp }]

export function findMarket(id) {
  return markets.find(m => m.id === id);
}

export function addMarket(market) {
  markets.unshift(market);
  return market;
}

export function getPortfolio(walletAddress) {
  return portfolios[walletAddress] || [];
}
