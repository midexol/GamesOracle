import React from 'react';
import { Zap, Wifi } from 'lucide-react';
import type { AppTab } from '../types';

interface HeaderProps {
  activeTab:        AppTab;
  onNavigate:       (tab: AppTab) => void;
  walletConnected:  boolean;
  onConnectWallet:  () => void;
  walletAddress:    string;
  platformFees:     number;
}

export default function Header({
  activeTab,
  onNavigate,
  walletConnected,
  onConnectWallet,
  walletAddress,
  platformFees,
}: HeaderProps): React.ReactElement {
  const formattedDate = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();

  const isLanding = activeTab === 'landing';

  const pageLabel: Record<AppTab, string> = {
    landing:    'FRONT PAGE',
    markets:    'MARKETS COLUMN',
    dispatch:   'DISPATCH',
    ledger:     'THE LEDGER',
    whitepaper: 'WHITEPAPER',
    schedule:   'GAMES SCHEDULE',
    verdicts:   'VERDICTS COLUMN',
    accuracy:   'ACCURACY AUDIT',
    api:        'MCP INTERFACE',
  };

  const pageRight: Record<AppTab, string> = {
    landing:    'Price: Free · OKX.AI',
    markets:    '14 Open · Auto-refreshing',
    dispatch:   'Filed 09:14 BST',
    ledger:     'Updated live',
    whitepaper: 'v0.1 Working Draft',
    schedule:   'Glasgow 2026 Calendar',
    verdicts:   'Settled escrow payouts',
    accuracy:   'Calibration stats',
    api:        'ASP endpoint tools',
  };

  return (
    <>
      {/* ── Datebar ─────────────────────────────────────── */}
      <div className="datebar">
        <span>Glasgow Edition · Vol. I, No. 1</span>
        <span>
          {isLanding ? formattedDate : (
            <>
              <span className="live-dot" />
              {pageLabel[activeTab]}
            </>
          )}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isLanding && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Zap size={9} style={{ color: 'var(--purple)' }} />
              <span style={{ color: 'var(--purple)', fontWeight: 600 }}>
                {platformFees.toFixed(2)} USDT
              </span>
            </span>
          )}
          <span>{pageRight[activeTab]}</span>
        </span>
      </div>

      {/* ── Masthead ─────────────────────────────────────── */}
      {isLanding ? (
        <div className="masthead center-mode">
          <div className="kicker">
            <span className="live-dot" />
            Live wire — Commonwealth Games 2026, Glasgow
          </div>
          <h1 className="display">GAMESORACLE</h1>
          <div className="tagline">"An AI oracle, priced and printed for every medal in Glasgow."</div>
          <nav className="subnav">
            <a onClick={() => onNavigate('markets')} className="live">Markets</a>
            <a onClick={() => onNavigate('schedule')}>Schedule</a>
            <a onClick={() => onNavigate('verdicts')}>Verdicts</a>
            <a onClick={() => onNavigate('ledger')}>Ledger</a>
            <a onClick={() => onNavigate('accuracy')}>Accuracy</a>
            <a onClick={() => onNavigate('whitepaper')}>Whitepaper</a>
            <a onClick={() => onNavigate('api')}>API</a>
          </nav>
        </div>
      ) : (
        <div className="masthead">
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div>
              <div className="kicker">
                <Wifi size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Live
              </div>
              <h1 className="display" style={{ cursor: 'pointer' }} onClick={() => onNavigate('landing')}>
                GamesOracle
              </h1>
            </div>
          </div>
          <nav className="subnav">
            <a onClick={() => onNavigate('landing')}>Front Page</a>
            <a onClick={() => onNavigate('markets')}    className={activeTab === 'markets'    ? 'active' : ''}>Markets</a>
            <a onClick={() => onNavigate('schedule')}   className={activeTab === 'schedule'   ? 'active' : ''}>Schedule</a>
            <a onClick={() => onNavigate('verdicts')}   className={activeTab === 'verdicts'   ? 'active' : ''}>Verdicts</a>
            <a onClick={() => onNavigate('ledger')}     className={activeTab === 'ledger'     ? 'active' : ''}>Ledger</a>
            <a onClick={() => onNavigate('accuracy')}   className={activeTab === 'accuracy'   ? 'active' : ''}>Accuracy</a>
            <a onClick={() => onNavigate('whitepaper')} className={activeTab === 'whitepaper' ? 'active' : ''}>Whitepaper</a>
            <a onClick={() => onNavigate('api')}        className={activeTab === 'api'        ? 'active' : ''}>API</a>
          </nav>
          <button className="wallet-btn hard-shadow-sm" onClick={onConnectWallet}>
            {walletConnected ? `⬡ ${walletAddress}` : '⬡ Connect OKX Wallet'}
          </button>
        </div>
      )}
    </>
  );
}
