import React, { useState } from 'react';

interface Section { id: string; label: string; }

const SECTIONS: Section[] = [
  { id: 'sec-abstract',    label: '1. Abstract'            },
  { id: 'sec-problem',     label: '2. Problem Statement'   },
  { id: 'sec-solution',    label: '3. Solution Overview'   },
  { id: 'sec-howitworks',  label: '4. How It Works'        },
  { id: 'sec-architecture',label: '5. System Architecture' },
  { id: 'sec-contracts',   label: '6. Smart Contract Design'},
  { id: 'sec-fees',        label: '7. Fee Model'           },
  { id: 'sec-asp',         label: '8. ASP Integration'     },
  { id: 'sec-roadmap',     label: '9. Roadmap'             },
  { id: 'sec-risks',       label: '10. Risks & Open Questions'},
  { id: 'sec-conclusion',  label: '11. Conclusion'         },
];

const h3Style = { fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '0', color: 'var(--ink)' };
const h4Style = { fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' };

export default function Whitepaper() {
  const [activeIdx, setActiveIdx] = useState(0);

  const totalSections = SECTIONS.length;
  const progressPct = Math.round(((activeIdx + 1) / totalSections) * 100);

  const goToSection = (idx: number) => {
    if (idx >= 0 && idx < totalSections) {
      setActiveIdx(idx);
      window.scrollTo(0, 120);
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: '1180px', padding: '40px 32px 80px' }}>
      {/* Title header */}
      <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid var(--ink)', paddingBottom: '24px' }}>
        <div className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--purple)', marginBottom: '8px', fontWeight: '600' }}>
          Whitepaper - v0.1 (Working Draft)
        </div>
        <h1 className="display" style={{ fontSize: '40px', margin: '0 0 8px', fontWeight: '900', letterSpacing: '-1px' }}>
          GAMESORACLE AI
        </h1>
        <p className="display" style={{ fontSize: '16px', fontStyle: 'italic', color: 'var(--muted)', margin: '0 0 16px' }}>
          An AI Oracle Agent for Real-Time Sports Prediction Markets
        </p>

        {/* Reading Progress Indicator */}
        <div style={{ maxWidth: '450px', margin: '0 auto', background: 'var(--paper-2)', height: '6px', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--rule)' }}>
          <div
            style={{ height: '100%', background: 'var(--purple)', width: `${progressPct}%`, transition: 'width 0.3s ease-out' }}
          />
        </div>
        <div className="mono" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
          Section {activeIdx + 1} of {totalSections} ({progressPct}% Complete)
        </div>
      </div>

      <div className="whitepaper-grid">
        {/* Sticky sidebar TOC */}
        <aside className="whitepaper-sidebar">
          <div className="whitepaper-sticky">
            <h4 className="mono" style={{ margin: '0 0 14px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--ink)', paddingBottom: '6px' }}>
              Document Map
            </h4>
            <ul className="mono" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {SECTIONS.map(({ id, label }, idx) => {
                const active = activeIdx === idx;
                const isPast = idx < activeIdx;
                return (
                  <li key={id}>
                    <button
                      onClick={() => goToSection(idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        background: active ? 'var(--paper-2)' : 'transparent',
                        border: 'none',
                        borderLeft: active ? '3px solid var(--purple)' : '3px solid transparent',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        color: active ? 'var(--ink)' : isPast ? 'var(--purple)' : 'var(--muted)',
                        fontWeight: active ? '700' : '400',
                        fontFamily: 'inherit',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justify-content: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{label}</span>
                      {isPast && <span style={{ color: 'var(--purple)', fontWeight: 700 }}>✓</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Document content */}
        <article className="body-text" style={{ fontSize: '15.5px', lineHeight: '1.85', textAlign: 'justify', color: '#2B2B2B', minHeight: '380px' }}>

          <section id="sec-abstract" style={{ display: activeIdx === 0 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>1. Abstract</h3>
            <p>GamesOracle AI is an autonomous agent that reads live sporting event schedules, drafts prediction markets, prices them with an explainable confidence score, and settles them on-chain the moment an official result is published. It is built as an Agent Service Provider (ASP) on OKX.AI, reachable by both human users through a dashboard and other autonomous agents through a standardized Agent-to-MCP interface. The initial deployment is scoped to the Glasgow 2026 Commonwealth Games (23 July – 2 August 2026), chosen because its ten-sport, eleven-day schedule offers a dense, verifiable, and time-boxed proving ground for the underlying architecture.</p>
            <p>Unlike existing prediction markets, which typically present a price with no visible reasoning, GamesOracle AI publishes the inputs behind every probability it assigns (season form, head-to-head history, and injury or fitness reporting) alongside a confidence score that reflects data completeness rather than the model's certainty alone. Settlement occurs through a minimal escrow smart contract on X Layer, with the agent itself acting as the resolving oracle for verified outcomes.</p>
          </section>

          <section id="sec-problem" style={{ display: activeIdx === 1 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>2. Problem Statement</h3>
            <p>Prediction markets for major single events (a World Cup final, a presidential election) are well served. Markets for niche, multi-event competitions are not. Commonwealth Games–scale events span dozens of disciplines and hundreds of individual sessions, most of which no bookmaker prices in any depth, and none of which come with a stated rationale for the number shown.</p>
            <h4 className="mono" style={h4Style}>2.1 Gaps in the current landscape</h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Odds are presented without reasoning:</strong> A number with no visible inputs, offering no way to evaluate whether it is well-calibrated.</li>
              <li><strong>Settlement is manual and slow:</strong> Dependent on centralized bookmakers rather than a transparent, on-chain resolution process.</li>
              <li><strong>No machine-readable interface exists:</strong> Other software agents cannot consume structured sports forecasts, a gap that matters increasingly as agent-to-agent commerce grows.</li>
              <li><strong>Niche and regional interest is underserved:</strong> Existing platforms concentrate liquidity on a small number of headline markets, completely ignoring country-level specific interest.</li>
            </ul>
          </section>

          <section id="sec-solution" style={{ display: activeIdx === 2 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>3. Solution Overview</h3>
            <p>GamesOracle AI closes these gaps with four components acting in sequence: event ingestion, AI-driven market creation and pricing, on-chain settlement, and an ASP interface that exposes the whole pipeline to both people and other agents.</p>
            <h4 className="mono" style={h4Style}>3.1 Design principles</h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Reasoning is a first-class output:</strong> Every single price updates alongside the logical weights and parameters that generated it.</li>
              <li><strong>No direct custody:</strong> The agent never custodies funds directly; all value transfer happens through an auditable escrow contract.</li>
              <li><strong>Ambiguity defaults to pausing:</strong> A disputed result halts payout rather than forcing a resolution.</li>
              <li><strong>Event-agnostic architecture:</strong> The Commonwealth Games 2026 is the launch dataset, not a hard constraint.</li>
            </ul>
          </section>

          <section id="sec-howitworks" style={{ display: activeIdx === 3 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>4. How It Works</h3>
            <h4 className="mono" style={h4Style}>4.1 Event discovery and market creation</h4>
            <p>The agent ingests the competition schedule (venue, session, discipline, and medal status) and drafts markets automatically for high-interest sessions, or on request through natural language ("create a market for the Nigeria medal bundle"). Each market is defined by a question, a close time, and a resolution source.</p>
            <h4 className="mono" style={h4Style}>4.2 Oracle and data aggregation</h4>
            <p>Pricing draws on multiple weighted signals: recent season form, head-to-head history between the specific competitors or nations involved, and current injury or fitness reporting. The relative weighting is disclosed per market rather than hidden inside a single opaque model call.</p>
            <h4 className="mono" style={h4Style}>4.3 Confidence scoring</h4>
            <p>Confidence is distinct from probability. Probability answers "how likely is this outcome"; confidence answers "how much do we trust this estimate," as a function of data completeness, the historical variance typical of that discipline, and time remaining until the field is finalised. A market with a late-confirmed start list carries a lower confidence score even if its central probability estimate is unchanged.</p>
            <h4 className="mono" style={h4Style}>4.4 On-chain settlement</h4>
            <p>When a scheduled event concludes and an official result is published, the agent, acting as the designated oracle address for that market, calls the resolution function on the escrow contract. Staked funds are distributed to the winning side less a platform fee; disputed results are flagged and payout is withheld pending manual review.</p>
          </section>

          <section id="sec-architecture" style={{ display: activeIdx === 4 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>5. System Architecture</h3>
            <p>The system is organized into five layers, each independently testable and replaceable:</p>
            <div className="table-responsive">
              <table className="box" style={{ margin: '20px 0', fontSize: '12px' }}>
                <thead><tr><th style={{ width: '150px' }}>Layer</th><th>Responsibility</th></tr></thead>
                <tbody>
                  {[
                    ['Agent Brain',       'Intent parsing, market copy generation, forecast reasoning (LLM, tool-use)'],
                    ['Data Aggregation',  'Schedule and results ingestion, historical statistics, sentiment (stretch)'],
                    ['Oracle Resolution', 'Result verification, confidence scoring, dispute flagging'],
                    ['Market State Store','Persisted markets, forecasts, positions, and fee ledger'],
                    ['Settlement Layer',  'X Layer escrow contract (stake, resolve, claim)'],
                  ].map(([layer, resp]) => (
                    <tr key={layer}><td className="mono" style={{ fontWeight: '600' }}>{layer}</td><td>{resp}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', marginBottom: '20px' }}>Table 1: System layers and responsibilities.</div>
          </section>

          <section id="sec-contracts" style={{ display: activeIdx === 5 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>6. Smart Contract Design</h3>
            <p>Settlement uses a deliberately minimal escrow contract on X Layer rather than a full automated market maker, prioritizing auditability over capital efficiency at this stage. Core functions:</p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><code className="mono">createMarket(marketId, question, closeTime, oracle)</code> - registers a new market and its designated resolver address.</li>
              <li><code className="mono">stake(marketId, side)</code> - accepts a stake on either outcome before the close time.</li>
              <li><code className="mono">resolveMarket(marketId, outcome)</code> - callable only by the designated oracle address, settles the outcome once.</li>
              <li><code className="mono">claimPayout(marketId)</code> - distributes the winning pool, less a 2% platform fee, proportional to each participant's stake.</li>
            </ul>
          </section>

          <section id="sec-fees" style={{ display: activeIdx === 6 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>7. Fee Model and Monetization</h3>
            <p>GamesOracle AI models value capture across several channels:</p>
            <div className="table-responsive">
              <table className="box" style={{ margin: '20px 0', fontSize: '12px' }}>
                <thead><tr><th style={{ width: '180px' }}>Revenue stream</th><th>Mechanism</th><th>Status</th></tr></thead>
                <tbody>
                  {[
                    ['Resolution fee',         '2% of the total staked pool, collected automatically on settlement', 'Implemented', 'var(--green)'],
                    ['Pay-per-call forecasts',  'x402 micropayment for premium, cited forecasts consumed by other agents', 'Planned', 'var(--muted)'],
                    ['Private/custom markets',  'Subscription tier for bespoke bundle markets', 'Roadmap', 'var(--muted)'],
                    ['Revenue share',           "Share of resolution fees returned to a market's original creator", 'Roadmap', 'var(--muted)'],
                  ].map(([name, mech, status, color]) => (
                    <tr key={name}>
                      <td className="mono" style={{ fontWeight: '600' }}>{name}</td>
                      <td>{mech}</td>
                      <td style={{ color, fontWeight: '600' }}>{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', marginBottom: '20px' }}>Table 2: Revenue mechanisms by implementation status.</div>
          </section>

          <section id="sec-asp" style={{ display: activeIdx === 7 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>8. ASP Integration (OKX.AI)</h3>
            <p>GamesOracle AI is registered as an Agent Service Provider, initially through the Agent-to-MCP path: a standardized endpoint exposing <code className="mono">get_markets</code>, <code className="mono">get_forecast</code>, <code className="mono">create_market</code>, and <code className="mono">get_portfolio</code> as callable tools, with a free tier for auto-generated markets and an x402-metered tier for custom or deeply-cited forecasts.</p>
          </section>

          <section id="sec-roadmap" style={{ display: activeIdx === 8 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>9. Roadmap</h3>
            {[
              ['9.1 Launch (hackathon scope)', 'Curated Commonwealth Games 2026 schedule, auto-generated markets, dashboard, chat-to-create, testnet escrow settlement.'],
              ['9.2 Near-term', 'Live results feed integration, reentrancy-hardened mainnet contract, x402 paid forecast tier, country medal-bundle markets.'],
              ['9.3 Longer-term', 'Event-agnostic expansion beyond sports, multi-oracle consensus and community dispute resolution, arbitrage detection against external books.'],
            ].map(([heading, body]) => (
              <React.Fragment key={heading}>
                <h4 className="mono" style={h4Style}>{heading}</h4>
                <p>{body}</p>
              </React.Fragment>
            ))}
          </section>

          <section id="sec-risks" style={{ display: activeIdx === 9 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>10. Risks and Open Questions</h3>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Resolution-source reliability:</strong> No confirmed low-latency official results API has been secured at time of writing; near-term markets may rely on manually curated results.</li>
              <li><strong>Regulatory compliance:</strong> Prediction markets intersect gambling regulation in many jurisdictions; scope and geographic availability should be reviewed before any mainnet launch.</li>
              <li><strong>Oracle centralization:</strong> The agent is currently the sole resolver for each market; a multi-oracle fallback is necessary before handling high-value volumes.</li>
            </ul>
          </section>

          <section id="sec-conclusion" style={{ display: activeIdx === 10 ? 'block' : 'none', marginBottom: '40px' }}>
            <h3 className="display" style={h3Style}>11. Conclusion</h3>
            <p>GamesOracle AI demonstrates that a prediction market can be both explainable and autonomous: pricing an event with visible reasoning, then settling it without manual intervention. The Glasgow 2026 Commonwealth Games deployment is a proving ground for an architecture intended to generalize well beyond a single competition, and beyond sports altogether.</p>
          </section>

          {/* Section Pagination Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '2px solid var(--ink)' }}>
            <button
              onClick={() => goToSection(activeIdx - 1)}
              disabled={activeIdx === 0}
              className="wallet-btn hard-shadow-sm"
              style={{
                opacity: activeIdx === 0 ? 0.4 : 1,
                cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              ← Previous Section
            </button>

            <span className="mono" style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Section {activeIdx + 1} of {totalSections}
            </span>

            <button
              onClick={() => goToSection(activeIdx + 1)}
              disabled={activeIdx === totalSections - 1}
              className="wallet-btn hard-shadow-sm"
              style={{
                opacity: activeIdx === totalSections - 1 ? 0.4 : 1,
                cursor: activeIdx === totalSections - 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--purple)',
                color: '#FFF',
                borderColor: 'var(--ink)',
              }}
            >
              Next Section →
            </button>
          </div>
        </article>
      </div>

      <div style={{ borderTop: '2px solid var(--ink)', marginTop: '40px', paddingTop: '20px', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>
        This document is a working draft prepared for hackathon submission. Figures, timelines, and contract code are illustrative and subject to change prior to any production deployment.
      </div>
    </div>
  );
}
