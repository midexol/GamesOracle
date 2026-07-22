const { ethers } = require('hardhat');

// Mirrors the seed markets in server/store.js so the frontend demo has
// something real to stake against out of the box.
const SEED_MARKETS = [
  { id: 'market-1', question: "Jamaica gold, Women's 100m" },
  { id: 'market-2', question: 'Australia, 2+ golds Day 2' },
];

const ONE_USDT = 1_000_000n; // 6 decimals
const CLOSE_IN_SECONDS = 7 * 24 * 3600;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deployer / oracle:', deployer.address);

  const MockUSDT = await ethers.getContractFactory('MockUSDT');
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log('MockUSDT deployed:', await usdt.getAddress());

  const Escrow = await ethers.getContractFactory('GamesOracleEscrow');
  const escrow = await Escrow.deploy(await usdt.getAddress());
  await escrow.waitForDeployment();
  console.log('GamesOracleEscrow deployed:', await escrow.getAddress());

  const closeTime = Math.floor(Date.now() / 1000) + CLOSE_IN_SECONDS;
  for (const market of SEED_MARKETS) {
    const marketId = ethers.keccak256(ethers.toUtf8Bytes(market.id));
    const tx = await escrow.createMarket(marketId, market.question, closeTime, deployer.address);
    await tx.wait();
    console.log(`Seeded market "${market.id}" -> ${marketId}`);
  }

  // Fund the local/test signers so staking can be exercised immediately.
  const signers = await ethers.getSigners();
  for (const signer of signers.slice(0, 5)) {
    await (await usdt.mint(signer.address, 10_000n * ONE_USDT)).wait();
  }
  console.log('Minted 10,000 test USDT0 to the first 5 signers.');

  console.log('\nSet these in your root .env:');
  console.log(`CONTRACT_ADDRESS=${await escrow.getAddress()}`);
  console.log(`USDT0_ADDRESS=${await usdt.getAddress()}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
