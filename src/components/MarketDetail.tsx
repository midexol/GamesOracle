import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BettingCoupon from './BettingCoupon';
import type { Market, LedgerPosition } from '../types';

const defaultMarket: Market = {
  id:         'default-1',
  sport:      'Athletics',
  title:      "Will a Jamaican sprinter take gold in the Women's 100m?",
  prob:       34,
  line:       38,
  vol:        '1,204',
  close:      '6h',
  confidence: 71,
  reasoning:  "Jamaica arrives at Scotstoun Stadium with two of the season's four fastest women over 100 metres, but a shallow head-to-head record against the field's form leader keeps the line closer than the roster alone would suggest. Sixty percent of the model's weight sits on 2025–26 season-best times, which favour Jamaica narrowly. Twenty-five percent comes from head-to-head record across the last three major championships, where the field leader holds a 3–1 edge. The remaining fifteen percent reflects this week's injury and fitness reporting, which is clean for all three medal contenders. Confidence sits at 71%.",
};

interface MarketDetailProps {
  selectedMarket: Market | null;
  onAddPosition:  (pos: LedgerPosition) => void;
}

export default function MarketDetail({ selectedMarket, onAddPosition }: MarketDetailProps): React.ReactElement {
  const market = selectedMarket ?? defaultMarket;
  const [railReady, setRailReady] = useState(false);

  // Small delay so the animated rail transition is visible
  useEffect(() => {
    setRailReady(false);
    const t = setTimeout(() => setRailReady(true), 100);
    return () => clearTimeout(t);
  }, [market.id]);

  const gap       = Math.abs(market.prob - market.line);
  const direction = market.prob > market.line ? 'above' : 'below';
  const isEdge    = gap >= 5;

  return (
    <div className="article">
      <div className="eyebrow">{market.sport} · Markets</div>
      <h2 className="headline display">{market.title}</h2>
      <div className="byline">
        Filed by GamesOracle AI — Glasgow Bureau · Closes in {market.close} · Vol. {market.vol} USDT
        &nbsp;&nbsp;
        <span className="confidence-badge">{market.confidence}% confidence</span>
      </div>

      <p className="lede">
        {market.reasoning
          ? `${market.reasoning.split('.')[0]}.`
          : "This market is open and active on the wire. Read the analysis and signals below."}
      </p>

      <div className="pullquote">
        "{market.prob}% probability, {market.confidence}% confidence — priced on season bests, head-to-head history, and fitness reports."
        <span>— GamesOracle AI, reasoning summary</span>
      </div>

      <div className="grid2">
        <div className="body-text">
          <p>
            The market prices this event at <strong>{market.prob}%</strong>, against a bookmaker consensus
            line of <strong>{market.line}%</strong> — a <strong>{gap}-point gap</strong>{' '}
            {isEdge
              ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>flagged as a meaningful edge {direction} the market</span>
              : `(${direction} the market consensus)`
            }.
          </p>
          <p>{market.reasoning ?? "Sixty percent of the model's weight sits on 2025–26 season-best times. Twenty-five percent comes from head-to-head record. The remaining fifteen percent reflects injury and fitness reporting."}</p>
        </div>

        {/* Signals box */}
        <div className="inputs-box hard-shadow-sm">
          <h4>Signals Used</h4>
          <div className="input-row">
            <span>Season-best times</span>    <span className="w">60%</span>
          </div>
          <div className="input-row">
            <span>Head-to-head record</span>  <span className="w">25%</span>
          </div>
          <div className="input-row">
            <span>Fitness / injury reports</span><span className="w">15%</span>
          </div>
          <div className="input-row">
            <span>Resolution source</span>    <span className="w">CGF feed</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--rule)', margin: '10px 0' }} />
          <div className="input-row">
            <span>AI probability</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: 'var(--purple)' }}>
              {market.prob}%
            </span>
          </div>
          <div className="input-row">
            <span>Market line</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, color: 'var(--red)' }}>
              {market.line}%
            </span>
          </div>
          <div className="input-row">
            <span>Edge</span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700,
              color: isEdge ? 'var(--green)' : 'var(--muted)' }}>
              {isEdge ? `▲ +${gap}pp` : `${gap}pp`}
            </span>
          </div>
        </div>
      </div>

      {/* Animated confidence rail (large version) */}
      <div className="rail-big">
        <motion.div
          className="rail-fill"
          style={{ position: 'absolute', top: 0, left: 0, bottom: 0, background: 'var(--purple)' }}
          initial={{ width: 0 }}
          animate={{ width: railReady ? `${market.prob}%` : 0 }}
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
        >
          <span className="rail-label">AI {market.prob}%</span>
        </motion.div>
        <div className="rail-tick" style={{ left: `${market.line}%` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono',monospace", fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
        <span>0%</span>
        <span style={{ color: 'var(--red)' }}>Line {market.line}%</span>
        <span>100%</span>
      </div>

      {/* Betting Coupon */}
      <BettingCoupon market={market} onAddPosition={onAddPosition} />

      <div className="sources">
        <span>Resolution source:</span> Commonwealth Games Federation official results feed · Escrow: X Layer testnet
      </div>
    </div>
  );
}
