import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { TrendingUp, TrendingDown, Trophy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEscrow, X_LAYER_EXPLORER } from '../contracts/GamesOracleEscrow';
import type { LedgerPosition } from '../types';

interface LedgerProps {
  ledger:       LedgerPosition[];
  platformFees: number;
}

// Animate a number from 0 to target on mount
function useCountUp(target: number, duration = 900): number {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(target * ease));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [target, duration]);

  return value;
}

export default function Ledger({ ledger, platformFees }: LedgerProps): React.ReactElement {
  const { claimPayout } = useEscrow();
  const [claimedIds,  setClaimedIds]  = useState<Set<number>>(new Set());
  const [claimTxMap,  setClaimTxMap]  = useState<Record<number, string>>({});

  const openPositions  = ledger.filter(i => i.status === 'Awaiting result');
  const resolvedHistory = ledger.filter(i => i.status !== 'Awaiting result');

  const netPnl      = resolvedHistory.reduce((s, i) => s + (parseFloat(i.pnl ?? '0') || 0), 0);
  const wonCount    = resolvedHistory.filter(i => i.status === 'won').length;
  const winRate     = resolvedHistory.length > 0 ? Math.round((wonCount / resolvedHistory.length) * 100) : 58;

  const animOpen    = useCountUp(openPositions.length, 600);
  const animWin     = useCountUp(winRate, 900);

  const handleClaim = async (idx: number, item: LedgerPosition) => {
    const res = await claimPayout(item.marketTitle);
    setClaimedIds(prev => new Set(prev).add(idx));
    setClaimTxMap(prev => ({ ...prev, [idx]: res.txHash }));

    confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#9B6BFF', '#2F6B3A', '#F7F5F0', '#111111', '#C81C1C'],
      ticks: 260,
    });
  };

  const rowVariants: Variants = {
    hidden:  { opacity: 0, x: 10 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { duration: 0.24, delay: i * 0.04, ease: [0.4,0,0.2,1] as [number,number,number,number] },
    }),
  };

  return (
    <div className="wrap">
      {/* ── Stat blocks ──────────────────────────────────── */}
      <div className="masthead-stat">
        <div className="stat-block">
          <div className="label">Open Positions</div>
          <div className="num">{animOpen}</div>
        </div>
        <div className="stat-block">
          <div className="label">Net P&amp;L (30d)</div>
          <div className={`num ${netPnl >= 0 ? 'green' : 'red'}`}>
            {netPnl >= 0
              ? <><TrendingUp size={22} style={{ verticalAlign: 'middle', marginRight: 4 }} />+{netPnl.toFixed(2)}</>
              : <><TrendingDown size={22} style={{ verticalAlign: 'middle', marginRight: 4 }} />{netPnl.toFixed(2)}</>
            }
          </div>
        </div>
        <div className="stat-block">
          <div className="label">Win Rate</div>
          <div className="num">
            <Trophy size={22} style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--purple)' }} />
            {animWin}%
          </div>
        </div>
      </div>
      {/* ── Explainer Strip ──────────────────────────────── */}
      <div className="ledger-explainer-strip">
        <div className="ledger-explainer-item">
          <h5><span>◈</span> Open</h5>
          <p>Your stake is locked inside the X Layer escrow contract. Staking pools await final event confirmation.</p>
        </div>
        <div className="ledger-explainer-item">
          <h5><span style={{ color: 'var(--green)' }}>◈</span> Won</h5>
          <p>Payout (winning share + your stake) has been sent automatically to your connected wallet. No claim forms required.</p>
        </div>
        <div className="ledger-explainer-item">
          <h5><span style={{ color: 'var(--red)' }}>◈</span> Lost</h5>
          <p>Your stake has been distributed to the winning pool as payouts (no house cuts, peer-to-peer liquidity).</p>
        </div>
      </div>

      {/* ── Open Positions ───────────────────────────────── */}
      <div className="col-head">
        <h2>Open Positions</h2>
        <span className="sub">{openPositions.length} ACTIVE</span>
      </div>
      <div className="table-responsive">
        <table className="ledger">
          <thead>
            <tr>
              <th>Sport</th><th>Market</th><th>Side</th><th>Staked</th><th>Status</th>
            </tr>
          </thead>
          <motion.tbody initial="hidden" animate="visible">
            {openPositions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                  No active positions. Clip &amp; Stake on a Dispatch page to trade.
                </td>
              </tr>
            ) : openPositions.map((pos, i) => (
              <motion.tr key={i} custom={i} variants={rowVariants}>
                <td>{pos.sport}</td>
                <td className="q">{pos.marketTitle}</td>
                <td>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700,
                    color: pos.side === 'YES' ? 'var(--green)' : 'var(--red)' }}>
                    {pos.side === 'YES' ? '▲' : '▼'} {pos.side}
                  </span>
                </td>
                <td>{pos.staked}</td>
                <td className="status open">Awaiting result</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* ── Resolved History ─────────────────────────────── */}
      <div className="col-head">
        <h2>Resolved History</h2>
        <span className="sub">LAST 30 DAYS</span>
      </div>
      <div className="table-responsive">
        <table className="ledger">
          <thead>
            <tr>
              <th>Sport</th><th>Market</th><th>Side</th><th>Staked</th>
              <th>Result</th><th>P&amp;L</th><th>Chain</th><th></th>
            </tr>
          </thead>
          <motion.tbody initial="hidden" animate="visible">
            {resolvedHistory.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                  No resolved history yet.
                </td>
              </tr>
            ) : resolvedHistory.map((hist, i) => {
              const pnlNum  = parseFloat(hist.pnl ?? '0');
              const claimed = claimedIds.has(i);
              const claimTx = claimTxMap[i];

              return (
                <motion.tr key={i} custom={i} variants={rowVariants}>
                  <td>{hist.sport}</td>
                  <td className="q">{hist.marketTitle}</td>
                  <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{hist.side}</td>
                  <td>{hist.staked}</td>
                  <td className={`status ${hist.status}`}>{hist.result}</td>
                  <td className={`pnl ${pnlNum >= 0 ? 'pos' : 'neg'}`}>
                    {pnlNum >= 0 ? `+${pnlNum.toFixed(2)}` : pnlNum.toFixed(2)}
                  </td>
                  <td>
                    <span className="chain-badge">
                      X Layer
                    </span>
                  </td>
                  <td>
                    <AnimatePresence mode="wait">
                      {hist.status === 'won' && !claimed ? (
                        <motion.button
                          key="claim"
                          className="claim-btn"
                          onClick={() => handleClaim(i, hist)}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          Claim
                        </motion.button>
                      ) : claimed ? (
                        <motion.a
                          key="tx"
                          href={`${X_LAYER_EXPLORER}${claimTx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chain-badge"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          title={claimTx}
                          style={{ cursor: 'pointer' }}
                        >
                          <ExternalLink size={8} style={{ marginRight: 2 }} />
                          Claimed
                        </motion.a>
                      ) : null}
                    </AnimatePresence>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>

      {/* ── Fee Strip ────────────────────────────────────── */}
      <div className="fee-strip">
        <div className="left">
          <h4>◈ Platform Fee Circulation</h4>
          <div className="desc">
            2% resolution fee collected automatically by the X Layer escrow contract on every settled market.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="num">{platformFees.toFixed(2)}</div>
          <div className="unit-label">USDT · X Layer Escrow</div>
        </div>
      </div>
    </div>
  );
}
