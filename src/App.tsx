import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Header   from './components/Header';
import Landing  from './components/Landing';
import Dashboard from './components/Dashboard';
import MarketDetail from './components/MarketDetail';
import Ledger   from './components/Ledger';
import Whitepaper from './components/Whitepaper';
import type { Market, LedgerPosition, AppTab } from './types';

// ── Page animation variants ───────────────────────────────
const pageVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.24, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] as [number,number,number,number] } },
};

// ── Seed data ─────────────────────────────────────────────
const INITIAL_MARKETS: Market[] = [
  { id:'market-1', sport:'Athletics',    title:"Jamaica gold, Women's 100m",            prob:34, line:38, vol:'1,204', close:'6h',  confidence:71, reasoning:"Jamaica arrives at Scotstoun Stadium with two of the season's four fastest women over 100 metres, but a shallow head-to-head record against the field's form leader keeps the line closer than the roster alone would suggest. Sixty percent of the model's weight sits on 2025–26 season-best times, which favour Jamaica narrowly. Twenty-five percent comes from head-to-head record across the last three major championships, where the field leader holds a 3–1 edge. The remaining fifteen percent reflects this week's injury and fitness reporting, which is clean for all three medal contenders. Confidence sits at 71%, reduced from a baseline of 80% because start lists were only finalised eighteen hours before close." },
  { id:'market-2', sport:'Swimming',     title:'Australia, 2+ golds Day 2',             prob:57, line:50, vol:'860',   close:'3h',  confidence:82, reasoning:"Australia boasts strong relay entries and individual depth in the freestyle sprints. Historically dominant in session two events at Tollcross, the squad has a 57% likelihood of securing at least two gold medals today. Weighted 50% on season times, 30% on team relay dynamics, and 20% on historical track record." },
  { id:'market-3', sport:'Boxing',       title:'India, 3+ finals reached',              prob:41, line:45, vol:'410',   close:'1d',  confidence:68, reasoning:"Indian amateur boxing has placed substantial athletes in the flyweight and middleweight brackets. Historical conversion rates indicate high probability of semifinal qualification, translating to a 41% chance of three or more finalists." },
  { id:'market-4', sport:'Cycling',      title:'Scotland medal, Team Sprint',           prob:29, line:40, vol:'302',   close:'8h',  confidence:59, reasoning:"Home crowd advantage at the Sir Chris Hoy Velodrome is factored in, but season times put the Scottish sprint team slightly behind Australia and England. Priced at 29%." },
  { id:'market-5', sport:'Netball',      title:'Nigeria to beat Australia, group stage',prob:22, line:20, vol:'588',   close:'1d',  confidence:74, reasoning:"Nigeria's squad has shown excellent athletic progression, though Australia remains the global benchmark. AI prices a potential upset at 22% vs. market consensus of 20%." },
  { id:'market-6', sport:'Weightlifting',title:'Over/Under 8 total medals, Nigeria',   prob:61, line:55, vol:'742',   close:'9d',  confidence:77, reasoning:"Nigeria's weightlifting contingent is traditionally dominant in the middleweight classes. Season form indicates a 61% probability of exceeding 8 total medals." },
];

const INITIAL_LEDGER: LedgerPosition[] = [
  { sport:'Athletics',    marketTitle:"Jamaica gold, Women's 100m",        side:'YES', staked:'20 USDT', status:'Awaiting result' },
  { sport:'Athletics',    marketTitle:'Kenya over field, 5000m',           side:'NO',  staked:'10 USDT', status:'Awaiting result' },
  { sport:'Swimming',     marketTitle:'Australia Day 5 O/U medals',        side:'YES', staked:'15 USDT', status:'Awaiting result' },
  { sport:'Swimming',     marketTitle:"Men's 100m Freestyle — AUS gold",   side:'YES', staked:'25 USDT', status:'won',  result:'Won', pnl:'8.10'  },
  { sport:'Boxing',       marketTitle:'India reaches 3+ finals',           side:'YES', staked:'15 USDT', status:'lost', result:'Lost',pnl:'-15.00'},
  { sport:'Cycling',      marketTitle:'Scotland Team Sprint medal',        side:'NO',  staked:'12 USDT', status:'won',  result:'Won', pnl:'4.50'  },
  { sport:'Netball',      marketTitle:'Nigeria beats Australia, group stage',side:'YES',staked:'18 USDT', status:'won',  result:'Won', pnl:'15.00' },
];

export default function App(): React.ReactElement {
  const [activeTab,       setActiveTab]       = useState<AppTab>('landing');
  const [walletConnected, setWalletConnected] = useState(false);
  const [platformFees,    setPlatformFees]    = useState(184.20);
  const [selectedMarket,  setSelectedMarket]  = useState<Market | null>(null);
  const [markets,         setMarkets]         = useState<Market[]>(INITIAL_MARKETS);
  const [ledger,          setLedger]          = useState<LedgerPosition[]>(INITIAL_LEDGER);

  // Live fee accumulation
  useEffect(() => {
    const timer = setInterval(() => setPlatformFees(p => p + Math.random() * 0.6), 2400);
    return () => clearInterval(timer);
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab as AppTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddPosition = (pos: LedgerPosition) => setLedger(prev => [pos, ...prev]);

  const walletAddress = '0x4F…9aC1';

  return (
    <div>
      {/* ── Header (datebar + masthead) ─────────────────── */}
      <Header
        activeTab={activeTab}
        onNavigate={handleNavigate}
        walletConnected={walletConnected}
        onConnectWallet={() => setWalletConnected(c => !c)}
        walletAddress={walletAddress}
        platformFees={platformFees}
      />

      {/* ── Page content with AnimatePresence ───────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === 'landing' && (
            <Landing
              onNavigate={handleNavigate}
              walletConnected={walletConnected}
              onConnectWallet={() => setWalletConnected(c => !c)}
              walletAddress={walletAddress}
            />
          )}

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
            <MarketDetail
              selectedMarket={selectedMarket}
              onAddPosition={handleAddPosition}
            />
          )}

          {activeTab === 'ledger' && (
            <Ledger ledger={ledger} platformFees={platformFees} />
          )}

          {activeTab === 'whitepaper' && <Whitepaper />}
        </motion.div>
      </AnimatePresence>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer>
        <span className="footer-brand">GamesOracle AI — Agent Service Provider · OKX.AI Genesis Hackathon</span>
        <span>Not affiliated with the Commonwealth Games Federation</span>
        <span className="footer-tag">#OKXAI</span>
      </footer>
    </div>
  );
}
