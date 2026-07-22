import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DirectoryTable from './DirectoryTable';
import CableToOracle from './CableToOracle';
import type { Market, LedgerPosition } from '../types';

interface DashboardProps {
  markets:           Market[];
  setMarkets:        React.Dispatch<React.SetStateAction<Market[]>>;
  onNavigate:        (tab: string) => void;
  setSelectedMarket: (m: Market) => void;
  ledger:            LedgerPosition[];
  platformFees:      number;
}

const SPORT_FILTERS = ['All', 'Athletics', 'Swimming', 'Boxing', 'Cycling', 'Netball', 'Weightlifting'] as const;

export default function Dashboard({
  markets,
  setMarkets,
  onNavigate,
  setSelectedMarket,
  ledger,
  platformFees,
}: DashboardProps): React.ReactElement {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [newMarketId,    setNewMarketId]    = useState<string | null>(null);

  const handleMarketClick = (market: Market) => {
    setSelectedMarket(market);
    onNavigate('dispatch');
  };

  const filteredMarkets = selectedFilter === 'All'
    ? markets
    : markets.filter(m => m.sport === selectedFilter);

  const openPositions = ledger.filter(p => p.status === 'Awaiting result');

  return (
    <div className="layout">
      <div className="main-col">
        <div className="col-head">
          <h2>This Morning's Line</h2>
          <span className="sub">SPREAD SHOWN VS. AI PRICE</span>
        </div>

        {/* Sport filter chips */}
        <div className="filters">
          {SPORT_FILTERS.map(sport => (
            <div
              key={sport}
              className={`chip ${selectedFilter === sport ? 'active' : ''}`}
              onClick={() => setSelectedFilter(sport)}
            >
              {sport}
            </div>
          ))}
        </div>

        {/* Markets table with dual confidence rails */}
        <DirectoryTable
          markets={filteredMarkets}
          newMarketId={newMarketId}
          onMarketClick={handleMarketClick}
        />
      </div>

      {/* Sidebar */}
      <div className="side-col">
        {/* Cable to the Oracle chat */}
        <CableToOracle
          markets={markets}
          setMarkets={setMarkets}
          onNewMarketId={(id) => {
            setNewMarketId(id);
            setTimeout(() => setNewMarketId(null), 900);
          }}
        />

        {/* Open positions preview */}
        <div className="side-card">
          <h3>Your Ledger</h3>
          {openPositions.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '10px 0' }}>
              No open positions. Clip &amp; Stake on a Dispatch to trade.
            </div>
          ) : (
            openPositions.slice(0, 3).map((pos, idx) => (
              <div className="portfolio-row" key={idx}>
                <span>
                  {pos.marketTitle.length > 24
                    ? `${pos.marketTitle.substring(0, 24)}…`
                    : pos.marketTitle}
                </span>
                <span className="val">({pos.side}) {pos.staked}</span>
              </div>
            ))
          )}
        </div>

        {/* Fee counter */}
        <div className="side-card">
          <h3>Fee Circulation</h3>
          <motion.div
            className="fee-counter"
            key={Math.floor(platformFees)}  // re-animate on each integer tick
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {platformFees.toFixed(2)}
            <span className="unit">USDT collected · 2% platform fee · X Layer</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
