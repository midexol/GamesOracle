import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors } from 'lucide-react';
import clsx from 'clsx';
import confetti from 'canvas-confetti';
import { useEscrow } from '../contracts/GamesOracleEscrow';
import { X_LAYER_EXPLORER } from '../contracts/GamesOracleEscrow';
import type { Market, LedgerPosition } from '../types';

interface BettingCouponProps {
  market:        Market;
  onAddPosition: (pos: LedgerPosition) => void;
}

const STAKE_OPTIONS = [5, 20, 50] as const;
type StakeOption = typeof STAKE_OPTIONS[number];

interface BetResult {
  side:   'YES' | 'NO';
  stake:  number;
  txHash: string;
}

export default function BettingCoupon({ market, onAddPosition }: BettingCouponProps): React.ReactElement {
  const { stake } = useEscrow();
  const [selectedStake, setSelectedStake] = useState<StakeOption>(20);
  const [betResult,     setBetResult]     = useState<BetResult | null>(null);
  const [isLoading,     setIsLoading]     = useState(false);

  // Reset coupon when market changes
  useEffect(() => {
    setBetResult(null);
    setSelectedStake(20);
  }, [market.id]);

  const handlePlaceBet = async (side: 'YES' | 'NO') => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await stake(market.id, side, selectedStake);

      onAddPosition({
        sport:       market.sport,
        marketTitle: market.title,
        side,
        staked:      `${selectedStake} USDT`,
        status:      'Awaiting result',
        txHash:      result.txHash,
      });

      setBetResult({ side, stake: selectedStake, txHash: result.txHash });

      // 🎊 Confetti only on YES bets
      if (side === 'YES') {
        confetti({
          particleCount: 130,
          spread: 72,
          origin: { y: 0.62 },
          colors: ['#9B6BFF', '#111111', '#C81C1C', '#F7F5F0', '#2F6B3A'],
          ticks: 220,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="coupon hard-shadow"
      initial={{ opacity: 0, scale: 0.97, y: 8 }}
      animate={{ opacity: 1, scale: 1,    y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Scissors icon on dashed border */}
      <div className="coupon-scissors">
        <Scissors size={14} />
      </div>

      <h4>Clip &amp; Stake</h4>

      {/* Stake preset buttons */}
      <div className="stake-row">
        {STAKE_OPTIONS.map(value => (
          <motion.button
            key={value}
            className={clsx('stake-btn', { 'sel': selectedStake === value })}
            onClick={() => { setSelectedStake(value); setBetResult(null); }}
            whileTap={{ scale: 0.95, y: 1 }}
            disabled={isLoading}
          >
            {value} USDT
          </motion.button>
        ))}
      </div>

      {/* YES / NO buttons */}
      <motion.button
        className={clsx('side-btn', 'yes', { 'loading': isLoading })}
        onClick={() => handlePlaceBet('YES')}
        whileTap={{ scale: 0.98, y: 2 }}
        disabled={isLoading}
        style={{ marginBottom: '8px' }}
      >
        {isLoading ? 'Filing…' : `▲ Back YES — ${selectedStake} USDT`}
      </motion.button>

      <motion.button
        className={clsx('side-btn', 'no', { 'loading': isLoading })}
        onClick={() => handlePlaceBet('NO')}
        whileTap={{ scale: 0.98, y: 2 }}
        disabled={isLoading}
      >
        {isLoading ? 'Filing…' : `▼ Back NO / Field — ${selectedStake} USDT`}
      </motion.button>

      <div className="coupon-payout-explainer">
        Locked in escrow. If your side wins, you're paid automatically in USDT straight to your connected wallet when the result is confirmed — no claim step required.
      </div>

      {/* Result / status area */}
      <AnimatePresence mode="wait">
        {betResult ? (
          <motion.div
            key="result"
            className={clsx('bet-toast', { 'no-bet': betResult.side === 'NO' })}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              {betResult.side === 'YES' ? '▲' : '▼'} Position locked —{' '}
              <strong>{betResult.side}</strong> · {betResult.stake} USDT
            </div>
            <div className="tx">
              <a
                href={`${X_LAYER_EXPLORER}${betResult.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit' }}
              >
                TX: {betResult.txHash.slice(0, 18)}…{betResult.txHash.slice(-6)}
              </a>
              &nbsp;· X Layer Testnet
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="fine"
            className="fine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Settled on-chain via X Layer escrow · 2% resolution fee applies
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
