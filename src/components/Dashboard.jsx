import React, { useState, useRef, useEffect } from 'react';

export default function Dashboard({
  markets,
  setMarkets,
  onNavigate,
  setSelectedMarket,
  ledger,
  platformFees
}) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      id: 1,
      sender: 'user',
      text: 'Create a market for the Nigeria medal bundle'
    },
    {
      id: 2,
      sender: 'agent',
      text: 'FILED — "Nigeria: Over/Under 8 total medals," 61% probability, 74% confidence, weighted on 2022 form and current squad depth. Published to the line above.'
    }
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll chat to bottom when messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  const handleFilterClick = (sport) => {
    setSelectedFilter(sport);
  };

  const handleMarketClick = (market) => {
    setSelectedMarket(market);
    onNavigate('dispatch');
  };

  const handleSendChat = () => {
    const text = chatInput.trim();
    if (!text) return;

    // Add user message
    const userMsgId = Date.now();
    const newUserMsg = { id: userMsgId, sender: 'user', text };
    setChatLog((prev) => [...prev, newUserMsg]);
    setChatInput('');

    // Simulate Agent processing and dynamic market creation
    setTimeout(() => {
      // Determine sport based on input
      let sport = 'Special';
      let cleanInput = text.toLowerCase();
      if (cleanInput.includes('sprint') || cleanInput.includes('run') || cleanInput.includes('track') || cleanInput.includes('athletics')) {
        sport = 'Athletics';
      } else if (cleanInput.includes('swim') || cleanInput.includes('pool') || cleanInput.includes('water')) {
        sport = 'Swimming';
      } else if (cleanInput.includes('box') || cleanInput.includes('fight') || cleanInput.includes('ring')) {
        sport = 'Boxing';
      } else if (cleanInput.includes('cycl') || cleanInput.includes('bike') || cleanInput.includes('velodrome')) {
        sport = 'Cycling';
      } else if (cleanInput.includes('netball') || cleanInput.includes('court')) {
        sport = 'Netball';
      } else if (cleanInput.includes('weight') || cleanInput.includes('lift')) {
        sport = 'Weightlifting';
      }

      // Generate a title
      let title = `AI-Drafted: "${text}"`;
      if (cleanInput.includes('dominance') || cleanInput.includes('bundle')) {
        title = text.charAt(0).toUpperCase() + text.slice(1);
      } else {
        title = `Will ${text.charAt(0).toLowerCase() + text.slice(1)} occur?`;
      }

      // Probabilities
      const randomProb = Math.floor(Math.random() * 60) + 15; // 15% - 75%
      const randomLine = randomProb + (Math.random() > 0.5 ? 4 : -4); // close to AI probability

      // Create new market object
      const newMarket = {
        id: 'market-' + Date.now(),
        sport,
        title,
        prob: randomProb,
        line: randomLine,
        vol: (Math.floor(Math.random() * 500) + 100).toLocaleString(),
        close: '1d',
        reasoning: `Market dynamically filed from incoming cable feed. Weighed 50% on current tournament form, 30% on team registration size, and 20% on historical regional performance. Confidence score sets at ${randomProb + 10}%.`
      };

      // Add to markets state
      setMarkets((prevMarkets) => [newMarket, ...prevMarkets]);

      // Add agent response
      const newAgentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        text: `FILED — "${title}," ${randomProb}% probability, ${randomProb + 10}% confidence. Placed on live boards.`
      };
      setChatLog((prev) => [...prev, newAgentMsg]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  const filteredMarkets = selectedFilter === 'All'
    ? markets
    : markets.filter(m => m.sport.toLowerCase() === selectedFilter.toLowerCase());

  return (
    <div className="layout">
      <div className="main-col">
        <div className="col-head">
          <h2>This Morning's Line</h2>
          <span className="sub">SPREAD SHOWN VS. AI PRICE</span>
        </div>
        <div className="filters">
          {['All', 'Athletics', 'Swimming', 'Boxing', 'Cycling', 'Netball'].map((sport) => (
            <div
              key={sport}
              className={`chip ${selectedFilter === sport ? 'active' : ''}`}
              onClick={() => handleFilterClick(sport)}
            >
              {sport}
            </div>
          ))}
        </div>
        <table className="markets">
          <thead>
            <tr>
              <th>Sport</th>
              <th>Market</th>
              <th>AI vs. Line</th>
              <th>Vol.</th>
              <th>Closes</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarkets.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                  No open markets in this section.
                </td>
              </tr>
            ) : (
              filteredMarkets.map((m) => (
                <tr key={m.id || m.title} onClick={() => handleMarketClick(m)}>
                  <td className="tag">{m.sport}</td>
                  <td className="question">{m.title}</td>
                  <td>
                    <div className="rail">
                      <div className="rail-fill" style={{ width: `${m.prob}%` }}></div>
                      <div className="rail-tick" style={{ left: `${m.line}%` }}></div>
                    </div>
                    <div className="rail-vals">
                      AI {m.prob}% · Line {m.line}%
                    </div>
                  </td>
                  <td>{m.vol} USDT</td>
                  <td>{m.close}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="side-col">
        <div className="side-card">
          <h3>Cable to the Oracle</h3>
          <div className="chat-log">
            {chatLog.map((msg) => (
              <div key={msg.id} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Jamaica sprint dominance market"
            />
            <button onClick={handleSendChat}>Send</button>
          </div>
        </div>

        <div className="side-card">
          <h3>Your Ledger</h3>
          {ledger.filter(pos => pos.status === 'Awaiting result').slice(0, 3).map((pos, idx) => (
            <div className="portfolio-row" key={idx}>
              <span>{pos.marketTitle.length > 25 ? pos.marketTitle.substring(0, 25) + '...' : pos.marketTitle}</span>
              <span className="val">({pos.side}) {pos.staked}</span>
            </div>
          ))}
          {ledger.filter(pos => pos.status === 'Awaiting result').length === 0 && (
            <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '10px 0' }}>
              No open positions. Clip & Stake on details pages to trade.
            </div>
          )}
        </div>

        <div className="side-card">
          <h3>Fee Circulation</h3>
          <div className="fee-counter">
            {platformFees.toFixed(2)}
            <span className="unit">USDT collected, 2% platform fee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
