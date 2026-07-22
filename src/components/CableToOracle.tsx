import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import type { ChatMessage, Market } from '../types';
import { askAgent } from '../lib/brain';

interface CableToOracleProps {
  markets:       Market[];
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

export default function CableToOracle({ markets, setMarkets, onNewMarketId }: CableToOracleProps): React.ReactElement {
  const [chatLog,   setChatLog]   = useState<ChatMessage[]>(INITIAL_LOG);
  const [chatInput, setChatInput] = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog, isTyping]);

  const handleSend = async () => {
    const text = chatInput.trim();
    if (!text || isTyping) return;

    setChatLog(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const result = await askAgent(text, markets.map(m => ({ sport: m.sport, title: m.title, prob: m.prob, line: m.line })));

      if (result.type === 'chat' || !result.market) {
        setChatLog(prev => [...prev, {
          id:     Date.now() + 1,
          sender: 'agent',
          text:   result.reply,
        }]);
      } else {
        const { title, sport, prob, confidence, reasoning } = result.market;
        const line = Math.round(prob + (Math.random() > 0.5 ? 4 : -4));
        const mId  = `market-${Date.now()}`;

        setMarkets(prev => [{
          id:         mId,
          sport,
          title,
          prob,
          line,
          vol:        (Math.floor(Math.random() * 500) + 100).toLocaleString(),
          close:      '1d',
          confidence,
          isNew:      true,
          reasoning,
        }, ...prev]);
        onNewMarketId(mId);

        setChatLog(prev => [...prev, {
          id:     Date.now() + 1,
          sender: 'agent',
          text:   result.reply || `FILED — "${title}," ${prob}% probability, ${confidence}% confidence. Published to the live boards.`,
        }]);
      }
    } catch (err) {
      setChatLog(prev => [...prev, {
        id:     Date.now() + 1,
        sender: 'agent',
        text:   "The Oracle's cable dropped — the brain service didn't respond. Try again in a moment.",
      }]);
    } finally {
      setIsTyping(false);
    }
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
