require('@nomicfoundation/hardhat-toolbox');
require('dotenv/config');

// Local `hardhat` network works with zero config (chainId 31337).
//
// The X Layer testnet's RPC URL / chain ID are NOT hardcoded here — public
// sources disagree on the current values (an older testnet, chain 195, is
// marked deprecated on chainlist; a newer one shows chain 1952 elsewhere).
// Confirm the current values from your OKX Wallet's network list or the
// live X Layer docs, then set them in contracts/.env before deploying.
const XLAYER_TESTNET_RPC_URL = process.env.XLAYER_TESTNET_RPC_URL || '';
const XLAYER_TESTNET_CHAIN_ID = process.env.XLAYER_TESTNET_CHAIN_ID
  ? Number(process.env.XLAYER_TESTNET_CHAIN_ID)
  : undefined;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    ...(XLAYER_TESTNET_RPC_URL && PRIVATE_KEY
      ? {
          xlayerTestnet: {
            url: XLAYER_TESTNET_RPC_URL,
            chainId: XLAYER_TESTNET_CHAIN_ID,
            accounts: [PRIVATE_KEY],
          },
        }
      : {}),
  },
};
