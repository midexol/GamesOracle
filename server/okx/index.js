import { Router } from 'express';
import { requirePayment, USDT0_XLAYER } from './payment.js';
import { markets, findMarket, addMarket, getPortfolio } from '../store.js';
import { generateForecast } from '../gemini.js';

const router = Router();

const TOOL_SCHEMA = [
  { name: 'get_markets', description: "Returns list of active and resolved prediction pools.",
    input_schema: { sport: 'string?', day: 'string?', status: 'string?' } },
  { name: 'get_forecast', description: 'Returns probability, confidence metrics, and structured textual reasoning for a market.',
    input_schema: { market_id: 'string' } },
  { name: 'create_market', description: 'Allows external agents to file new predictions.',
    input_schema: { question: 'string', sport: 'string', event: 'string?', close_time: 'string?' } },
  { name: 'get_portfolio', description: 'Retrieves open positions and ledger history for a wallet.',
    input_schema: { wallet_address: 'string' } },
];

// Discovery — probed by OKX's ASP marketplace crawler.
router.get('/', (req, res) => {
  res.json({
    name: 'GamesOracle AI',
    description: 'Prediction-market oracle agent for the Glasgow 2026 Commonwealth Games.',
    payment: { scheme: 'exact', network: 'eip155:196', asset: 'USDT0', assetAddress: USDT0_XLAYER },
    tools: TOOL_SCHEMA,
  });
});

// get_markets — free, read-only.
router.all('/get_markets', (req, res) => {
  const { sport, status } = req.method === 'GET' ? req.query : (req.body || {});
  let results = markets;
  if (sport) results = results.filter(m => m.sport.toLowerCase() === String(sport).toLowerCase());
  if (status) results = results.filter(m => m.status === status);
  res.json({ markets: results });
});

// get_forecast — paid.
router.post('/get_forecast', requirePayment(0.02, 'GamesOracle: get_forecast — 0.02 USDT0'), (req, res) => {
  const { market_id } = req.body || {};
  const market = findMarket(market_id);
  if (!market) return res.status(404).json({ error: 'market not found' });
  res.json({ prob: market.prob, confidence: market.confidence, reasoning: market.reasoning });
});

// create_market — paid.
router.post('/create_market', requirePayment(0.05, 'GamesOracle: create_market — 0.05 USDT0'), async (req, res) => {
  const { question, sport, event } = req.body || {};
  if (!question || !sport) return res.status(400).json({ error: 'question and sport are required' });
  try {
    const title = event || question;
    const forecast = await generateForecast({ sport, title });
    const market = addMarket({
      id: `market-${Date.now()}`,
      sport,
      title,
      ...forecast,
      line: forecast.prob,
      vol: '0',
      close: '2d',
      status: 'open',
    });
    res.json({ market });
  } catch (err) {
    console.error('[create_market] failed:', err.message);
    res.status(502).json({ error: 'market creation failed' });
  }
});

// get_portfolio — free, read-only.
router.all('/get_portfolio', (req, res) => {
  const { wallet_address } = req.method === 'GET' ? req.query : (req.body || {});
  if (!wallet_address) return res.status(400).json({ error: 'wallet_address is required' });
  res.json({ wallet_address, positions: getPortfolio(wallet_address) });
});

export default router;
