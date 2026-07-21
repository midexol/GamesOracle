import React, { useState, useEffect } from 'react';

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState('sec-abstract');

  const sectionsList = [
    { id: 'sec-abstract', label: '1. Abstract' },
    { id: 'sec-problem', label: '2. Problem Statement' },
    { id: 'sec-solution', label: '3. Solution Overview' },
    { id: 'sec-howitworks', label: '4. How It Works' },
    { id: 'sec-architecture', label: '5. System Architecture' },
    { id: 'sec-contracts', label: '6. Smart Contract Design' },
    { id: 'sec-fees', label: '7. Fee Model' },
    { id: 'sec-asp', label: '8. ASP Integration' },
    { id: 'sec-roadmap', label: '9. Roadmap' },
    { id: 'sec-risks', label: '10. Risks & Open Questions' },
    { id: 'sec-conclusion', label: '11. Conclusion' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-15% 0px -55% 0px', // trigger when section occupies middle-top of screen
        threshold: 0
      }
    );

    sectionsList.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sectionsList.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -20; // small padding from the top
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="wrap" style={{ maxWidth: '1180px', padding: '40px 32px 80px' }}>
      
      {/* Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', borderBottom: '2px solid var(--ink)', paddingBottom: '30px' }}>
        <div className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--red)', marginBottom: '10px', fontWeight: '600' }}>
          Whitepaper — v0.1 (Working Draft)
        </div>
        <h1 className="display" style={{ fontSize: '48px', margin: '0 0 10px', fontWeight: '900', letterSpacing: '-1px' }}>
          GAMESORACLE AI
        </h1>
        <p className="display" style={{ fontSize: '18px', fontStyle: 'italic', color: 'var(--muted)', margin: '0 0 24px' }}>
          An AI Oracle Agent for Real-Time Sports Prediction Markets
        </p>
        
        <div className="mono" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', borderTop: '1px solid var(--rule)', paddingTop: '20px', textAlign: 'left' }}>
          <div>
            <span style={{ color: 'var(--muted)' }}>Track:</span> ASP Hackathon
          </div>
          <div>
            <span style={{ color: 'var(--muted)' }}>Chain:</span> X Layer (EVM)
          </div>
          <div>
            <span style={{ color: 'var(--muted)' }}>Author:</span> Mide
          </div>
          <div>
            <span style={{ color: 'var(--muted)' }}>Date:</span> July 2026
          </div>
          <div>
            <span style={{ color: 'var(--muted)' }}>Categories:</span> Copilot / Genius
          </div>
          <div>
            <span style={{ color: 'var(--muted)' }}>Status:</span> Draft
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Document */}
      <div className="whitepaper-grid">
        
        {/* Sticky Sidebar Navigation (TOC) */}
        <aside className="whitepaper-sidebar">
          <div className="whitepaper-sticky">
            <h4 className="mono" style={{ margin: '0 0 16px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--ink)', paddingBottom: '6px' }}>
              Document Map
            </h4>
            <ul className="mono" style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sectionsList.map(({ id, label }) => {
                const isActive = activeSection === id;
                return (
                  <li key={id} style={{ transition: 'all 0.15s ease' }}>
                    <a
                      onClick={() => scrollToSection(id)}
                      style={{
                        cursor: 'pointer',
                        display: 'block',
                        color: isActive ? 'var(--red)' : 'var(--muted)',
                        fontWeight: isActive ? '700' : '400',
                        borderLeft: isActive ? '2px solid var(--red)' : '2px solid transparent',
                        paddingLeft: isActive ? '10px' : '6px',
                        marginLeft: isActive ? '-2px' : '0px',
                        textDecoration: 'none'
                      }}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Scrollable Document Content */}
        <article className="body-text" style={{ fontSize: '15.5px', lineHeight: '1.85', textAlign: 'justify', color: '#2B2B2B' }}>
          
          {/* Section 1 */}
          <section id="sec-abstract" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '0', color: 'var(--ink)' }}>
              1. Abstract
            </h3>
            <p>
              GamesOracle AI is an autonomous agent that reads live sporting event schedules, drafts prediction markets, prices them with an explainable confidence score, and settles them on-chain the moment an official result is published. It is built as an Agent Service Provider (ASP) on OKX.AI, reachable by both human users through a dashboard and other autonomous agents through a standardized Agent-to-MCP interface. The initial deployment is scoped to the Glasgow 2026 Commonwealth Games (23 July – 2 August 2026), chosen because its ten-sport, eleven-day schedule offers a dense, verifiable, and time-boxed proving ground for the underlying architecture, which is not itself specific to any one event.
            </p>
            <p>
              Unlike existing prediction markets, which typically present a price with no visible reasoning, GamesOracle AI publishes the inputs behind every probability it assigns — season form, head-to-head history, and injury or fitness reporting — alongside a confidence score that reflects data completeness rather than the model's certainty alone. Settlement occurs through a minimal escrow smart contract on X Layer, with the agent itself acting as the resolving oracle for verified outcomes.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-problem" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              2. Problem Statement
            </h3>
            <p>
              Prediction markets for major single events — a World Cup final, a presidential election — are well served. Markets for niche, multi-event competitions are not. Commonwealth Games–scale events span dozens of disciplines and hundreds of individual sessions, most of which no bookmaker prices in any depth, and none of which come with a stated rationale for the number shown.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              2.1 Gaps in the current landscape
            </h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Odds are presented without reasoning:</strong> A number with no visible inputs, offering no way to evaluate whether it is well-calibrated.</li>
              <li><strong>Settlement is manual and slow:</strong> Dependent on centralized bookmakers or exchanges rather than a transparent, on-chain resolution process.</li>
              <li><strong>No machine-readable interface exists:</strong> Other software agents cannot consume structured sports forecasts—a gap that matters increasingly as agent-to-agent commerce grows.</li>
              <li><strong>Niche and regional interest is underserved:</strong> Existing platforms concentrate liquidity on a small number of headline markets, completely ignoring country-level specific interest.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sec-solution" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              3. Solution Overview
            </h3>
            <p>
              GamesOracle AI closes these gaps with four components acting in sequence: event ingestion, AI-driven market creation and pricing, on-chain settlement, and an ASP interface that exposes the whole pipeline to both people and other agents.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              3.1 Design principles
            </h4>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Reasoning is a first-class output:</strong> Every single price updates alongside the logical weights and parameters that generated it.</li>
              <li><strong>No direct custody:</strong> The agent never custodies funds directly; all value transfer happens through an auditable escrow contract, so a pricing error cannot become a solvency error.</li>
              <li><strong>Ambiguity defaults to pausing:</strong> A disputed result halts payout rather than forcing a resolution.</li>
              <li><strong>Event-agnostic architecture:</strong> The Commonwealth Games 2026 is the launch dataset, not a hard constraint.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="sec-howitworks" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              4. How It Works
            </h3>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              4.1 Event discovery and market creation
            </h4>
            <p>
              The agent ingests the competition schedule — venue, session, discipline, and medal status — and drafts markets automatically for high-interest sessions, or on request through natural language ("create a market for the Nigeria medal bundle"). Each market is defined by a question, a close time, and a resolution source.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              4.2 Oracle and data aggregation
            </h4>
            <p>
              Pricing draws on multiple weighted signals: recent season form, head-to-head history between the specific competitors or nations involved, and current injury or fitness reporting. The relative weighting is disclosed per market rather than hidden inside a single opaque model call.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              4.3 Confidence scoring
            </h4>
            <p>
              Confidence is distinct from probability. Probability answers "how likely is this outcome"; confidence answers "how much do we trust this estimate," as a function of data completeness, the historical variance typical of that discipline, and time remaining until the field is finalized. A market with a late-confirmed start list carries a lower confidence score even if its central probability estimate is unchanged.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              4.4 On-chain settlement
            </h4>
            <p>
              When a scheduled event concludes and an official result is published, the agent, acting as the designated oracle address for that market, calls the resolution function on the escrow contract. Staked funds are distributed to the winning side less a platform fee; disputed or ambiguous results are flagged and payout is withheld pending manual review rather than forced through automatically.
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-architecture" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              5. System Architecture
            </h3>
            <p>
              The system is organized into five layers, each independently testable and replaceable:
            </p>

            <table className="box" style={{ margin: '20px 0', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ width: '150px' }}>Layer</th>
                  <th>Responsibility</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Agent Brain</td>
                  <td>Intent parsing, market copy generation, forecast reasoning (Claude, tool-use)</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Data Aggregation</td>
                  <td>Schedule and results ingestion, historical statistics, sentiment (stretch)</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Oracle Resolution</td>
                  <td>Result verification, confidence scoring, dispute flagging</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Market State Store</td>
                  <td>Persisted markets, forecasts, positions, and fee ledger</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Settlement Layer</td>
                  <td>X Layer escrow contract — stake, resolve, claim</td>
                </tr>
              </tbody>
            </table>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', marginBottom: '20px' }}>
              Table 1 — System layers and responsibilities.
            </div>

            <p>
              The agent brain never calls the settlement layer directly with unaudited output; all resolution calls pass through the oracle resolution layer, which enforces the single-source-of-truth rule described in Section 4.4.
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-contracts" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              6. Smart Contract Design
            </h3>
            <p>
              Settlement uses a deliberately minimal escrow contract on X Layer rather than a full automated market maker, prioritizing auditability over capital efficiency at this stage. Core functions:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><code className="mono">createMarket(marketId, question, closeTime, oracle)</code> — registers a new market and its designated resolver address.</li>
              <li><code className="mono">stake(marketId, side)</code> — accepts a stake on either outcome before the close time.</li>
              <li><code className="mono">resolveMarket(marketId, outcome)</code> — callable only by the designated oracle address, settles the outcome once.</li>
              <li><code className="mono">claimPayout(marketId)</code> — distributes the winning pool, less a platform fee, proportional to each participant's stake.</li>
            </ul>
            <p>
              Production deployment requires a reentrancy guard on <code className="mono">claimPayout</code> and a multi-signature or multi-oracle fallback for high-value markets — both scoped as near-term hardening work rather than shipped in the initial version, and should not be treated as production-ready until added.
            </p>
          </section>

          {/* Section 7 */}
          <section id="sec-fees" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              7. Fee Model and Monetization
            </h3>
            <p>
              GamesOracle AI models value capture across several channels:
            </p>

            <table className="box" style={{ margin: '20px 0', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Revenue stream</th>
                  <th>Mechanism</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Resolution fee</td>
                  <td>2% of the total staked pool, collected automatically on settlement</td>
                  <td style={{ color: 'var(--green)', fontWeight: '600' }}>Implemented</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Pay-per-call forecasts</td>
                  <td>x402 micropayment for premium, cited forecasts consumed by other agents</td>
                  <td>Planned</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Private/custom markets</td>
                  <td>Subscription tier for bespoke bundle markets</td>
                  <td>Roadmap</td>
                </tr>
                <tr>
                  <td className="mono" style={{ fontWeight: '600' }}>Revenue share</td>
                  <td>Share of resolution fees returned to a market's original creator</td>
                  <td>Roadmap</td>
                </tr>
              </tbody>
            </table>
            <div className="mono" style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', marginBottom: '20px' }}>
              Table 2 — Revenue mechanisms by implementation status.
            </div>
          </section>

          {/* Section 8 */}
          <section id="sec-asp" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              8. ASP Integration (OKX.AI)
            </h3>
            <p>
              GamesOracle AI is registered as an Agent Service Provider, initially through the Agent-to-MCP path: a standardized endpoint exposing <code className="mono">get_markets</code>, <code className="mono">get_forecast</code>, <code className="mono">create_market</code>, and <code className="mono">get_portfolio</code> as callable tools, with a free tier for auto-generated markets and an x402-metered tier for custom or deeply-cited forecasts. An Agent-to-Agent path, using an Agentic Wallet for negotiated and escrowed payment, is planned as a second integration once the MCP interface is stable.
            </p>
          </section>

          {/* Section 9 */}
          <section id="sec-roadmap" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              9. Roadmap
            </h3>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              9.1 Launch (hackathon scope)
            </h4>
            <p>
              Curated Commonwealth Games 2026 schedule, auto-generated markets, dashboard, chat-to-create, testnet escrow settlement.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              9.2 Near-term
            </h4>
            <p>
              Live results feed integration, reentrancy-hardened mainnet contract, x402 paid forecast tier, country medal-bundle markets.
            </p>
            <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)' }}>
              9.3 Longer-term
            </h4>
            <p>
              Event-agnostic expansion beyond sports, multi-oracle consensus and community dispute resolution, arbitrage detection against external books, portfolio-style automated bet diversification.
            </p>
          </section>

          {/* Section 10 */}
          <section id="sec-risks" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              10. Risks and Open Questions
            </h3>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Resolution-source reliability:</strong> No confirmed low-latency official results API has been secured at time of writing; near-term markets may rely on manually curated results.</li>
              <li><strong>Regulatory compliance:</strong> Prediction markets intersect gambling regulation in many jurisdictions; scope and geographic availability should be reviewed before any mainnet launch.</li>
              <li><strong>Naming options:</strong> "GamesOracle AI" is a working name pending a final branding decision.</li>
              <li><strong>Oracle centralization:</strong> The agent is currently the sole resolver for each market; a multi-oracle fallback is necessary before handling high-value volumes.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section id="sec-conclusion" style={{ marginBottom: '40px', scrollMarginTop: '20px' }}>
            <h3 className="display" style={{ fontSize: '22px', borderBottom: '1px solid var(--ink)', paddingBottom: '6px', marginTop: '30px', color: 'var(--ink)' }}>
              11. Conclusion
            </h3>
            <p>
              GamesOracle AI demonstrates that a prediction market can be both explainable and autonomous — pricing an event with visible reasoning, then settling it without manual intervention. The Glasgow 2026 Commonwealth Games deployment is a proving ground for an architecture intended to generalize well beyond a single competition, and beyond sports altogether.
            </p>
          </section>
        </article>
      </div>

      <div style={{ borderTop: '2px solid var(--ink)', marginTop: '40px', paddingTop: '20px', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center' }}>
        This document is a working draft prepared for hackathon submission. Figures, timelines, and contract code are illustrative and subject to change prior to any production deployment.
      </div>
    </div>
  );
}
