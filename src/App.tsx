import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Header   from './components/Header';
import Landing  from './components/Landing';
import Start    from './components/Start';
import Dashboard from './components/Dashboard';
import MarketDetail from './components/MarketDetail';
import Ledger   from './components/Ledger';
import Whitepaper from './components/Whitepaper';
import Schedule from './components/Schedule';
import Verdicts from './components/Verdicts';
import Accuracy from './components/Accuracy';
import ApiDocs  from './components/ApiDocs';
import type { Market, LedgerPosition, AppTab, ScheduleEvent } from './types';

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
  const [activeTab,       setActiveTab]       = useState<AppTab>('start');
  const [walletConnected, setWalletConnected] = useState(false);
  const [platformFees,    setPlatformFees]    = useState(184.20);
  const [selectedMarket,  setSelectedMarket]  = useState<Market | null>(null);
  const [markets,         setMarkets]         = useState<Market[]>(INITIAL_MARKETS);
  const [ledger,          setLedger]          = useState<LedgerPosition[]>(INITIAL_LEDGER);
  const [showHowItWorks,  setShowHowItWorks]  = useState(false);

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

  const handleRequestMarket = (event: ScheduleEvent) => {
    const exists = markets.some(m => m.title.toLowerCase().includes(event.eventTitle.toLowerCase().split(',')[0].toLowerCase()));
    if (exists) return;

    const newMarket: Market = {
      id: `market-${Date.now()}`,
      sport: event.sport,
      title: event.eventTitle,
      prob: Math.floor(Math.random() * 40) + 30,
      line: Math.floor(Math.random() * 40) + 30,
      vol: '0',
      close: '2d',
      confidence: Math.floor(Math.random() * 20) + 65,
      isNew: true,
      reasoning: `This bespoke market was generated dynamically on user request from the Glasgow schedule wire. GamesOracle AI has ingested competitor form data for ${event.eventTitle} and priced it with an explainable confidence weighting.`
    };
    setMarkets(prev => [newMarket, ...prev]);
  };

  const getOrientationText = () => {
    switch (activeTab) {
      case 'start':
        return <>Begin here to complete age/jurisdiction attestation and connect your OKX wallet — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'landing':
        return <>Welcome to GamesOracle AI. Browse live prediction markets or read our agent listing — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'markets':
        return <>You're browsing live markets. Pick one to see the reasoning and place a bet — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'dispatch':
        return <>Detailed analysis for this market. Verify the signals or stake directly — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'ledger':
        return <>Your active positions and resolved payout history. Verified on-chain — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'schedule':
        return <>Browse the official Glasgow 2026 Games schedule or request new markets — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'verdicts':
        return <>Official results and AI post-mortem explanations for resolved prediction markets — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'accuracy':
        return <>Statistical audit of GamesOracle forecast calibration and performance — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'whitepaper':
        return <>Technical specifications and architecture details for GamesOracle AI — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      case 'api':
        return <>Model Context Protocol schema definitions and integration documentation — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
      default:
        return <>An autonomous AI Oracle Agent for Sports Prediction Markets — or <a onClick={() => setShowHowItWorks(true)}>see how it works</a>.</>;
    }
  };

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
        onOpenHowItWorks={() => setShowHowItWorks(true)}
      />

      <div className="orientation-strip">
        {getOrientationText()}
      </div>

      {/* ── Page content with AnimatePresence ───────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === 'start' && (
            <Start
              onNavigate={handleNavigate}
              walletConnected={walletConnected}
              onConnectWallet={() => setWalletConnected(c => !c)}
              walletAddress={walletAddress}
            />
          )}

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

          {activeTab === 'schedule' && (
            <Schedule
              markets={markets}
              onRequestMarket={handleRequestMarket}
              onNavigate={handleNavigate}
              setSelectedMarket={setSelectedMarket}
            />
          )}

          {activeTab === 'verdicts' && <Verdicts />}

          {activeTab === 'accuracy' && <Accuracy />}

          {activeTab === 'api' && <ApiDocs />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHowItWorks(false)}
          >
            <motion.div
              className="modal-card"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowHowItWorks(false)}>
                ✕
              </button>

              <h2 className="display" style={{ margin: '0 0 16px', fontSize: '28px', borderBottom: '2px solid var(--ink)', paddingBottom: '8px' }}>
                How Payouts Work
              </h2>

              <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--ink)' }}>
                <p style={{ margin: '0 0 16px', fontStyle: 'italic', fontSize: '14.5px' }}>
                  GamesOracle is a fully decentralized sports prediction oracle. All operations are autonomous, peer-to-peer, and resolved entirely on-chain on X Layer.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>1</div>
                    <div>
                      <strong className="mono" style={{ fontSize: '12px', textTransform: 'uppercase' }}>AI Analysis & Pricing</strong>
                      <p style={{ margin: '4px 0 0' }}>Browse any market's AI probability and reasoning. Competitor history, form metrics, and real-time feeds are ingested and weighted by the agent.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>2</div>
                    <div>
                      <strong className="mono" style={{ fontSize: '12px', textTransform: 'uppercase' }}>USDT Escrow Lockup</strong>
                      <p style={{ margin: '4px 0 0' }}>Staking on YES/NO locks your USDT inside the X Layer escrow contract. Staked funds are held secure. Neither the agent nor any "house" has access to your capital.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>3</div>
                    <div>
                      <strong className="mono" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Autonomous Resolution</strong>
                      <p style={{ margin: '4px 0 0' }}>The moment the official Commonwealth Games results are posted, the oracle agent processes the feed and triggers resolution directly on the contract.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>4</div>
                    <div>
                      <strong className="mono" style={{ fontSize: '12px', textTransform: 'uppercase' }}>Instant Wallet Settlement</strong>
                      <p style={{ margin: '4px 0 0' }}>The contract divides the losing pool among the winners, deducts a 2% fee, and sends the USDT directly to your connected wallet. No claim forms, no waiting.</p>
                    </div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px dashed var(--rule)', margin: '18px 0' }} />

                <h4 className="mono" style={{ margin: '0 0 8px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Platform Map (What each page does)
                </h4>
                <ul className="mono" style={{ paddingLeft: '18px', margin: 0, fontSize: '11.5px', color: 'var(--muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Home:</strong> General overview and hackathon objectives.</li>
                  <li><strong>Markets:</strong> Directory of active sports prediction categories.</li>
                  <li><strong>Dispatch:</strong> Detailed individual market view with full AI analysis & bet slip.</li>
                  <li><strong>Ledger:</strong> Your active positions and resolved history.</li>
                  <li><strong>Schedule:</strong> Full Games calendar where you can request the AI to draft new markets.</li>
                  <li><strong>Verdicts:</strong> Archive of resolved predictions and post-mortems explaining AI hits/misses.</li>
                  <li><strong>Accuracy:</strong> Live statistics tracking prediction Brier score and calibration.</li>
                  <li><strong>API:</strong> Model Context Protocol (MCP) tool schema definitions for A2A integrations.</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
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
