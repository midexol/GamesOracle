import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { generateForecast, handleChatMessage } from './gemini.js';
import okxRouter from './okx/index.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/okx', okxRouter);

app.post('/api/forecast', async (req, res) => {
  const { sport, title } = req.body || {};
  if (!sport || !title) {
    return res.status(400).json({ error: 'sport and title are required' });
  }
  try {
    const forecast = await generateForecast({ sport, title });
    res.json(forecast);
  } catch (err) {
    console.error('[forecast] failed:', err.message);
    res.status(502).json({ error: 'forecast generation failed' });
  }
});

app.post('/api/agent', async (req, res) => {
  const { message, markets } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }
  try {
    const decision = await handleChatMessage({ message, markets });

    if (decision.intent === 'create_market' && decision.marketTitle && decision.marketSport) {
      const forecast = await generateForecast({ sport: decision.marketSport, title: decision.marketTitle });
      return res.json({
        type: 'market',
        reply: decision.reply,
        market: {
          title: decision.marketTitle,
          sport: decision.marketSport,
          ...forecast,
        },
      });
    }

    res.json({ type: 'chat', reply: decision.reply });
  } catch (err) {
    console.error('[agent] failed:', err.message);
    res.status(502).json({ error: 'agent request failed' });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`GamesOracle brain listening on :${port}`));
