import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles } from 'lucide-react';
import type { ScheduleEvent, Market } from '../types';

interface ScheduleProps {
  markets:         Market[];
  onRequestMarket: (event: ScheduleEvent) => void;
  onNavigate:      (tab: string) => void;
  setSelectedMarket: (m: Market) => void;
}

const GLASGOW_SCHEDULE: ScheduleEvent[] = [
  { id: 'ev-1', sport: 'Athletics',     eventTitle: "Women's 100m Heats",            day: 'Day 2', time: '14:20', venue: 'Scotstoun Stadium',    marketId: 'market-1' },
  { id: 'ev-2', sport: 'Swimming',      eventTitle: "Australia, 2+ golds Day 2",      day: 'Day 2', time: '19:00', venue: 'Tollcross Swim Centre',marketId: 'market-2' },
  { id: 'ev-3', sport: 'Netball',       eventTitle: "Australia vs. Nigeria Group Match",day: 'Day 3', time: '13:00', venue: 'Emirates Arena',         marketId: 'market-5' },
  { id: 'ev-4', sport: 'Cycling',       eventTitle: "Men's Keirin Final",             day: 'Day 1', time: '11:30', venue: 'Chris Hoy Velodrome' },
  { id: 'ev-5', sport: 'Weightlifting', eventTitle: "Men's 73kg Group A",             day: 'Day 4', time: '15:30', venue: 'SECC Exhibition Hall' },
  { id: 'ev-6', sport: 'Cycling',       eventTitle: "Scotland medal, Team Sprint",    day: 'Day 2', time: '16:00', venue: 'Chris Hoy Velodrome',   marketId: 'market-4' },
  { id: 'ev-7', sport: 'Boxing',        eventTitle: "India, 3+ finals reached",       day: 'Day 5', time: '18:00', venue: 'SECC Exhibition Hall',  marketId: 'market-3' },
  { id: 'ev-8', sport: 'Swimming',      eventTitle: "Women's 400m Freestyle Final",   day: 'Day 1', time: '10:00', venue: 'Tollcross Swim Centre' },
  { id: 'ev-9', sport: 'Athletics',     eventTitle: "Men's 10000m Gold Event",        day: 'Day 6', time: '20:15', venue: 'Scotstoun Stadium' },
  { id: 'ev-10', sport: 'Gymnastics',   eventTitle: "Men's Team All-Around",          day: 'Day 3', time: '09:30', venue: 'Emirates Arena' },
];

export default function Schedule({
  markets,
  onRequestMarket,
  onNavigate,
  setSelectedMarket,
}: ScheduleProps): React.ReactElement {
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [draftStep, setDraftStep]       = useState(0);

  const handleRequestMarket = (event: ScheduleEvent) => {
    if (requestingId) return;
    setRequestingId(event.id);
    setDraftStep(1);
  };

  useEffect(() => {
    if (!requestingId) return;

    const timer = setInterval(() => {
      setDraftStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          // Complete and add the market
          const event = GLASGOW_SCHEDULE.find((e) => e.id === requestingId);
          if (event) {
            onRequestMarket(event);
          }
          setTimeout(() => {
            setRequestingId(null);
            setDraftStep(0);
          }, 1500);
          return 4; // success
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [requestingId]);

  const getMarketLink = (marketId: string) => {
    const market = markets.find((m) => m.id === marketId);
    if (!market) return null;
    return (
      <button
        className="btn primary"
        style={{ fontSize: '10.5px', padding: '6px 12px' }}
        onClick={() => {
          setSelectedMarket(market);
          onNavigate('dispatch');
        }}
      >
        View Market →
      </button>
    );
  };

  const stepsLabel = [
    '',
    'Analyzing schedule terms...',
    'Ingesting competitor historical form...',
    'Weighing fitness and injury feeds...',
    'Market Filed Successfully! ◈',
  ];

  return (
    <div className="wrap fade-in" style={{ paddingBottom: '80px' }}>
      <div className="col-head">
        <h2>Glasgow 2026 Schedule</h2>
        <span className="sub">ALL DISCIPLINES & VENUES</span>
      </div>

      <div style={{ fontSize: '14px', margin: '10px 0 24px', fontStyle: 'italic', color: 'var(--muted)' }}>
        Below is the master broadsheet schedule of the Glasgow 2026 Commonwealth Games. 
        Select events with active lines to view forecast details, or prompt the oracle agent to 
        draft a new custom prediction market instantly.
      </div>

      <div className="table-responsive">
        <table className="ledger">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Day</th>
              <th style={{ width: '80px' }}>Time</th>
              <th>Sport</th>
              <th>Event</th>
              <th>Venue</th>
              <th style={{ width: '180px', textAlign: 'right' }}>Oracle Status</th>
            </tr>
          </thead>
          <tbody>
            {GLASGOW_SCHEDULE.map((event) => {
              const liveMarket = markets.find(m => m.title.toLowerCase().includes(event.eventTitle.toLowerCase().split(',')[0].toLowerCase()) || m.id === event.marketId);
              const activeMarketId = liveMarket?.id;
              const isRequestingThis = requestingId === event.id;

              return (
                <tr key={event.id}>
                  <td className="mono" style={{ fontWeight: 600 }}>{event.day}</td>
                  <td className="mono">{event.time}</td>
                  <td className="tag" style={{ textTransform: 'uppercase' }}>{event.sport}</td>
                  <td className="q" style={{ fontWeight: 600 }}>{event.eventTitle}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '12px' }}>{event.venue}</td>
                  <td style={{ textAlign: 'right' }}>
                    {activeMarketId ? (
                      getMarketLink(activeMarketId)
                    ) : isRequestingThis ? (
                      <div className="mono" style={{ fontSize: '10px', color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', fontWeight: 600 }}>
                        <Cpu size={11} className="pulse-red" />
                        <span>{stepsLabel[draftStep]}</span>
                      </div>
                    ) : (
                      <button
                        className="btn ghost"
                        style={{ fontSize: '10.5px', padding: '6px 12px', borderColor: 'var(--rule)', color: 'var(--muted)' }}
                        onClick={() => handleRequestMarket(event)}
                        disabled={!!requestingId}
                      >
                        ◈ Request AI Market
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {requestingId && (
          <motion.div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'var(--paper)',
              border: '2px solid var(--ink)',
              padding: '16px 20px',
              maxWidth: '320px',
              zIndex: 100,
            }}
            className="hard-shadow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Sparkles size={18} style={{ color: 'var(--purple)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <h4 className="mono" style={{ margin: '0 0 6px', fontSize: '12px', textTransform: 'uppercase' }}>
                  Oracle Ingestion
                </h4>
                <p className="mono" style={{ margin: 0, fontSize: '11px', lineHeight: '1.4', color: 'var(--muted)' }}>
                  Drafting prediction terms for event <strong>#{requestingId}</strong>...
                  <br />
                  <span style={{ color: 'var(--purple)', fontWeight: 600 }}>
                    {stepsLabel[draftStep]}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
