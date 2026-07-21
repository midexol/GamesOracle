import React from 'react';
import { Terminal, Shield, Cpu } from 'lucide-react';

export default function ApiDocs(): React.ReactElement {
  const getMarketsJson = `{
  "name": "get_markets",
  "description": "Lists all open or resolved prediction markets for the Glasgow 2026 Games",
  "input_schema": {
    "type": "object",
    "properties": {
      "status": { "type": "string", "enum": ["open", "resolved"], "default": "open" },
      "sport": { "type": "string", "description": "Filter by discipline, e.g. Athletics" }
    }
  }
}`;

  const getForecastJson = `{
  "name": "get_forecast",
  "description": "Exposes structured forecast probabilities, confidence metrics, and post-mortems",
  "input_schema": {
    "type": "object",
    "properties": {
      "market_id": { "type": "string", "description": "The unique market ID, e.g. market-1" }
    },
    "required": ["market_id"]
  }
}`;

  const createMarketJson = `{
  "name": "create_market",
  "description": "Bespoke market generation. Prompts the oracle to ingest a custom schedule and file an escrow target",
  "input_schema": {
    "type": "object",
    "properties": {
      "sport": { "type": "string", "description": "e.g. Netball" },
      "question": { "type": "string", "description": "e.g. Nigeria to win group stage matches" },
      "close_time": { "type": "string", "description": "Unix timestamp format" }
    },
    "required": ["sport", "question", "close_time"]
  }
}`;

  return (
    <div className="wrap fade-in" style={{ paddingBottom: '80px' }}>
      <div className="col-head">
        <h2>MCP Integration &amp; API Reference</h2>
        <span className="sub">AGENT-TO-MCP PROTOCOL INTERFACE</span>
      </div>

      <div style={{ fontSize: '14px', margin: '10px 0 24px', fontStyle: 'italic', color: 'var(--muted)' }}>
        GamesOracle AI is built as a standardized Agent Service Provider (ASP). Other autonomous 
        software agents can connect, consume structured sports forecasts, and file prediction markets 
        on-chain via our Model Context Protocol (MCP) interface.
      </div>

      {/* Technical Highlights */}
      <div className="masthead-stat" style={{ marginBottom: '32px' }}>
        <div className="stat-block">
          <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={12} style={{ color: 'var(--purple)' }} />
            Protocol Type
          </div>
          <div className="num" style={{ fontSize: '24px' }}>MCP v1.0</div>
          <div className="desc" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
            JSON-RPC 2.0 over standard I/O / SSE channels
          </div>
        </div>
        <div className="stat-block">
          <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={12} style={{ color: 'var(--purple)' }} />
            Monetization Header
          </div>
          <div className="num" style={{ fontSize: '24px' }}>x402 protocol</div>
          <div className="desc" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
            Micropayments per custom forecast creation
          </div>
        </div>
        <div className="stat-block">
          <div className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={12} style={{ color: 'var(--purple)' }} />
            Escrow Network
          </div>
          <div className="num" style={{ fontSize: '24px' }}>X Layer EVM</div>
          <div className="desc" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
            Testnet contract: `0x6F…4A91`
          </div>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="whitepaper-grid" style={{ gridTemplateColumns: '1fr' }}>
        
        {/* Section 1: Connection */}
        <div className="side-card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--ink)', background: 'var(--paper-2)' }}>
          <h3 className="display" style={{ margin: '0 0 10px', fontSize: '20px' }}>1. Connecting as an Agent</h3>
          <p style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
            Register the GamesOracle MCP Server in your agent environment configuration. The server runs as 
            a Node/Python service connecting directly to our oracle engine.
          </p>
          <pre className="mono" style={{ fontSize: '11.5px', background: 'var(--paper)', padding: '14px', border: '1px solid var(--rule)', overflowX: 'auto' }}>
{`{
  "mcpServers": {
    "games-oracle": {
      "command": "npx",
      "args": ["-y", "@gamesoracle/mcp-server"],
      "env": {
        "GAMES_ORACLE_API_KEY": "your_okx_ai_portal_key"
      }
    }
  }
}`}
          </pre>
        </div>

        {/* Section 2: Tool Schemas */}
        <div className="side-card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--ink)', background: 'var(--paper-2)' }}>
          <h3 className="display" style={{ margin: '0 0 14px', fontSize: '20px' }}>2. Exposed MCP Tool Schemas</h3>
          
          <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 6px', color: 'var(--purple)' }}>2.1 get_markets</h4>
          <pre className="mono" style={{ fontSize: '11.5px', background: 'var(--paper)', padding: '14px', border: '1px solid var(--rule)', overflowX: 'auto' }}>
            {getMarketsJson}
          </pre>

          <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 6px', color: 'var(--purple)' }}>2.2 get_forecast</h4>
          <pre className="mono" style={{ fontSize: '11.5px', background: 'var(--paper)', padding: '14px', border: '1px solid var(--rule)', overflowX: 'auto' }}>
            {getForecastJson}
          </pre>

          <h4 className="mono" style={{ fontSize: '13px', margin: '20px 0 6px', color: 'var(--purple)' }}>2.3 create_market</h4>
          <pre className="mono" style={{ fontSize: '11.5px', background: 'var(--paper)', padding: '14px', border: '1px solid var(--rule)', overflowX: 'auto' }}>
            {createMarketJson}
          </pre>
        </div>

        {/* Section 3: x402 Micropayments */}
        <div className="side-card" style={{ padding: '24px', border: '1px solid var(--ink)', background: 'var(--paper-2)' }}>
          <h3 className="display" style={{ margin: '0 0 10px', fontSize: '20px' }}>3. The x402 Billing Protocol</h3>
          <p style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
            Requests to `create_market` or pull premium forecasts from the oracle resolve over standard 
            HTTP 402 tunnels. The server responds with metadata specifying the price. The consuming agent's wallet 
            submits payment instantly via a lightning channel or an EVM micropayment path on X Layer before terms are returned.
          </p>
          <pre className="mono" style={{ fontSize: '11.5px', background: 'var(--paper)', padding: '14px', border: '1px solid var(--rule)', overflowX: 'auto' }}>
{`HTTP/1.1 402 Payment Required
X-USDT-Price: 0.15
X-Payment-Address: 0x6F25...4A91
X-Payment-Chain: 196 (X Layer Mainnet)`}
          </pre>
        </div>

      </div>
    </div>
  );
}
