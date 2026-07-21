import React from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Market } from '../types';

interface DirectoryTableProps {
  markets:      Market[];
  newMarketId:  string | null;
  onMarketClick: (market: Market) => void;
}

// Sport emoji/badge map
const SPORT_EMOJI: Record<string, string> = {
  Athletics:    '🏃',
  Swimming:     '🏊',
  Boxing:       '🥊',
  Cycling:      '🚴',
  Netball:      '🏐',
  Weightlifting:'🏋️',
  Special:      '⭐',
};

const tableContainerVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055 } },
};

const rowVariants: Variants = {
  hidden:  { opacity: 0, x: 14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.26, ease: [0.4,0,0.2,1] as [number,number,number,number] } },
};

interface DualRailProps {
  prob:  number;
  line:  number;
  animated: boolean;
}

function DualRail({ prob, line, animated }: DualRailProps): React.ReactElement {
  const edge = prob - line;
  const edgeAbs = Math.abs(edge);
  const edgeClass = edge > 0 ? 'pos' : edge < 0 ? 'neg' : '';

  return (
    <div className="rail-dual">
      {/* AI probability bar — Thistle Purple */}
      <div className="rail-row">
        <span className="rail-label-ai">AI</span>
        <div className="rail-track">
          <motion.div
            className="rail-ai-fill"
            initial={{ width: 0 }}
            animate={{ width: animated ? `${prob}%` : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
          />
        </div>
        <span className="rail-pct">{prob}%</span>
      </div>

      {/* Market implied line bar — Ink */}
      <div className="rail-row">
        <span className="rail-label-mkt">MKT</span>
        <div className="rail-track">
          <motion.div
            className="rail-line-fill"
            initial={{ width: 0 }}
            animate={{ width: animated ? `${line}%` : 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
          />
        </div>
        <span className="rail-pct">{line}%</span>
      </div>

      {/* Edge indicator */}
      {edgeAbs > 0 && (
        <div className={`rail-edge ${edgeClass}`}>
          {edge > 0 ? `▲ +${edgeAbs}pp edge` : `▼ ${edgeAbs}pp short`}
        </div>
      )}
    </div>
  );
}

export default function DirectoryTable({
  markets,
  newMarketId,
  onMarketClick,
}: DirectoryTableProps): React.ReactElement {
  const maxVol = Math.max(
    ...markets.map(m => parseInt(m.vol.replace(/,/g, ''), 10) || 1),
    1,
  );

  return (
    <div className="markets-container hard-shadow">
      <div className="table-responsive" style={{ margin: 0 }}>
        <table className="markets">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th>Sport</th>
              <th>Market</th>
              <th style={{ minWidth: 170 }}>AI vs. Line</th>
              <th>Confidence</th>
              <th>Vol.</th>
              <th>Closes</th>
            </tr>
          </thead>
          <motion.tbody
            variants={tableContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {markets.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                  No open markets in this section.
                </td>
              </tr>
            ) : (
              markets.map(m => {
                const volNum = parseInt(m.vol.replace(/,/g, ''), 10) || 0;
                const volPct = Math.round((volNum / maxVol) * 100);
                const isHighEdge = Math.abs(m.prob - m.line) >= 5;

                return (
                  <motion.tr
                    key={m.id}
                    variants={rowVariants}
                    className={m.id === newMarketId ? 'row-new' : ''}
                    onClick={() => onMarketClick(m)}
                    whileHover={{ backgroundColor: 'var(--paper-2)' }}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontSize: '16px', paddingRight: 0 }}>
                      {SPORT_EMOJI[m.sport] ?? '📊'}
                    </td>
                    <td className="tag">{m.sport}</td>
                    <td className="question">
                      {m.title}
                      {isHighEdge && (
                        <span className="edge-flag">EDGE</span>
                      )}
                    </td>
                    <td>
                      <DualRail prob={m.prob} line={m.line} animated />
                    </td>
                    <td>
                      <span className="confidence-badge">{m.confidence}%</span>
                    </td>
                    <td>
                      <div>{m.vol} USDT</div>
                      <div className="vol-bar">
                        <div className="vol-fill" style={{ width: `${volPct}%` }} />
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: '11px', color: 'var(--muted)' }}>{m.close}</td>
                  </motion.tr>
                );
              })
            )}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
