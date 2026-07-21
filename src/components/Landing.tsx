import React from 'react';
import type { AppTab } from '../types';

interface LandingProps {
  onNavigate:      (tab: AppTab) => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
  walletAddress:   string;
}

export default function Landing({
  onNavigate,
  walletConnected,
  onConnectWallet,
  walletAddress,
}: LandingProps): React.ReactElement {
  return (
    <>
      <div className="hero">
        <div className="hero-main">
          <div className="eyebrow">Lead Story</div>
          <h2 className="display">
            Every match, every medal, priced by an agent that shows its work.
          </h2>
          <p className="lede">
            Ten sports, four venues, eleven days. GamesOracle reads the Glasgow 2026 schedule the moment it's published, drafts a market, and prices it — with a confidence score and a paragraph of reasoning attached, not just a number pulled from nowhere.
          </p>
          <div className="cta-row">
            <button className="btn primary hard-shadow-sm" onClick={() => onNavigate('markets')}>
              Read Today's Markets →
            </button>
            <button className="btn ghost" onClick={() => onNavigate('dispatch')}>
              See a Sample Dispatch
            </button>
          </div>
          <div className="hero-wallet-cta">
            {walletConnected ? (
              <>
                <button className="btn ghost" onClick={onConnectWallet}
                  style={{ fontSize: '11px', padding: '8px 14px' }}>Disconnect</button>
                <span className="wallet-status">{walletAddress}</span>
              </>
            ) : (
              <button className="btn primary hard-shadow-sm" onClick={onConnectWallet}
                style={{ fontSize: '11px', padding: '10px 18px' }}>
                ⬡ Connect OKX Wallet
              </button>
            )}
            {!walletConnected && (
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px', color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Required to stake markets
              </span>
            )}
          </div>
        </div>

        <div className="hero-side">
          <h3>Wire Bulletins</h3>
          {[
            { tag: 'Athletics — 14:20', body: "Women's 100m heats underway at Scotstoun.", stat: 'AI: 34% JAM gold' },
            { tag: 'Swimming — Live',   body: "Men's 100m Freestyle final, Tollcross.",   stat: 'AI: 57% AUS 2+' },
            { tag: 'Cycling — 16:00',  body: 'Team Sprint qualifying, Sir Chris Hoy Velodrome.', stat: 'AI: 29% SCO medal' },
            { tag: 'Markets — Today',  body: '14 open, 3 resolved since midnight.', stat: '184.20 USDT in fees.' },
          ].map(({ tag, body, stat }) => (
            <div className="wire-item" key={tag}>
              <span className="tag">{tag}</span><br />
              {body} <span className="stat">{stat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Method steps */}
      <div className="method" id="method">
        <h3>How the Wire Is Filed</h3>
        <div className="steps">
          {[
            { n: '01', h: 'Ingest',  p: "Agent reads the day's schedule — venue, session, medal event — the moment it's confirmed." },
            { n: '02', h: 'Price',   p: 'Weighs season form, head-to-head history, and injury reports into a probability and confidence score.' },
            { n: '03', h: 'Publish', p: 'Market goes live with full reasoning attached — no black box, no unexplained line.' },
            { n: '04', h: 'Settle',  p: 'When the official result posts, the agent resolves the market on X Layer and pays out automatically.' },
          ].map(({ n, h, p }) => (
            <div className="step" key={n}>
              <div className="n">{n}</div>
              <h4>{h}</h4>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Odds sample */}
      <div className="odds-sample">
        <h3>This Morning's Line</h3>
        <table className="box hard-shadow">
          <thead>
            <tr>
              <th>Sport</th><th>Market</th><th>AI %</th><th>Confidence</th><th>Market Line</th><th>Closes</th>
            </tr>
          </thead>
          <tbody>
            {[
              { sport: 'Athletics',    q: "Jamaica gold, Women's 100m",             ai: '34%', conf: '71%', line: '38%', close: '6h',  tab: 'dispatch' as AppTab },
              { sport: 'Swimming',     q: 'Australia, 2+ golds Day 2',              ai: '57%', conf: '82%', line: '50%', close: '3h',  tab: 'markets'  as AppTab },
              { sport: 'Boxing',       q: 'India, 3+ finals reached',               ai: '41%', conf: '68%', line: '45%', close: '1d',  tab: 'markets'  as AppTab },
              { sport: 'Netball',      q: 'Nigeria to beat Australia, group stage', ai: '22%', conf: '74%', line: '20%', close: '1d',  tab: 'markets'  as AppTab },
              { sport: 'Weightlifting',q: 'Over/Under 8 total medals, Nigeria',     ai: '61%', conf: '77%', line: '55%', close: '9d',  tab: 'markets'  as AppTab },
            ].map(row => (
              <tr key={row.q} style={{ cursor: 'pointer' }} onClick={() => onNavigate(row.tab)}>
                <td>{row.sport}</td>
                <td className="q">{row.q}</td>
                <td className="ai">{row.ai}</td>
                <td><span className="confidence-badge">{row.conf}</span></td>
                <td>{row.line}</td>
                <td>{row.close}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sections */}
      <div className="sections" id="sections">
        {[
          { num: 'Section A', h: 'Finance Copilot',  p: "Every market ships with a probability, confidence score, and three signals — read like a copilot's memo, not a slot machine.", stamp: 'A2MCP · Free Tier' },
          { num: 'Section B', h: 'Creative Genius',  p: 'Ask for a "Nigeria medal bundle" or "Jamaican sprint dominance" and the agent composes a market that\'s never existed on any book before.', stamp: 'Bundle Markets' },
          { num: 'Section C', h: 'Revenue Rocket',   p: 'A 2% resolution fee is collected on every settled market — visible, live, on the ledger page. No slide-deck revenue, only recorded revenue.', stamp: 'x402 · Escrow on X Layer' },
        ].map(({ num, h, p, stamp }) => (
          <div className="section" key={num}>
            <div className="num">{num}</div>
            <h3>{h}</h3>
            <p>{p}</p>
            <span className="stamp">{stamp}</span>
          </div>
        ))}
      </div>
    </>
  );
}
