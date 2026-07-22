// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title GamesOracleEscrow
/// @notice Peer-to-peer YES/NO staking escrow for GamesOracle AI prediction markets.
///         Each market is resolved by a single trusted oracle address (set at
///         creation time) — there is no on-chain dispute mechanism.
contract GamesOracleEscrow {
    using SafeERC20 for IERC20;

    enum Status {
        None,
        Open,
        Resolved
    }

    struct MarketInfo {
        string question;
        uint256 closeTime;
        Status status;
        bool outcome;
        uint256 yesPool;
        uint256 noPool;
        address oracle;
    }

    uint256 public constant FEE_BPS = 200; // 2%
    uint256 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable stakeToken;
    address public owner;

    mapping(bytes32 => MarketInfo) public markets;
    mapping(bytes32 => mapping(address => uint256)) public yesStakes;
    mapping(bytes32 => mapping(address => uint256)) public noStakes;
    mapping(bytes32 => mapping(address => bool)) public claimed;

    event MarketCreated(bytes32 indexed marketId, string question, uint256 closeTime, address oracle);
    event Staked(bytes32 indexed marketId, address indexed user, bool yes, uint256 amount);
    event MarketResolved(bytes32 indexed marketId, bool outcome);
    event PayoutClaimed(bytes32 indexed marketId, address indexed user, uint256 amount);
    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address stakeToken_) {
        require(stakeToken_ != address(0), "zero stake token");
        owner = msg.sender;
        stakeToken = IERC20(stakeToken_);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function createMarket(
        bytes32 marketId,
        string calldata question,
        uint256 closeTime,
        address oracle
    ) external onlyOwner {
        require(markets[marketId].status == Status.None, "market exists");
        require(oracle != address(0), "zero oracle");
        require(closeTime > block.timestamp, "closeTime in past");

        markets[marketId] = MarketInfo({
            question: question,
            closeTime: closeTime,
            status: Status.Open,
            outcome: false,
            yesPool: 0,
            noPool: 0,
            oracle: oracle
        });

        emit MarketCreated(marketId, question, closeTime, oracle);
    }

    function stake(bytes32 marketId, bool yes, uint256 amount) external {
        MarketInfo storage m = markets[marketId];
        require(m.status == Status.Open, "market not open");
        require(block.timestamp < m.closeTime, "market closed");
        require(amount > 0, "zero amount");

        stakeToken.safeTransferFrom(msg.sender, address(this), amount);

        if (yes) {
            yesStakes[marketId][msg.sender] += amount;
            m.yesPool += amount;
        } else {
            noStakes[marketId][msg.sender] += amount;
            m.noPool += amount;
        }

        emit Staked(marketId, msg.sender, yes, amount);
    }

    function resolveMarket(bytes32 marketId, bool outcome) external {
        MarketInfo storage m = markets[marketId];
        require(m.status == Status.Open, "market not open");
        require(msg.sender == m.oracle, "not oracle");

        m.status = Status.Resolved;
        m.outcome = outcome;

        emit MarketResolved(marketId, outcome);
    }

    function claimPayout(bytes32 marketId) external {
        MarketInfo storage m = markets[marketId];
        require(m.status == Status.Resolved, "market not resolved");
        require(!claimed[marketId][msg.sender], "already claimed");

        uint256 winningStake = m.outcome ? yesStakes[marketId][msg.sender] : noStakes[marketId][msg.sender];
        require(winningStake > 0, "no winning stake");

        uint256 winningPool = m.outcome ? m.yesPool : m.noPool;
        uint256 losingPool = m.outcome ? m.noPool : m.yesPool;

        // Checks-effects-interactions: mark claimed before any external transfer.
        claimed[marketId][msg.sender] = true;

        uint256 grossShare = (losingPool * winningStake) / winningPool;
        uint256 fee = (grossShare * FEE_BPS) / BPS_DENOMINATOR;
        uint256 payout = winningStake + grossShare - fee;

        stakeToken.safeTransfer(msg.sender, payout);
        if (fee > 0) {
            stakeToken.safeTransfer(owner, fee);
        }

        emit PayoutClaimed(marketId, msg.sender, payout);
    }
}
