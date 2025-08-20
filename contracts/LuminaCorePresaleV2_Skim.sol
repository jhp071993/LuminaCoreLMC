// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
}

contract LuminaCorePresaleV2_Skim {
    // ---- Immutable config ----
    IERC20  public immutable token;
    address public immutable treasury;
    uint64  public immutable startTime;
    uint64  public immutable endTime;
    uint256 public immutable softCap;           // wei
    uint256 public immutable hardCap;           // wei
    uint256 public immutable minContribution;   // wei
    uint256 public immutable maxContribution;   // wei
    uint256 public immutable ratePerWei;        // tokens per wei
    uint16  public immutable skimBps;           // e.g., 300 = 3%, max 1000 in constructor

    // ---- State ----
    address public owner;
    bool    public finalized;
    bool    public softCapMet;
    uint256 public totalRaised;                 // full gross (before skim)
    mapping(address => uint256) public contributed;
    mapping(address => uint256) public claimed;

    // ---- Events ----
    event Buy(address indexed user, uint256 grossWei, uint256 skimWei, uint256 escrowWei, uint256 tokens);
    event Finalized(bool success);
    event Refund(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 tokens);
    event OwnerTopUp(uint256 amount);
    event OwnershipTransferred(address indexed oldOwner, address indexed newOwner);

    // ---- Errors ----
    error NotOwner();
    error SaleNotLive();
    error SaleLive();
    error FinalizedAlready();
    error CapExceeded();
    error UnderMin();
    error OverMax();
    error SoftCapNotMet();
    error NothingToClaim();
    error NothingToRefund();
    error TopUpRequired(uint256 shortfall);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(
        address _token,
        address _treasury,
        uint64 _start,
        uint64 _end,
        uint256 _ratePerWei,
        uint256 _softCapWei,
        uint256 _hardCapWei,
        uint256 _minBuyWei,
        uint256 _maxBuyWei,
        uint16  _skimBps             // new param
    ) {
        require(_token != address(0) && _treasury != address(0), "zero addr");
        require(_start < _end, "bad time");
        require(_softCapWei <= _hardCapWei, "soft>hard");
        require(_ratePerWei > 0, "rate=0");
        require(_maxBuyWei == 0 || _maxBuyWei >= _minBuyWei, "max<min");
        require(_skimBps <= 1000, "skim too high"); // cap at 10% for sanity

        owner = msg.sender;
        token = IERC20(_token);
        treasury = _treasury;
        startTime = _start;
        endTime = _end;
        ratePerWei = _ratePerWei;
        softCap = _softCapWei;
        hardCap = _hardCapWei;
        minContribution = _minBuyWei;
        maxContribution = _maxBuyWei;
        skimBps = _skimBps;
    }

    // -------- Views --------
    function live() public view returns (bool) {
        return block.timestamp >= startTime && block.timestamp < endTime && !finalized;
    }

    function tokensFor(address user) public view returns (uint256) {
        return contributed[user] * ratePerWei;
    }

    function neededTopUpForRefunds() public view returns (uint256) {
        // On failure, full gross must be refundable.
        // Shortfall = totalRaised - contractBalance (can’t be negative)
        uint256 bal = address(this).balance;
        return totalRaised > bal ? (totalRaised - bal) : 0;
    }

    // -------- Core flow --------
    receive() external payable { buy(); }

    function buy() public payable {
        if (!live()) revert SaleNotLive();
        uint256 gross = msg.value;
        uint256 newTotal = totalRaised + gross;
        if (newTotal > hardCap) revert CapExceeded();

        if (gross < minContribution) revert UnderMin();
        if (maxContribution > 0 && contributed[msg.sender] + gross > maxContribution) revert OverMax();

        // record first (so state reflects the full gross)
        contributed[msg.sender] += gross;
        totalRaised = newTotal;

        // latch soft cap
        if (!softCapMet && totalRaised >= softCap) softCapMet = true;

        // skim + escrow
        uint256 skim = (gross * skimBps) / 10_000;
        uint256 escrow = gross - skim;

        if (skim > 0) {
            (bool ok, ) = payable(treasury).call{value: skim}("");
            require(ok, "skim xfer failed");
        }

        emit Buy(msg.sender, gross, skim, escrow, gross * ratePerWei);
    }

    function finalize() external {
        if (finalized) revert FinalizedAlready();
        if (block.timestamp < endTime) revert SaleLive();

        finalized = true;
        if (!softCapMet && totalRaised >= softCap) softCapMet = true;

        // If failed sale, enforce full-refund solvency now.
        if (!softCapMet) {
            uint256 shortfall = neededTopUpForRefunds();
            if (shortfall > 0) revert TopUpRequired(shortfall);
        }
        emit Finalized(softCapMet);
    }

    // Owner can top up anytime (especially if finalize() fails due to shortfall)
    function topUpForRefunds() external payable onlyOwner {
        emit OwnerTopUp(msg.value);
    }

    // Success path: users claim tokens
    function claim() external {
        if (!finalized || !softCapMet) revert SoftCapNotMet();
        uint256 owed = tokensFor(msg.sender);
        uint256 already = claimed[msg.sender];
        if (owed <= already) revert NothingToClaim();

        uint256 toSend = owed - already;
        claimed[msg.sender] = owed;
        require(token.transfer(msg.sender, toSend), "token xfer fail");
        emit Claim(msg.sender, toSend);
    }

    // Failure path: users refund full gross
    function refund() external {
        if (!finalized || softCapMet) revert NothingToRefund();

        uint256 paid = contributed[msg.sender];
        if (paid == 0) revert NothingToRefund();

        contributed[msg.sender] = 0;
        (bool ok, ) = payable(msg.sender).call{value: paid}("");
        require(ok, "refund failed");
        emit Refund(msg.sender, paid);
    }

    // Tokens sweep after success (optional)
    function sweepLeftoverTokens(address to) external onlyOwner {
        require(finalized && softCapMet, "not success");
        uint256 bal = token.balanceOf(address(this));
        require(token.transfer(to, bal), "xfer fail");
    }

    // Ownership
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "zero");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
