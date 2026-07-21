import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import type { ChatMessage, Market } from '../types';

interface CableToOracleProps {
  setMarkets:    React.Dispatch<React.SetStateAction<Market[]>>;
  onNewMarketId: (id: string) => void;
}

const INITIAL_LOG: ChatMessage[] = [
  { 
    id: 1, 
    sender: 'agent', 
    text: "Hello! Ask me any question about bets, or type an event to file a new market." 
  },
];

const SPORT_KEYWORDS: Array<{ keywords: string[]; sport: string }> = [
  { keywords: ['sprint', 'run', 'track', 'athletics', '100m', '200m', '400m', 'relay', 'marathon'], sport: 'Athletics'     },
  { keywords: ['swim', 'pool', 'water', 'freestyle', 'backstroke', 'butterfly'],                   sport: 'Swimming'       },
  { keywords: ['box', 'fight', 'ring', 'middleweight', 'flyweight', 'heavyweight'],                  sport: 'Boxing'         },
  { keywords: ['cycl', 'bike', 'velodrome', 'peloton', 'tour', 'track cycling'],                   sport: 'Cycling'        },
  { keywords: ['netball', 'court', 'superleague'],                                                sport: 'Netball'        },
  { keywords: ['weight', 'lift', 'barbell', 'snatch', 'clean'],                                   sport: 'Weightlifting'  },
];

function inferSport(text: string): string {
  const lower = text.toLowerCase();
  for (const { keywords, sport } of SPORT_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return sport;
  }
  return 'Special';
}

function getAgentResponse(input: string): { type: 'chat' | 'market'; responseText: string; marketData?: { title: string; sport: string } } {
  const lower = input.toLowerCase().trim();

  // Greeting / Identity
  if (/^(hi|hello|hey|greetings|sup|yo|who are you|what are you)\b/.test(lower)) {
    return {
      type: 'chat',
      responseText: "Hello! I am GamesOracle AI. I analyze historical data and team statistics for Glasgow 2026. You can ask me about available markets, recommendations, or type any event to create a market!",
    };
  }

  // "What bets can I place?" / "What markets are open?" / "How to bet"
  if (lower.includes('what bets') || lower.includes('can i place') || lower.includes('how to bet') || lower.includes('open markets') || lower.includes('what can i bet')) {
    return {
      type: 'chat',
      responseText: "You can place bets on any market in the main table on the left (e.g. Athletics, Swimming, Cycling). Click a row to open the Dispatch & place YES/NO stakes. Or type a custom event here (e.g. 'Australia 4x100m Relay Gold') and I'll generate a live market for you!",
    };
  }

  // Recommendations / Best Edge
  if (lower.includes('recommend') || lower.includes('best bet') || lower.includes('high edge') || lower.includes('top pick')) {
    return {
      type: 'chat',
      responseText: "Top AI Pick: 'Scotland Track Cycling Gold' — Our model estimates a 78% win probability against the implied market line of 68% (offering a +10pp edge). Check the table on the left to stake!",
    };
  }

  // Sports query
  if (lower.includes('what sports') || lower.includes('sports list') || lower.includes('which sports')) {
    return {
      type: 'chat',
      responseText: "We cover all 10 Commonwealth Games sports, including Athletics, Swimming, Boxing, Cycling, Netball, and Weightlifting. Request any custom sport event and I'll calculate the odds!",
    };
  }

  // General question without explicit market intent
  if (lower.endsWith('?') && !lower.startsWith('will') && !lower.includes('create') && !lower.includes('file') && !lower.includes('market')) {
    return {
      type: 'chat',
      responseText: `I am an AI oracle tracking Glasgow 2026. If you want to open a market for "${input}", type "File market: ${input}" or enter the sporting event details!`,
    };
  }

  // Market Creation Intent
  const sport = inferSport(input);
  const cleanInput = input.replace(/^(create|file|make|add)\s+(a\s+)?(market\s+for\s+)?/i, '').trim();
  const title = cleanInput.length > 5
    ? cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1)
    : `Will ${cleanInput} occur?`;

  return {
    type: 'market',
    responseText: '',
    marketData: { title, sport },
  };
}

export default function CableToOracle({ setMarkets, onNewMarketId }: CableToOracleProps): React.ReactElement {
  const [chatLog,   setChatLog]   = useState<ChatMessage[]>(INITIAL_LOG);
  const [chatInput, setChatInput] = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTyping]);

  const handleSend = () => {
    const text = chatInput.trim();
    if (!text || isTyping) return;

    setChatLog(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const result = getAgentResponse(text);

      if (result.type === 'chat') {
        setChatLog(prev => [...prev, {
          id:     Date.now() + 1,
          sender: 'agent',
          text:   result.responseText,
        }]);
      } else if (result.marketData) {
        const { title, sport } = result.marketData;
        const prob = Math.floor(Math.random() * 60) + 15;
        const line = Math.round(prob + (Math.random() > 0.5 ? 4 : -4));
        const conf = Math.floor(Math.random() * 25) + 58;
        const mId  = `market-${Date.now()}`;

        setMarkets(prev => [{
          id:         mId,
          sport,
          title,
          prob,
          line,
          vol:        (Math.floor(Math.random() * 500) + 100).toLocaleString(),
          close:      '1d',
          confidence: conf,
          isNew:      true,
          reasoning:  `Market generated by Oracle Agent. Analyzed team composition, historical medal rates, and recent form metrics. Confidence: ${conf}%.`,
        }, ...prev]);
        onNewMarketId(mId);

        setChatLog(prev => [...prev, {
          id:     Date.now() + 1,
          sender: 'agent',
          text:   `FILED — "${title}," ${prob}% probability, ${conf}% confidence. Published to the live boards.`,
        }]);
      }
    }, 1000);
  };

  return (
    <div className="side-card">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Bot size={12} />
        Cable to the Oracle
      </h3>

      <div className="chat-log">
        <AnimatePresence initial={false}>
          {chatLog.map(msg => (
            <motion.div
              key={msg.id}
              className={`msg ${msg.sender}`}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            className="typing-indicator"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI agent or type a market event..."
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping} title="Send Message">
          {isTyping ? '…' : <Send size={12} />}
        </button>
      </div>
    </div>
  );
}
