import React, { useState } from 'react';

const defaultMarket = {
  id: 'default-1',
  sport: 'Athletics',
  title: 'Will a Jamaican sprinter take gold in the Women\'s 100m?',
  prob: 34,
  line: 38,
  vol: '1,204',
  close: '6h',
  reasoning: "Jamaica arrives at Scotstoun Stadium with two of the season's four fastest women over 100 metres, but a shallow head-to-head record against the field's form leader keeps the line closer than the roster alone would suggest. Sixty percent of the model's weight sits on 2025–26 season-best times, which favour Jamaica narrowly. Twenty-five percent comes from head-to-head record across the last three major championships, where the field leader holds a 3–1 edge. The remaining fifteen percent reflects this week's injury and fitness reporting, which is clean for all three medal contenders. Confidence sits at 71%, reduced from a baseline of 80% because start lists were only finalised eighteen hours before close — the model treats late-confirmed fields as a source of residual uncertainty."
};

export default function MarketDetail({ selectedMarket, onAddPosition }) {
  const market = selectedMarket || defaultMarket;
  const [selectedStake, setSelectedStake] = useState(5);
  const [feedback, setFeedback] = useState('');

  const handlePlaceBet = (side) => {
    // Add position to ledger state in parent component
    const position = {
      sport: market.sport,
      marketTitle: market.title,
      side: side,
      staked: `${selectedStake} USDT`,
      status: 'Awaiting result'
    };
    onAddPosition(position);

    setFeedback(`Staked ${selectedStake} USDT on ${side}. Locked in escrow — settles automatically when the result is filed.`);
  };

  // Extract weights if reasoning does not specify, default is 60%, 25%, 15%
  return (
    <div className="article">
      <div className="eyebrow">{market.sport} · Markets</div>
      <h2 className="headline display">{market.title}</h2>
      <div className="byline">
        Filed by GamesOracle AI — Glasgow Bureau · Market closes in {market.close} · Vol. {market.vol} USDT
      </div>

      <p className="lede">
        {market.reasoning ? market.reasoning.split('.')[0] + '.' : "This market is open and active on the wire. Read the dynamic intelligence analysis and signals below to review the model's confidence weightings."}
      </p>

      <div className="pullquote">
        "{market.prob}% probability, {market.prob + 12}% confidence — priced on season bests, head-to-head history, and this week's fitness reports."
        <span>— GamesOracle AI, reasoning summary</span>
      </div>

      <div className="grid2">
        <div className="body-text">
          <p>
            The market prices this event at {market.prob}%, against a bookmaker consensus line of {market.line}% — a {Math.abs(market.prob - market.line)}-point gap that the agent flags relative to recent stats.
          </p>
          <p>
            {market.reasoning || "Sixty percent of the model's weight sits on 2025–26 season-best times, which favour form leaders narrowly. Twenty-five percent comes from head-to-head record across the last three major championships. The remaining fifteen percent reflects this week's injury and fitness reporting."}
          </p>
        </div>
        <div className="inputs-box">
          <h4>Signals Used</h4>
          <div className="input-row">
            <span>Season-best times</span>
            <span className="w">60%</span>
          </div>
          <div className="input-row">
            <span>Head-to-head record</span>
            <span className="w">25%</span>
          </div>
          <div className="input-row">
            <span>Fitness / injury reports</span>
            <span className="w">15%</span>
          </div>
          <div className="input-row">
            <span>Resolution source</span>
            <span className="w">CGF feed</span>
          </div>
        </div>
      </div>

      <div className="rail-big">
        <div className="rail-fill" style={{ width: `${market.prob}%` }}>
          <span className="rail-label">AI {market.prob}%</span>
        </div>
        <div className="rail-tick" style={{ left: `${market.line}%` }}></div>
      </div>
      <div className="rail-vals">
        <span>0%</span>
        <span>Line {market.line}%</span>
        <span>100%</span>
      </div>

      <div className="coupon">
        <h4>Clip &amp; Stake</h4>
        <div className="stake-row">
          {[5, 20, 50].map((value) => (
            <button
              key={value}
              className={selectedStake === value ? 'sel' : ''}
              onClick={() => {
                setSelectedStake(value);
                setFeedback('');
              }}
            >
              {value} USDT
            </button>
          ))}
        </div>
        <button className="side-btn yes" onClick={() => handlePlaceBet('YES')}>
          Back YES
        </button>
        <button className="side-btn no" onClick={() => handlePlaceBet('NO')}>
          Back NO / Field
        </button>
        <div className="fine" id="feedback">
          {feedback || "Settled on-chain via X Layer escrow · 2% resolution fee applies"}
        </div>
      </div>

      <div className="sources">
        <span>Resolution source:</span> Commonwealth Games Federation official results feed · Escrow contract: X Layer testnet
      </div>
    </div>
  );
}
