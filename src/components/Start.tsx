import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Wallet, HelpCircle } from 'lucide-react';
import type { AppTab } from '../types';

interface StartProps {
  onNavigate: (tab: AppTab) => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
  walletAddress: string;
}

export default function Start({
  onNavigate,
  walletConnected,
  onConnectWallet,
  walletAddress,
}: StartProps): React.ReactElement {
  const [agreed, setAgreed] = useState(false);
  const [displayName, setDisplayName] = useState('');

  return (
    <div className="wrap" style={{ maxWidth: '800px', padding: '40px 16px 80px' }}>
      <div className="box hard-shadow-sm" style={{ padding: '32px', background: 'var(--paper)', border: '2px solid var(--ink)' }}>
        
        {/* Onboarding Header */}
        <div style={{ borderBottom: '2px solid var(--ink)', paddingBottom: '20px', marginBottom: '24px' }}>
          <div className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--purple)', marginBottom: '8px', fontWeight: '600' }}>
            Step 1 — Gatekeeper & Verification
          </div>
          <h1 className="display" style={{ fontSize: '32px', margin: '0 0 10px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            Start Here: Onboarding & Attestation
          </h1>
          <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: 'var(--muted)', margin: 0 }}>
            GamesOracle is a decentralized, peer-to-peer prediction agent resolved autonomously on-chain. 
            Before participating, we require all users to complete their profile setup, confirm their eligibility, and review how predictions settle.
          </p>
        </div>

        {/* 3-Step Walkthrough Inline */}
        <div style={{ marginBottom: '32px' }}>
          <h3 className="mono" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink)', borderBottom: '1px dashed var(--rule)', paddingBottom: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HelpCircle size={14} /> How It Works (Inline Guide)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '11px' }}>1</div>
              <div>
                <strong className="mono" style={{ fontSize: '12.5px', textTransform: 'uppercase' }}>Browse & Inspect AI Forecasts</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', lineHeight: '1.5', color: '#444' }}>
                  Explore active sports markets. Review the AI's probability forecasts, injury reports, and explainable signal citations before taking any action.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '11px' }}>2</div>
              <div>
                <strong className="mono" style={{ fontSize: '12.5px', textTransform: 'uppercase' }}>USDT Smart Contract Escrow</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', lineHeight: '1.5', color: '#444' }}>
                  Select your outcome and lock your stake inside the X Layer escrow smart contract. Staked funds are held transparently and securely in escrow—neither the AI agent nor any central house has custody.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div className="mono" style={{ background: 'var(--ink)', color: 'var(--paper)', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '11px' }}>3</div>
              <div>
                <strong className="mono" style={{ fontSize: '12.5px', textTransform: 'uppercase' }}>Autonomous Payouts</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', lineHeight: '1.5', color: '#444' }}>
                  When the official sports results publish, the oracle agent triggers contract resolution. The winning pool is distributed to the winners instantly, directly to their connected wallets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs & Checklist */}
        <div style={{ background: 'var(--paper-2)', padding: '20px', border: '1px solid var(--rule)', borderRadius: '4px', marginBottom: '28px' }}>
          <h3 className="mono" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px', color: 'var(--ink)' }}>
            Compliance & Identity Check
          </h3>

          {/* Optional Display Name */}
          <div style={{ marginBottom: '20px' }}>
            <label className="mono" style={{ display: 'block', fontSize: '11px', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>
              Optional Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. SportsGenius_99"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mono"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '2px solid var(--ink)',
                fontSize: '13px',
                background: 'var(--paper)',
                outline: 'none',
              }}
            />
            <span className="mono" style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginTop: '4px' }}>
              This name is stored locally to customize your bet slip dispatches.
            </span>
          </div>

          {/* Eligibility Checkbox */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              id="start-here-checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginTop: '3px', cursor: 'pointer', transform: 'scale(1.1)' }}
            />
            <label htmlFor="start-here-checkbox" style={{ fontSize: '13px', lineHeight: '1.5', cursor: 'pointer', color: 'var(--ink)' }}>
              I certify that I am <strong>18 years of age or older</strong>, and that participating in stake-based sports prediction markets does not violate the local laws or gambling regulations of my current jurisdiction.
            </label>
          </div>
        </div>

        {/* Action States */}
        {!walletConnected ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8D7DA', border: '1px solid #F5C2C7', padding: '12px 16px', borderRadius: '4px', marginBottom: '20px', color: '#842029', fontSize: '12px' }}>
              <ShieldAlert size={14} />
              <span className="mono">Age and jurisdiction attestation is required to unlock wallet connection.</span>
            </div>
            
            <button
              onClick={onConnectWallet}
              disabled={!agreed}
              className="wallet-btn hard-shadow-sm"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: agreed ? 'pointer' : 'not-allowed',
                background: agreed ? 'var(--purple)' : '#D6D1C6',
                color: agreed ? '#FFF' : 'var(--muted)',
                borderColor: 'var(--ink)',
                borderWidth: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: agreed ? 1 : 0.65,
                transition: 'all 0.15s ease',
              }}
            >
              <Wallet size={16} /> Connect OKX Wallet to Begin
            </button>
          </div>
        ) : (
          <div className="hard-shadow-sm" style={{ background: '#D1E7DD', border: '2px solid var(--ink)', padding: '24px', borderRadius: '4px', textAlign: 'center' }}>
            <CheckCircle2 size={36} style={{ color: '#0F5132', marginBottom: '12px' }} />
            <h3 className="display" style={{ fontSize: '20px', margin: '0 0 4px', color: '#0F5132', fontWeight: 700 }}>
              Onboarding Complete!
            </h3>
            <p className="mono" style={{ fontSize: '12px', color: '#0F5132', margin: '0 0 16px' }}>
              {displayName ? `Logged in as: ${displayName} | ` : ''}Wallet Address: {walletAddress}
            </p>

            <button
              onClick={() => onNavigate('markets')}
              className="wallet-btn hard-shadow-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--purple)',
                color: '#FFF',
                borderColor: 'var(--ink)',
                fontWeight: 'bold',
                fontSize: '13px',
              }}
            >
              Go to Markets <ArrowRight size={14} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
