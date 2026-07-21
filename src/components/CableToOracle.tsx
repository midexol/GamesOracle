import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Bot } from 'lucide-react';
import type { ChatMessage, Market } from '../types';

interface CableToOracleProps {
  setMarkets:    React.Dispatch<React.SetStateAction<Market[]>>;
  onNewMarketId: (id: string) => void;
}

const INITIAL_LOG: ChatMessage[] = [
  { id: 1, sender: 'user',  text: "Create a market for the Nigeria medal bundle" },
  { id: 2, sender: 'agent', text: "FILED — \"Nigeria: Over/Under 8 total medals,\" 61% probability, 74% confidence. Published to the live boards." },
];

const SPORT_KEYWORDS: Array<{ keywords: string[]; sport: string }> = [
  { keywords: ['sprint', 'run', 'track', 'athletics', '100m', '200m', '400m'], sport: 'Athletics'     },
  { keywords: ['swim', 'pool', 'water', 'freestyle', 'backstroke'],            sport: 'Swimming'       },
  { keywords: ['box', 'fight', 'ring', 'middleweight', 'flyweight'],           sport: 'Boxing'         },
  { keywords: ['cycl', 'bike', 'velodrome', 'peloton', 'tour'],                sport: 'Cycling'        },
  { keywords: ['netball', 'court', 'superleague'],                             sport: 'Netball'        },
  { keywords: ['weight', 'lift', 'barbell', 'snatch', 'clean'],                sport: 'Weightlifting'  },
];

function inferSport(text: string): string {
  const lower = text.toLowerCase();
  for (const { keywords, sport } of SPORT_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return sport;
  }
  return 'Special';
}

export default function CableToOracle({ setMarkets, onNewMarketId }: CableToOracleProps): React.ReactElement {
  const [chatLog,    setChatLog]    = useState<ChatMessage[]>(INITIAL_LOG);
  const [chatInput,  setChatInput]  = useState('');
  const [isTyping,   setIsTyping]   = useState(false);
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

      const sport     = inferSport(text);
      const lower     = text.toLowerCase();
      const hasBundle = lower.includes('dominance') || lower.includes('bundle') || lower.includes('over/under');
      const title     = hasBundle
        ? text.charAt(0).toUpperCase() + text.slice(1)
        : `Will ${text.charAt(0).toLowerCase() + text.slice(1)} occur?`;

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
        reasoning:  `Market filed from incoming cable. Weighted 50% on current tournament form, 30% on team registration size, 20% on historical regional performance. Confidence: ${conf}%.`,
      }, ...prev]);
      onNewMarketId(mId);

      setChatLog(prev => [...prev, {
        id:     Date.now() + 1,
        sender: 'agent',
        text:   `FILED — "${title}," ${prob}% probability, ${conf}% confidence. Placed on live boards.`,
      }]);
    }, 1400);
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
          placeholder="e.g. Scotland velodrome dominance"
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping} title="Send">
          {isTyping ? '…' : <Send size={12} />}
        </button>
      </div>
    </div>
  );
}
