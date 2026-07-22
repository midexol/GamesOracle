import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

const MODEL_ID = 'gemini-3.1-flash-lite';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FORECAST_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    prob: { type: SchemaType.NUMBER, description: 'AI-estimated probability of YES, 0-100' },
    confidence: { type: SchemaType.NUMBER, description: 'Confidence in the estimate, 0-100' },
    reasoning: { type: SchemaType.STRING, description: 'Explanation citing the weighted-signal breakdown' },
  },
  required: ['prob', 'confidence', 'reasoning'],
};

const CHAT_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    intent: { type: SchemaType.STRING, enum: ['chat', 'create_market'], format: 'enum' },
    reply: { type: SchemaType.STRING, description: 'Conversational reply shown to the user' },
    marketTitle: { type: SchemaType.STRING, description: 'Only set when intent is create_market' },
    marketSport: { type: SchemaType.STRING, description: 'Only set when intent is create_market' },
  },
  required: ['intent', 'reply'],
};

const FORECAST_SYSTEM_PROMPT = `You are GamesOracle AI, a prediction-market pricing engine for the Glasgow 2026 Commonwealth Games.
Price the probability of the given market resolving YES using this weighted-signal methodology:
- Season Bests (60% weight): each side's 2025-26 season-best performances/times in the discipline.
- Head-to-Head (25% weight): historical record between the named competitors/nations in major championships.
- Fitness/Form (15% weight): recent injury reports, form trends, and roster news.
Return prob (0-100, the AI's estimate of YES), confidence (0-100, how certain the model is given data quality/recency), and reasoning
(2-4 sentences, explicitly citing the three weighted signals and how they combined to the final number, in the voice of a sharp sports-analytics
newsroom). Do not hedge with disclaimers about not having real data — commit to a plausible, internally consistent analysis.`;

const CHAT_SYSTEM_PROMPT = `You are the "Cable to the Oracle" chat agent for GamesOracle AI, a Glasgow 2026 Commonwealth Games prediction-market platform.
Users can ask questions about how the platform works, ask for betting recommendations, or ask you to draft a brand-new market
(e.g. "create a market for Kenya 5000m gold" or "Scotland velodrome dominance").
Decide the intent:
- "chat": general questions, greetings, requests for recommendations/help. Answer helpfully and concisely (2-3 sentences), in character
  as a confident sports-analytics oracle. Reference the live markets list if relevant.
- "create_market": the user is asking you to open/file/draft a new prediction market for a specific event or storyline. Extract a clean
  market title (a short yes/no-style question or headline, e.g. "Kenya gold, Men's 5000m") and the sport it belongs to (one of: Athletics,
  Swimming, Boxing, Cycling, Netball, Weightlifting, or another Commonwealth Games sport if clearly implied). Set reply to a short
  acknowledgement (it will be followed up with the priced market).
Always return valid JSON matching the schema.`;

async function generateJson(systemPrompt, userPrompt, schema) {
  const model = genAI.getGenerativeModel({
    model: MODEL_ID,
    systemInstruction: systemPrompt,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });
  const result = await model.generateContent(userPrompt);
  return JSON.parse(result.response.text());
}

export async function generateForecast({ sport, title }) {
  const userPrompt = `Sport: ${sport}\nMarket: ${title}\n\nPrice this market.`;
  const data = await generateJson(FORECAST_SYSTEM_PROMPT, userPrompt, FORECAST_SCHEMA);
  return {
    prob: Math.max(0, Math.min(100, Math.round(data.prob))),
    confidence: Math.max(0, Math.min(100, Math.round(data.confidence))),
    reasoning: data.reasoning,
  };
}

export async function handleChatMessage({ message, markets }) {
  const marketsSummary = (markets || [])
    .slice(0, 8)
    .map(m => `- [${m.sport}] ${m.title} (AI ${m.prob}% vs line ${m.line}%)`)
    .join('\n');
  const userPrompt = `Live markets:\n${marketsSummary || '(none yet)'}\n\nUser message: ${message}`;
  return generateJson(CHAT_SYSTEM_PROMPT, userPrompt, CHAT_SCHEMA);
}
