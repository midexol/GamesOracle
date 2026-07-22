const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GamesOracleEscrow', function () {
  const ONE_USDT = 1_000_000n; // 6 decimals
  const marketId = ethers.keccak256(ethers.toUtf8Bytes('market-1'));

  async function deployFixture() {
    const [deployer, oracle, alice, bob] = await ethers.getSigners();

    const MockUSDT = await ethers.getContractFactory('MockUSDT');
    const usdt = await MockUSDT.deploy();

    const Escrow = await ethers.getContractFactory('GamesOracleEscrow');
    const escrow = await Escrow.deploy(await usdt.getAddress());

    for (const user of [alice, bob]) {
      await usdt.mint(user.address, 1_000n * ONE_USDT);
      await usdt.connect(user).approve(await escrow.getAddress(), ethers.MaxUint256);
    }

    const closeTime = (await ethers.provider.getBlock('latest')).timestamp + 3600;
    await escrow.connect(deployer).createMarket(marketId, 'Jamaica gold, 100m', closeTime, oracle.address);

    return { deployer, oracle, alice, bob, usdt, escrow, closeTime };
  }

  it('creates a market only as owner', async function () {
    const { oracle, alice, escrow } = await deployFixture();
    const otherId = ethers.keccak256(ethers.toUtf8Bytes('market-2'));
    const closeTime = (await ethers.provider.getBlock('latest')).timestamp + 3600;
    await expect(
      escrow.connect(alice).createMarket(otherId, 'nope', closeTime, oracle.address)
    ).to.be.revertedWith('not owner');
  });

  it('accepts stakes on both sides and tracks pools', async function () {
    const { alice, bob, escrow } = await deployFixture();
    await escrow.connect(alice).stake(marketId, true, 100n * ONE_USDT);
    await escrow.connect(bob).stake(marketId, false, 50n * ONE_USDT);

    const m = await escrow.markets(marketId);
    expect(m.yesPool).to.equal(100n * ONE_USDT);
    expect(m.noPool).to.equal(50n * ONE_USDT);
  });

  it('rejects resolution from a non-oracle address', async function () {
    const { alice, escrow } = await deployFixture();
    await expect(escrow.connect(alice).resolveMarket(marketId, true)).to.be.revertedWith('not oracle');
  });

  it('pays winners their stake plus a pro-rata share of the losing pool, minus a 2% fee', async function () {
    const { deployer, oracle, alice, bob, usdt, escrow } = await deployFixture();

    await escrow.connect(alice).stake(marketId, true, 100n * ONE_USDT);
    await escrow.connect(bob).stake(marketId, false, 50n * ONE_USDT);

    await escrow.connect(oracle).resolveMarket(marketId, true);

    const balBefore = await usdt.balanceOf(alice.address);
    const feeRecipientBefore = await usdt.balanceOf(deployer.address);

    await expect(escrow.connect(alice).claimPayout(marketId))
      .to.emit(escrow, 'PayoutClaimed');

    const grossShare = 50n * ONE_USDT; // alice is the sole winner, gets the whole losing pool
    const fee = (grossShare * 200n) / 10_000n;
    const expectedPayout = 100n * ONE_USDT + grossShare - fee;

    expect(await usdt.balanceOf(alice.address)).to.equal(balBefore + expectedPayout);
    expect(await usdt.balanceOf(deployer.address)).to.equal(feeRecipientBefore + fee);
  });

  it('reverts on double claim', async function () {
    const { oracle, alice, bob, escrow } = await deployFixture();
    await escrow.connect(alice).stake(marketId, true, 100n * ONE_USDT);
    await escrow.connect(bob).stake(marketId, false, 50n * ONE_USDT);
    await escrow.connect(oracle).resolveMarket(marketId, true);

    await escrow.connect(alice).claimPayout(marketId);
    await expect(escrow.connect(alice).claimPayout(marketId)).to.be.revertedWith('already claimed');
  });

  it('reverts claiming before resolution', async function () {
    const { alice, escrow } = await deployFixture();
    await escrow.connect(alice).stake(marketId, true, 100n * ONE_USDT);
    await expect(escrow.connect(alice).claimPayout(marketId)).to.be.revertedWith('market not resolved');
  });

  it('reverts claiming with no winning stake', async function () {
    const { oracle, alice, bob, escrow } = await deployFixture();
    await escrow.connect(alice).stake(marketId, true, 100n * ONE_USDT);
    await escrow.connect(bob).stake(marketId, false, 50n * ONE_USDT);
    await escrow.connect(oracle).resolveMarket(marketId, true);

    await expect(escrow.connect(bob).claimPayout(marketId)).to.be.revertedWith('no winning stake');
  });

  it('rejects staking after close time', async function () {
    const { alice, escrow, closeTime } = await deployFixture();
    await ethers.provider.send('evm_setNextBlockTimestamp', [closeTime + 1]);
    await ethers.provider.send('evm_mine', []);
    await expect(escrow.connect(alice).stake(marketId, true, 1n * ONE_USDT)).to.be.revertedWith('market closed');
  });
});
