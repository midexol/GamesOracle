import React from 'react';

export default function Landing({ onNavigate }) {
  return (
    <>
      <div className="hero">
        <div className="hero-main">
          <div className="eyebrow">Lead Story</div>
          <h2 className="display">Every match, every medal, priced by an agent that shows its work.</h2>
          <p className="lede">
            Ten sports, four venues, eleven days. GamesOracle reads the Glasgow 2026 schedule the moment it's published, drafts a market, and prices it — with a confidence score and a paragraph of reasoning attached, not just a number pulled from nowhere.
          </p>
          <div className="cta-row">
            <button className="btn primary" onClick={() => onNavigate('markets')}>
              Read Today's Markets →
            </button>
            <button className="btn ghost" onClick={() => onNavigate('dispatch')}>
              See a Sample Dispatch
            </button>
          </div>
        </div>
        <div className="hero-side">
          <h3>Wire Bulletins</h3>
          <div className="wire-item">
            <span className="tag">Athletics — 14:20</span>
            <br />
            Women's 100m heats underway at Scotstoun. <span className="stat">AI: 34% JAM gold</span>
          </div>
          <div className="wire-item">
            <span className="tag">Swimming — Live</span>
            <br />
            Men's 100m Freestyle final, Tollcross. <span className="stat">AI: 57% AUS 2+</span>
          </div>
          <div className="wire-item">
            <span className="tag">Markets — Today</span>
            <br />
            14 open, 3 resolved since midnight. <span className="stat">184.20 USDT</span> in fees.
          </div>
        </div>
      </div>

      <div className="method" id="method">
        <h3>How the Wire Is Filed</h3>
        <div className="steps">
          <div className="step">
            <div className="n">01</div>
            <h4>Ingest</h4>
            <p>Agent reads the day's schedule — venue, session, medal event — the moment it's confirmed.</p>
          </div>
          <div className="step">
            <div className="n">02</div>
            <h4>Price</h4>
            <p>Weighs season form, head-to-head history, and injury reports into a probability and a confidence score.</p>
          </div>
          <div className="step">
            <div className="n">03</div>
            <h4>Publish</h4>
            <p>Market goes live with full reasoning attached — no black box, no unexplained line.</p>
          </div>
          <div className="step">
            <div className="n">04</div>
            <h4>Settle</h4>
            <p>When the official result posts, the agent resolves the market on X Layer and pays out automatically.</p>
          </div>
        </div>
      </div>

      <div className="odds-sample">
        <h3>This Morning's Line</h3>
        <table className="box">
          <thead>
            <tr>
              <th>Sport</th>
              <th>Market</th>
              <th>AI %</th>
              <th>Market Line</th>
              <th>Closes</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ cursor: 'pointer' }} onClick={() => onNavigate('dispatch')}>
              <td>Athletics</td>
              <td className="q">Jamaica gold, Women's 100m</td>
              <td className="ai">34%</td>
              <td>38%</td>
              <td>6h</td>
            </tr>
            <tr style={{ cursor: 'pointer' }} onClick={() => onNavigate('markets')}>
              <td>Swimming</td>
              <td className="q">Australia, 2+ golds Day 2</td>
              <td className="ai">57%</td>
              <td>50%</td>
              <td>3h</td>
            </tr>
            <tr style={{ cursor: 'pointer' }} onClick={() => onNavigate('markets')}>
              <td>Boxing</td>
              <td className="q">India, 3+ finals reached</td>
              <td className="ai">41%</td>
              <td>45%</td>
              <td>1d</td>
            </tr>
            <tr style={{ cursor: 'pointer' }} onClick={() => onNavigate('markets')}>
              <td>Netball</td>
              <td className="q">Nigeria to beat Australia, group stage</td>
              <td className="ai">22%</td>
              <td>20%</td>
              <td>1d</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sections" id="sections">
        <div className="section">
          <div className="num">Section A</div>
          <h3>Finance Copilot</h3>
          <p>
            Every market ships with a probability, a confidence score, and the three signals it was weighed on — read like a copilot's memo, not a slot machine.
          </p>
          <span className="stamp">A2MCP · Free Tier</span>
        </div>
        <div className="section">
          <div className="num">Section B</div>
          <h3>Creative Genius</h3>
          <p>
            Ask for a "Nigeria medal bundle" or "Jamaican sprint dominance" and the agent composes a market that's never existed on any book before.
          </p>
          <span className="stamp">Bundle Markets</span>
        </div>
        <div className="section">
          <div className="num">Section C</div>
          <h3>Revenue Rocket</h3>
          <p>
            A 2% resolution fee is collected on every settled market — visible, live, on the ledger page. No slide-deck revenue, only recorded revenue.
          </p>
          <span className="stamp">x402 · Escrow on X Layer</span>
        </div>
      </div>
    </>
  );
}
