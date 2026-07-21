import React from 'react';
import { ShieldCheck, ShieldAlert, Coins } from 'lucide-react';
import type { ResolvedMarket } from '../types';

const SETTLED_VERDICTS: ResolvedMarket[] = [
  {
    id: 'res-1',
    sport: 'Swimming',
    title: "Australia, 2+ golds Day 2",
    aiProb: 57,
    consensusLine: 50,
    outcome: 'YES',
    payoutPool: '2,400 USDT',
    date: '24 July 2026',
    postMortem: "AI forecast of 57% was strongly validated as Australia dominated Tollcross Day 2 events. Team relay dynamics converted and individual freestyle depths matched our model's baseline form ratings.",
  },
  {
    id: 'res-2',
    sport: 'Cycling',
    title: "Scotland medal, Team Sprint",
    aiProb: 29,
    consensusLine: 40,
    outcome: 'NO',
    payoutPool: '1,850 USDT',
    date: '24 July 2026',
    postMortem: "Home velodrome crowd premium was heavily discounted in our signals, which favored Australia and England on raw season velocities. Scotland finished 4th in qualifying, validating the AI's caution.",
  },
  {
    id: 'res-3',
    sport: 'Netball',
    title: "Nigeria to beat Australia, group stage",
    aiProb: 22,
    consensusLine: 20,
    outcome: 'NO',
    payoutPool: '3,200 USDT',
    date: '25 July 2026',
    postMortem: "Nigeria's physical match parameters showed excellent speed, but tactical team turnover rates remained high. Australia claimed a comfortable group win, matching our low-probability benchmark.",
  },
  {
    id: 'res-4',
    sport: 'Athletics',
    title: "Jamaica gold, Women's 100m Heats",
    aiProb: 34,
    consensusLine: 38,
    outcome: 'NO',
    payoutPool: '2,100 USDT',
    date: '25 July 2026',
    postMortem: "A late-stage fitness alert in final practice lowered Jamaica's predicted gold share below the market consensus. Jamaica finished outside the gold bracket, confirming our model's downward calibration.",
  },
];

export default function Verdicts(): React.ReactElement {
  return (
    <div className="wrap fade-in" style={{ paddingBottom: '80px' }}>
      <div className="col-head">
        <h2>The Verdict Column</h2>
        <span className="sub">FINAL RESOLVED EDITIONS</span>
      </div>

      <div style={{ fontSize: '14px', margin: '10px 0 24px', fontStyle: 'italic', color: 'var(--muted)' }}>
        A transparent record of settled oracle lines. Unlike traditional books, GamesOracle 
        discloses its post-mortem reasoning for both hits and misses, establishing auditable calibration 
        for model adjustments.
      </div>

      <div className="whitepaper-grid" style={{ gridTemplateColumns: '1fr' }}>
        {SETTLED_VERDICTS.map((verdict) => {
          const wasCorrect = (verdict.aiProb >= 50 && verdict.outcome === 'YES') || 
                             (verdict.aiProb < 50 && verdict.outcome === 'NO');

          return (
            <div key={verdict.id} className="side-card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--ink)', background: 'var(--paper-2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {verdict.sport} · Resolved {verdict.date}
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontWeight: 600,
                  padding: '4px 8px',
                  backgroundColor: wasCorrect ? 'var(--purple-light)' : 'rgba(200, 28, 28, 0.1)',
                  color: wasCorrect ? 'var(--purple)' : 'var(--red)',
                  border: `1px solid ${wasCorrect ? 'var(--purple)' : 'var(--red)'}`
                }}>
                  {wasCorrect ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                  {wasCorrect ? 'AI HIT' : 'AI MISS'}
                </span>
              </div>

              <h3 className="display" style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: 700 }}>
                {verdict.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', margin: '14px 0', padding: '12px 0', borderTop: '1px dashed var(--rule)', borderBottom: '1px dashed var(--rule)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>AI Forecast</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '14px' }}>{verdict.aiProb}% YES</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>Consensus Line</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '14px' }}>{verdict.consensusLine}% YES</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>Official Result</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '14px', color: 'var(--purple)' }}>{verdict.outcome}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', display: 'block' }}>Escrow Pool</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Coins size={12} /> {verdict.payoutPool}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', lineHeight: '1.6', background: 'var(--paper)', padding: '14px', borderLeft: '3px solid var(--purple)' }}>
                <strong>Post-Mortem:</strong> {verdict.postMortem}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
