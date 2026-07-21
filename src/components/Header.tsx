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
  onOpenHowItWorks: () => void;
}

export default function Header({
  activeTab,
  onNavigate,
  walletConnected,
  onConnectWallet,
  walletAddress,
  platformFees,
  onOpenHowItWorks,
}: HeaderProps): React.ReactElement {
  const formattedDate = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();

  const isLanding = activeTab === 'landing';

  const pageLabel: Record<AppTab, string> = {
    landing:    'HOME',
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
    landing:    'OKX.AI',
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
    <header className="sticky-header">
      {/* ── Datebar / Utility Top Bar ────────────────────── */}
      <div className="datebar">
        <span>GLASGOW EDITION · {formattedDate}</span>
        <span className="center-edition">GLASGOW 2026 SPECIAL RELEASE</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="fees-counter">
            {activeTab === 'ledger' ? (
              <span>VERIFIED ON-CHAIN</span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Zap size={9} style={{ color: 'var(--purple)' }} />
                <span style={{ color: 'var(--purple)', fontWeight: 600 }}>
                  {platformFees.toFixed(2)} USDT
                </span>
              </span>
            )}
            <span className="page-right-desc" style={{ marginLeft: '6px' }}>{pageRight[activeTab]}</span>
          </span>
          <button className="wallet-btn hard-shadow-sm" onClick={onConnectWallet}>
            {walletConnected ? `⬡ ${walletAddress}` : '⬡ Connect OKX Wallet'}
          </button>
        </div>
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
            <a onClick={() => onNavigate('markets')} className="live">
              <span className="title">Markets</span>
              <span className="sub">Browse & bet</span>
            </a>
            <a onClick={() => onNavigate('schedule')}>
              <span className="title">Schedule</span>
              <span className="sub">Games calendar</span>
            </a>
            <a onClick={() => onNavigate('verdicts')}>
              <span className="title">Verdicts</span>
              <span className="sub">Settled payouts</span>
            </a>
            <a onClick={() => onNavigate('ledger')}>
              <span className="title">Ledger</span>
              <span className="sub">Your bets</span>
            </a>
            <a onClick={() => onNavigate('accuracy')}>
              <span className="title">Accuracy</span>
              <span className="sub">Calibration</span>
            </a>
            <a onClick={() => onNavigate('whitepaper')}>
              <span className="title">Whitepaper</span>
              <span className="sub">Tech draft</span>
            </a>
            <a onClick={() => onNavigate('api')}>
              <span className="title">API Docs</span>
              <span className="sub">Developer tools</span>
            </a>
            <button className="how-it-works-btn hard-shadow-sm" style={{ padding: '6px 12px', fontSize: '10px', height: 'fit-content', alignSelf: 'center', marginLeft: '12px', marginRight: 0 }} onClick={onOpenHowItWorks}>
              How It Works
            </button>
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
            <a onClick={() => onNavigate('landing')} className={activeTab === 'landing' ? 'active' : ''}>
              <span className="title">Home</span>
              <span className="sub">About project</span>
            </a>
            <a onClick={() => onNavigate('markets')}    className={activeTab === 'markets'    ? 'active' : ''}>
              <span className="title">Markets</span>
              <span className="sub">Browse & bet</span>
            </a>
            <a onClick={() => onNavigate('schedule')}   className={activeTab === 'schedule'   ? 'active' : ''}>
              <span className="title">Schedule</span>
              <span className="sub">Games calendar</span>
            </a>
            <a onClick={() => onNavigate('verdicts')}   className={activeTab === 'verdicts'   ? 'active' : ''}>
              <span className="title">Verdicts</span>
              <span className="sub">Settled payouts</span>
            </a>
            <a onClick={() => onNavigate('ledger')}     className={activeTab === 'ledger'     ? 'active' : ''}>
              <span className="title">Ledger</span>
              <span className="sub">Your bets</span>
            </a>
            <a onClick={() => onNavigate('accuracy')}   className={activeTab === 'accuracy'   ? 'active' : ''}>
              <span className="title">Accuracy</span>
              <span className="sub">Calibration</span>
            </a>
            <a onClick={() => onNavigate('whitepaper')} className={activeTab === 'whitepaper' ? 'active' : ''}>
              <span className="title">Whitepaper</span>
              <span className="sub">Tech draft</span>
            </a>
            <a onClick={() => onNavigate('api')}        className={activeTab === 'api'        ? 'active' : ''}>
              <span className="title">API Docs</span>
              <span className="sub">Developer tools</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
