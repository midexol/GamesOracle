import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import MarketDetail from './components/MarketDetail';
import Portfolio from './components/Portfolio';
import Whitepaper from './components/Whitepaper';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [platformFees, setPlatformFees] = useState(184.20);
  const [selectedMarket, setSelectedMarket] = useState(null);

  // Initial Markets list
  const [markets, setMarkets] = useState([
    { 
      id: 'market-1', 
      sport: 'Athletics', 
      title: 'Jamaica gold, Women\'s 100m', 
      prob: 34, 
      line: 38, 
      vol: '1,204', 
      close: '6h',
      reasoning: "Jamaica arrives at Scotstoun Stadium with two of the season's four fastest women over 100 metres, but a shallow head-to-head record against the field's form leader keeps the line closer than the roster alone would suggest. Sixty percent of the model's weight sits on 2025–26 season-best times, which favour Jamaica narrowly. Twenty-five percent comes from head-to-head record across the last three major championships, where the field leader holds a 3–1 edge. The remaining fifteen percent reflects this week's injury and fitness reporting, which is clean for all three medal contenders. Confidence sits at 71%, reduced from a baseline of 80% because start lists were only finalised eighteen hours before close — the model treats late-confirmed fields as a source of residual uncertainty." 
    },
    { 
      id: 'market-2', 
      sport: 'Swimming', 
      title: 'Australia, 2+ golds Day 2', 
      prob: 57, 
      line: 50, 
      vol: '860', 
      close: '3h',
      reasoning: "Australia boasts strong relay entries and individual depth in the freestyle sprints. Historically dominant in session two events at Tollcross, the squad has a 57% likelihood of securing at least two gold medals today. Weighted 50% on season times, 30% on team relay dynamics, and 20% on historical track record. Line is set slightly lower at 50% due to strong English challenge." 
    },
    { 
      id: 'market-3', 
      sport: 'Boxing', 
      title: 'India, 3+ finals reached', 
      prob: 41, 
      line: 45, 
      vol: '410', 
      close: '1d',
      reasoning: "Indian amateur boxing has placed substantial athletes in the flyweight and middleweight brackets. Historical conversion rates indicate high probability of semifinal qualification, translating to a 41% chance of three or more finalists." 
    },
    { 
      id: 'market-4', 
      sport: 'Cycling', 
      title: 'Scotland medal, Team Sprint', 
      prob: 29, 
      line: 40, 
      vol: '302', 
      close: '8h',
      reasoning: "Home crowd advantage at the Sir Chris Hoy Velodrome is factored in, but season times put the Scottish sprint team slightly behind Australia and England. Priced at 29%." 
    },
    { 
      id: 'market-5', 
      sport: 'Netball', 
      title: 'Nigeria to beat Australia, group stage', 
      prob: 22, 
      line: 20, 
      vol: '588', 
      close: '1d',
      reasoning: "Nigeria's squad has shown excellent athletic progression, though Australia remains the global benchmark. AI prices a potential upset at 22% vs. a market consensus of 20%." 
    },
    { 
      id: 'market-6', 
      sport: 'Weightlifting', 
      title: 'Over/Under 8 total medals, Nigeria', 
      prob: 61, 
      line: 55, 
      vol: '742', 
      close: '9d',
      reasoning: "Nigeria's weightlifting contingent is traditionally dominant in the middleweight classes. Season form indicates a 61% probability of exceeding 8 total medals." 
    }
  ]);

  // Unified ledger state (Open Positions + Resolved History)
  const [ledger, setLedger] = useState([
    // Open Positions
    { sport: 'Athletics', marketTitle: "Jamaica gold, Women's 100m", side: 'YES', staked: '20 USDT', status: 'Awaiting result' },
    { sport: 'Athletics', marketTitle: 'Kenya over field, 5000m', side: 'NO', staked: '10 USDT', status: 'Awaiting result' },
    { sport: 'Swimming', marketTitle: 'Australia Day 5 O/U medals', side: 'YES', staked: '15 USDT', status: 'Awaiting result' },
    // Resolved History
    { sport: 'Swimming', marketTitle: 'Men\'s 100m Freestyle — AUS gold', side: 'YES', staked: '25 USDT', status: 'won', result: 'Won', pnl: '8.10' },
    { sport: 'Boxing', marketTitle: 'India reaches 3+ finals', side: 'YES', staked: '15 USDT', status: 'lost', result: 'Lost', pnl: '-15.00' },
    { sport: 'Cycling', marketTitle: 'Scotland Team Sprint medal', side: 'NO', staked: '12 USDT', status: 'won', result: 'Won', pnl: '4.50' },
    { sport: 'Netball', marketTitle: 'Nigeria beats Australia, group stage', side: 'YES', staked: '18 USDT', status: 'won', result: 'Won', pnl: '15.00' }
  ]);

  // Dynamic fee accumulation simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPlatformFees((prev) => prev + Math.random() * 0.6);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const handleAddPosition = (position) => {
    setLedger((prev) => [position, ...prev]);
  };

  const handleConnectWallet = () => {
    setWalletConnected(!walletConnected);
  };

  // Get current date formatted like standard newspaper broadsheet
  const formattedDate = new Date()
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();

  // Tab switching helper
  const handleNavigate = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Dynamic Datebar */}
      <div className="datebar">
        {activeTab === 'landing' ? (
          <>
            <span>Glasgow Edition · Vol. I, No. 1</span>
            <span>{formattedDate}</span>
            <span>Price: Free · Powered by OKX.AI</span>
          </>
        ) : (
          <>
            <span>Glasgow Edition · Day 2</span>
            <span>
              {activeTab === 'markets'
                ? 'MARKETS COLUMN'
                : activeTab === 'dispatch'
                ? 'DISPATCH'
                : activeTab === 'whitepaper'
                ? 'WHITEPAPER'
                : 'THE LEDGER'}
            </span>
            <span>
              {activeTab === 'markets'
                ? '14 Open · Auto-refreshing'
                : activeTab === 'dispatch'
                ? 'Filed 09:14 BST'
                : activeTab === 'whitepaper'
                ? 'v0.1 Working Draft'
                : 'Updated live'}
            </span>
          </>
        )}
      </div>

      {/* Dynamic Masthead */}
      {activeTab === 'landing' ? (
        <div className="masthead center-mode">
          <div className="kicker">● Live wire — Commonwealth Games, Day 1</div>
          <h1 className="display">GAMESORACLE</h1>
          <div className="tagline">"An AI oracle, priced and printed for every medal in Glasgow."</div>
          <nav className="subnav">
            <a onClick={() => handleNavigate('markets')} className="live">
              Markets
            </a>
            <a onClick={() => handleNavigate('dispatch')}>Dispatch</a>
            <a onClick={() => handleNavigate('ledger')}>Ledger</a>
            <a onClick={() => handleNavigate('whitepaper')}>Whitepaper</a>
            <a href="#method">Method</a>
            <a href="#sections">Editions</a>
          </nav>
        </div>
      ) : (
        <div className="masthead">
          <div>
            <div className="kicker">● Live</div>
            <h1 className="display">GamesOracle</h1>
          </div>
          <nav className="subnav">
            <a onClick={() => handleNavigate('landing')}>Front Page</a>
            <a onClick={() => handleNavigate('markets')} className={activeTab === 'markets' ? 'active' : ''}>
              Markets
            </a>
            <a onClick={() => handleNavigate('dispatch')} className={activeTab === 'dispatch' ? 'active' : ''}>
              Dispatch
            </a>
            <a onClick={() => handleNavigate('ledger')} className={activeTab === 'ledger' ? 'active' : ''}>
              Ledger
            </a>
            <a onClick={() => handleNavigate('whitepaper')} className={activeTab === 'whitepaper' ? 'active' : ''}>
              Whitepaper
            </a>
          </nav>
          <button className="wallet-btn" onClick={handleConnectWallet}>
            {walletConnected ? 'Connected · 0x4F...9aC1' : 'Connect OKX Wallet'}
          </button>
        </div>
      )}

      {/* Active Tab rendering */}
      {activeTab === 'landing' && <Landing onNavigate={handleNavigate} />}
      
      {activeTab === 'markets' && (
        <Dashboard
          markets={markets}
          setMarkets={setMarkets}
          onNavigate={handleNavigate}
          setSelectedMarket={setSelectedMarket}
          ledger={ledger}
          platformFees={platformFees}
        />
      )}

      {activeTab === 'dispatch' && (
        <MarketDetail selectedMarket={selectedMarket} onAddPosition={handleAddPosition} />
      )}

      {activeTab === 'ledger' && <Portfolio ledger={ledger} platformFees={platformFees} />}

      {activeTab === 'whitepaper' && <Whitepaper />}

      {/* Shared Footer */}
      <footer>
        <span>GamesOracle AI — an Agent Service Provider on OKX.AI</span>
        <span>Not affiliated with the Commonwealth Games Federation</span>
        <span>#OKXAI</span>
      </footer>
    </div>
  );
}
