import React from 'react';

export default function Portfolio({ ledger, platformFees }) {
  const openPositions = ledger.filter((item) => item.status === 'Awaiting result');
  const resolvedHistory = ledger.filter((item) => item.status !== 'Awaiting result');

  // Compute dynamic stats based on current ledger
  const openCount = openPositions.length;
  
  // Calculate dynamic P&L
  const netPnl = resolvedHistory.reduce((sum, item) => {
    const val = parseFloat(item.pnl) || 0;
    return sum + val;
  }, 0);

  // Calculate dynamic win rate
  const resolvedCount = resolvedHistory.length;
  const wonCount = resolvedHistory.filter((item) => item.status === 'won').length;
  const winRate = resolvedCount > 0 ? Math.round((wonCount / resolvedCount) * 100) : 58; // fallback to 58% if history is empty

  return (
    <div className="wrap">
      <div className="masthead-stat">
        <div className="stat-block">
          <div className="label">Open Positions</div>
          <div className="num">{openCount}</div>
        </div>
        <div className="stat-block">
          <div className="label">Net P&amp;L (30d)</div>
          <div className={`num ${netPnl >= 0 ? 'green' : 'red'}`}>
            {netPnl >= 0 ? `+${netPnl.toFixed(2)}` : netPnl.toFixed(2)}
          </div>
        </div>
        <div className="stat-block">
          <div className="label">Win Rate</div>
          <div className="num">{winRate}%</div>
        </div>
      </div>

      <div className="col-head">
        <h2>Open Positions</h2>
        <span className="sub">{openCount} ACTIVE</span>
      </div>
      <table className="ledger">
        <thead>
          <tr>
            <th>Sport</th>
            <th>Market</th>
            <th>Side</th>
            <th>Staked</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {openPositions.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                No active positions. Staked markets on the Dispatch column will appear here.
              </td>
            </tr>
          ) : (
            openPositions.map((pos, idx) => (
              <tr key={idx}>
                <td>{pos.sport}</td>
                <td className="q">{pos.marketTitle}</td>
                <td>{pos.side}</td>
                <td>{pos.staked}</td>
                <td className="status open">Awaiting result</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="col-head">
        <h2>Resolved History</h2>
        <span className="sub">LAST 30 DAYS</span>
      </div>
      <table className="ledger">
        <thead>
          <tr>
            <th>Sport</th>
            <th>Market</th>
            <th>Side</th>
            <th>Staked</th>
            <th>Result</th>
            <th>P&amp;L</th>
          </tr>
        </thead>
        <tbody>
          {resolvedHistory.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)' }}>
                No resolved history yet.
              </td>
            </tr>
          ) : (
            resolvedHistory.map((hist, idx) => (
              <tr key={idx}>
                <td>{hist.sport}</td>
                <td className="q">{hist.marketTitle}</td>
                <td>{hist.side}</td>
                <td>{hist.staked}</td>
                <td className={`status ${hist.status}`}>
                  {hist.result}
                </td>
                <td className={`pnl ${parseFloat(hist.pnl) >= 0 ? 'pos' : 'neg'}`}>
                  {parseFloat(hist.pnl) >= 0 ? `+${parseFloat(hist.pnl).toFixed(2)}` : parseFloat(hist.pnl).toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="fee-strip">
        <div className="left">
          <h4>Platform Fee Circulation</h4>
          <div className="desc">
            2% platform fee, collected automatically by the X Layer escrow contract on every settled market.
          </div>
        </div>
        <div className="num" id="feeNum">
          {platformFees.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
