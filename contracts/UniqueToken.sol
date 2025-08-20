// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 * Lumina Core (LMC) — ERC20 for L2:
 * - ERC20 + Burnable
 * - ERC20Permit (EIP-2612) for gasless approvals
 * - Pausable (owner can pause transfers in emergencies)
 * - Capped supply via "cap" guard in mint
 * - Optional fee (bps) with exemptions; off by default
 * - Ownable set to deployer, recommend transferring to a Safe multisig
 *
 * OpenZeppelin v5.x
 */

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract UniqueToken is ERC20, ERC20Burnable, ERC20Permit, Ownable, Pausable {
    uint256 public immutable cap;

    // Fee config (basis points: 100 bps = 1%). Disabled by default.
    uint16 public feeBps; // e.g., 30 = 0.30%
    address public feeRecipient;
    bool public feeEnabled;
    mapping(address => bool) public isFeeExempt;

    error CapExceeded();
    error InvalidRecipient();
    error BpsTooHigh();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,  // in wei units (include 18 decimals if you use 18)
        uint256 cap_,           // total maximum supply
        address owner_
    )
        ERC20(name_, symbol_)
        ERC20Permit(name_)
        Ownable(owner_)
    {
        require(cap_ > 0, "cap=0");
        require(initialSupply <= cap_, "initial > cap");
        cap = cap_;
        feeRecipient = owner_;
        isFeeExempt[owner_] = true;

        if (initialSupply > 0) {
            _mint(owner_, initialSupply);
        }
    }

    // ---- Owner controls ----

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function setFeeConfig(
        bool enabled,
        uint16 bps,
        address recipient
    ) external onlyOwner {
        if (recipient == address(0)) revert InvalidRecipient();
        // cap the maximum fee for predictability; adjust if you like
        if (bps > 100) revert BpsTooHigh(); // <=1.00%
        feeEnabled = enabled;
        feeBps = bps;
        feeRecipient = recipient;
    }

    function setFeeExempt(address account, bool exempt) external onlyOwner {
        isFeeExempt[account] = exempt;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > cap) revert CapExceeded();
        _mint(to, amount);
    }

    // ---- Internals ----

    // OpenZeppelin v5 uses _update for balance changes (mint/transfer/burn).
    function _update(address from, address to, uint256 value) internal override {
        if (paused()) {
            // Allow minting/burning while paused? Usually no.
            // This blocks all transfers including mint/burn during pause:
            if (from != address(0) || to != address(0)) {
                revert("Pausable: paused");
            }
        }

        // Apply fee only on regular transfers (not mint/burn)
        if (
            feeEnabled &&
            feeBps > 0 &&
            from != address(0) &&
            to != address(0) &&
            !isFeeExempt[from] &&
            !isFeeExempt[to]
        ) {
            uint256 fee = (value * feeBps) / 10_000;
            uint256 sendAmount = value - fee;
            super._update(from, feeRecipient, fee);
            super._update(from, to, sendAmount);
        } else {
            super._update(from, to, value);
        }
    }
}
