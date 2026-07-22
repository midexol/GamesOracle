// Client for the GamesOracle Agent Brain backend (server/).
// Set BRAIN_URL in .env for production builds; falls back to local dev server.
const BRAIN_URL = process.env.BRAIN_URL || 'http://localhost:8787';

export interface Forecast {
  prob: number;
  confidence: number;
  reasoning: string;
}

export interface AgentResponse {
  type: 'chat' | 'market';
  reply: string;
  market?: {
    title: string;
    sport: string;
    prob: number;
    confidence: number;
    reasoning: string;
  };
}

export async function fetchForecast(sport: string, title: string): Promise<Forecast> {
  const res = await fetch(`${BRAIN_URL}/api/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sport, title }),
  });
  if (!res.ok) throw new Error(`forecast request failed: ${res.status}`);
  return res.json();
}

export async function askAgent(message: string, markets: Array<{ sport: string; title: string; prob: number; line: number }>): Promise<AgentResponse> {
  const res = await fetch(`${BRAIN_URL}/api/agent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, markets }),
  });
  if (!res.ok) throw new Error(`agent request failed: ${res.status}`);
  return res.json();
}
