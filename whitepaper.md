# Lumina Core (LMC) Whitepaper# Lumina Core (LMC) — Whitepaper



**Version 1.2**  ## Abstract

**Last Updated: August 17, 2025**

Lumina Core (LMC) is a next-generation ERC20 token ecosystem designed for the Base L2 blockchain. It combines robust tokenomics, a transparent and secure presale mechanism, and advanced smart contract features to deliver a fair, community-driven launch and sustainable long-term growth. This whitepaper outlines the technical architecture, economic model, security features, and operational roadmap for Lumina Core.

---

---

## Abstract

## 1. Introduction

Lumina Core (LMC) is a next-generation, capped-supply ERC20 token ecosystem engineered for the Base Layer 2 (L2) blockchain. This project is founded on the principles of transparency, security, and community-centric growth. Lumina Core combines robust, deflationary tokenomics with a meticulously designed presale mechanism that features built-in refund protection and an automated treasury allocation system. By leveraging the efficiency and low-cost environment of the Base network, LMC aims to deliver a fair, secure, and community-driven launch that establishes a foundation for sustainable long-term value and utility. This whitepaper provides a comprehensive overview of the Lumina Core technical architecture, its economic model, security protocols, operational roadmap, and governance structure.

The rapid evolution of decentralized finance (DeFi) and Layer 2 (L2) solutions has created new opportunities for scalable, low-cost, and secure token ecosystems. Lumina Core leverages the Base L2 network to provide:

---- Low transaction fees and fast settlement

- A capped-supply, utility-driven token

## 1. Introduction- A presale system with built-in refund protection and treasury funding



The landscape of decentralized finance (DeFi) is in a state of constant evolution, with Layer 2 scaling solutions emerging as the critical infrastructure for the next wave of blockchain innovation. These L2 networks address the historical challenges of high transaction fees (gas costs) and network congestion on Layer 1 blockchains like Ethereum, unlocking new possibilities for scalable and user-friendly decentralized applications (dApps).---



Lumina Core is strategically built on Base, an Ethereum L2 incubated by Coinbase, to harness its core advantages: near-zero gas fees, rapid transaction finality, and the institutional-grade security inherited from the Ethereum mainnet. Our mission is to create a token ecosystem that is not only technologically sound but also economically sustainable.## 2. Token Overview



This is achieved through three key pillars:**Token Name:** Lumina Core  

**Symbol:** LMC  

1. **A Capped & Deflationary Token**: The LMC token has a finite total supply and incorporates a burn mechanism, creating a deflationary pressure that is designed to reward long-term holders.**Decimals:** 18  

**Total Supply:** 1,000,000,000 LMC (capped)

2. **A Fair & Secure Launch**: The presale smart contract is engineered for fairness, featuring a soft cap refund guarantee, transparent contribution limits, and an automated treasury skim to ensure the project is funded for future development from day one.

### 2.1. Key Features

3. **Advanced Smart Contract Features**: The LMC token contract integrates modern standards such as EIP-2612 for gasless approvals and pausable functionality for emergency security measures, ensuring both a seamless user experience and a protected ecosystem.- ERC20 Standard with OpenZeppelin security

- Burnable (deflationary mechanism)

---- EIP-2612 Permit (gasless approvals)

- Pausable (emergency control)

## 2. Token Overview & Distribution- Ownable (owner governance)

- Optional fee system (disabled by default)

### 2.1. Core Token Specifications

### 2.2. Supply Distribution

| Parameter | Value |- **Initial Supply:** 100,000,000 LMC (10%) to owner

|-----------|-------|- **Presale Allocation:** 25,000,000 LMC (2.5%)

| Token Name | Lumina Core |- **Future Minting:** 875,000,000 LMC (87.5%)

| Symbol | LMC |

| Blockchain | Base (Chain ID: 8453) |---

| Contract Address | 0x21583587498d054aCE7e4de41cE74BD69b61Ab0A |

| Token Standard | ERC20 |## 3. Presale Mechanism

| Total Supply | 1,000,000,000 LMC (Capped) |

| Decimals | 18 |### 3.1. Presale Parameters

- **Start:** August 15, 2025

### 2.2. Smart Contract Features- **End:** September 14, 2025

- **Rate:** 100,000 LMC per ETH ($0.025 per token at $2,500/ETH)

The LMC token is more than a standard ERC20 token; it is built using OpenZeppelin's rigorously audited and battle-tested libraries and includes several key extensions:- **Soft Cap:** 75 ETH (~$187,500)

- **Hard Cap:** 250 ETH (~$625,000)

- **ERC20Burnable**: Allows tokens to be permanently removed from circulation by holders or the protocol. This is the core of the token's deflationary mechanism.- **Min/Max:** 0.01 ETH / 5 ETH per wallet

- **ERC20Permit (EIP-2612)**: Enables users to approve token spending via an off-chain signature, facilitating gasless approvals and improving the user experience for dApps within the ecosystem.- **Treasury Skim:** 5% of each purchase

- **Pausable**: Grants the contract owner the ability to halt all token transfers in the event of a critical security threat, protecting holders' assets while a solution is implemented.

- **Ownable**: Establishes a clear ownership structure for administrative functions, which will transition to a decentralized governance model over time.### 3.2. Presale Features

- **Capped Supply**: The total supply is programmatically limited to 1,000,000,000 LMC, ensuring no more tokens can ever be minted beyond this cap.- **Automatic Treasury Skim:** 5% of every purchase is sent directly to the treasury

- **Optional Fee System**: The contract contains a dormant fee-on-transfer mechanism, which is disabled by default. This feature could be activated in the future exclusively through a community governance vote to fund ecosystem initiatives like staking rewards or liquidity pool enhancements.- **Refund Protection:** If the soft cap is not met, buyers can claim refunds

- **Claim System:** Tokens are locked until the presale is finalized

### 2.3. Supply Allocation & Minting Strategy- **Owner Controls:** Finalize, sweep unsold tokens, emergency top-up for refunds



The token supply is designed for controlled and strategic release to foster a healthy market and support long-term project growth.---



- **Initial Mint**: 100,000,000 LMC (10% of total supply) is minted to the owner's wallet upon contract deployment. This allocation is designated for initial liquidity provision, strategic partnerships, and marketing efforts.## 4. Technical Architecture

- **Presale Allocation**: 25,000,000 LMC (2.5% of total supply) is allocated to the presale contract to be distributed to early supporters.

- **Future Minting**: The remaining 875,000,000 LMC (87.5% of total supply) is unminted and can only be introduced into circulation by the contract owner, up to the hard cap. This phased approach allows the supply to grow in tandem with the ecosystem's needs and will be governed by community proposals in the future.### 4.1. Smart Contracts

- **UniqueToken.sol:** ERC20 token with burnable, permit, pausable, capped supply, and optional fee

---- **LuminaCorePresaleV2_Skim.sol:** Presale contract with treasury skim, refund protection, and claim system



## 3. Presale Mechanism### 4.2. Security

- Built on OpenZeppelin audited contracts

The Lumina Core presale is managed by a custom smart contract designed for maximum transparency and security.- Reentrancy protection and cap enforcement

- Owner can pause contracts in emergencies

**Presale Contract**: 0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd- All contracts verified and source code published on BaseScan



### 3.1. Presale Parameters---



| Parameter | Value | Details |## 5. Economic Model

|-----------|-------|---------|

| Start Date | August 15, 2025 | |### 5.1. Presale Scenarios

| End Date | September 14, 2025 | Or when the Hard Cap is reached. |- **Soft Cap (75 ETH):** 7.5M LMC sold, 3.75 ETH to treasury

| Presale Rate | 100,000 LMC per ETH | Est. price: $0.04559 per LMC (at $4,559/ETH). |- **Hard Cap (250 ETH):** 25M LMC sold, 12.5 ETH to treasury

| Soft Cap | 75 ETH | Minimum goal for the presale to succeed. |

| Hard Cap | 250 ETH | Maximum amount that can be raised. |### 5.2. Use of Funds

| Min Contribution | 0.01 ETH | Per wallet address. |- **Treasury Skim:** Funds ongoing development and ecosystem growth

| Max Contribution | 5 ETH | Per wallet address. |- **Net Raise:** Used for liquidity, marketing, and future development

| Treasury Skim | 5% | Automatically diverted from each contribution. |

### 5.3. Token Utility

### 3.2. Key Presale Features- Governance and voting (future)

- Access to ecosystem features and rewards

- **Automatic Treasury Skim**: A standout feature where 5% of every incoming ETH contribution is immediately and automatically transferred to the project's treasury wallet. This ensures the project has non-discretionary funding for development, marketing, and operations, regardless of the presale outcome. This mechanism is transparent and verifiable on-chain.- Deflationary via burn mechanism

- **Refund Protection**: If the presale concludes without reaching the Soft Cap of 75 ETH, the contract's refund mechanism is activated. All participants will be able to claim a full refund of their contributed ETH. This eliminates the risk of funds being locked in an underfunded project.

- **Token Claim System**: To ensure an orderly distribution, contributed LMC tokens are locked in the presale contract. After the presale is successfully finalized by the owner (i.e., the Soft Cap is met and the period ends), participants can claim their corresponding LMC tokens.---

- **Owner Controls**: The project owner has limited, necessary administrative functions:

  - `finalize()`: To conclude a successful sale, enabling token claims.## 6. Roadmap

  - `sweepUnsoldTokens()`: To return any unsold LMC from the presale allocation back to the project wallet.

  - `emergencyTopUp()`: To add ETH to the contract only in the unlikely event the contract balance is insufficient for processing refunds, providing an extra layer of security for participants.- **Q3 2025:** Presale launch, community building, contract verification

- **Q4 2025:** Token distribution, DEX listing, ecosystem partnerships

---- **2026+:** Utility expansion, governance launch, ongoing development



## 4. Technical Architecture & Security---



### 4.1. Smart Contracts## 7. Risk Factors



The Lumina Core ecosystem is powered by two primary smart contracts:- **Smart Contract Risk:** Despite audits, bugs may exist

- **Market Risk:** Token price volatility and liquidity

1. **UniqueToken.sol**: The core LMC token contract, compliant with the ERC20 standard and enhanced with OpenZeppelin's Burnable, Permit, Pausable, and Ownable modules. The supply is capped to prevent inflation beyond the defined limit.- **Operational Risk:** Reliance on team and infrastructure

- **Regulatory Risk:** Evolving legal landscape

2. **LuminaCorePresaleV2_Skim.sol**: The presale contract that handles contributions, automated treasury skimming, token locking, and the refund/claim logic. It is designed with reentrancy guards and secure math operations to prevent common attack vectors.

---

### 4.2. Security Posture

## 8. Transparency & Community

Security is the highest priority for Lumina Core. Our approach is multi-faceted:

- All contracts are open source and verified

- **Audited Foundations**: The core logic of our contracts is built upon the industry-standard, heavily audited OpenZeppelin libraries.- Presale is transparent, with on-chain refund protection

- **Reentrancy Protection**: Both contracts incorporate measures to prevent reentrancy attacks, a common vulnerability in smart contracts.- Treasury skim is automatic and auditable

- **On-Chain Verification**: The source code for all deployed contracts is publicly available and verified on BaseScan, allowing for full transparency and public scrutiny.- Community channels: Telegram, Discord, Twitter

- **Emergency Controls**: The Pausable feature in the token contract acts as a critical failsafe, allowing the team to mitigate unforeseen threats in real-time.

---

---

## 9. Contact & Resources

## 5. Economic Model (Tokenomics)

- **Website:** https://luminacore.space

### 5.1. Presale Funding Scenarios- **BaseScan Token:** https://basescan.org/address/0x21583587498d054aCE7e4de41cE74BD69b61Ab0A

- **BaseScan Presale:** https://basescan.org/address/0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd

The presale is structured to ensure project viability at different levels of funding. USD values are based on an ETH price of $4,559 and are subject to market fluctuation.- **Support:** Telegram, Discord, GitHub



- **Soft Cap Reached (75 ETH Raised)**:---

  - LMC Sold: 7,500,000

  - Treasury Skim: 3.75 ETH (~$17,096)## 10. Disclaimer

  - Net Raise for Liquidity/Ops: 71.25 ETH (~$324,844)

This whitepaper is for informational purposes only and does not constitute investment advice. Participation in the presale and use of the Lumina Core token involves risk. Please consult a financial advisor before making investment decisions.

- **Hard Cap Reached (250 ETH Raised)**:

  - LMC Sold: 25,000,000---

  - Treasury Skim: 12.5 ETH (~$56,988)

  - Net Raise for Liquidity/Ops: 237.5 ETH (~$1,082,813)*Last updated: August 17, 2025*

*Network: Base Mainnet (chainId: 8453)*

### 5.2. Use of Funds

Proceeds from the presale and the treasury are allocated to foster growth and build value.

- **Treasury Skim (5%)**: Directly funds ongoing operational expenses, continuous development of the ecosystem, community management, and future audits.
- **Net Raise (95%)**:
  - Liquidity Provision (~50-60%): A significant portion will be used to create a deep and stable liquidity pool on a premier decentralized exchange (DEX) on the Base network.
  - Marketing & Growth (~20-25%): Funds will be dedicated to marketing campaigns, community events, and strategic partnerships to expand awareness and adoption.
  - Future Development (~20-25%): Allocated to a development fund for building out the utility features outlined in the roadmap.

### 5.3. Token Utility

The long-term value of LMC is intrinsically linked to its utility within the Lumina Core ecosystem.

- **Governance**: LMC holders will be able to propose and vote on key protocol decisions, such as activating the fee-on-transfer, allocating treasury funds, and directing future development.
- **Ecosystem Access**: Holding LMC will be a prerequisite for accessing future dApps, premium features, and reward programs developed by the Lumina Core team.
- **Deflationary Mechanism**: The ability to burn LMC tokens, potentially through buy-back-and-burn programs funded by protocol revenue, will continuously reduce the circulating supply, benefiting all holders.

---

## 6. Roadmap

Our roadmap is structured in distinct phases, focusing on building a strong foundation before expanding utility.

### Phase 1: Foundation (Q3 2025)
- ✅ Smart Contract Development & Testing
- ✅ Whitepaper Release
- ✅ Website and Community Channel Launch (Telegram, Discord, Twitter)
- ➡️ LMC Token Presale Launch
- ➡️ Smart Contract Verification on BaseScan
- ➡️ Initial Marketing & Community Building Campaign

### Phase 2: Launch & Growth (Q4 2025)
- ➡️ Presale Finalization & Token Distribution
- ➡️ Initial DEX Offering (IDO) and Liquidity Pool Seeding
- ➡️ Listing on CoinGecko and CoinMarketCap
- ➡️ Formation of Ecosystem Partnerships with other Base projects
- ➡️ Launch of Initial Holder Reward Program

### Phase 3: Utility & Decentralization (2026+)
- ➡️ Development and launch of the first utility dApp
- ➡️ Introduction of the Lumina Core governance portal for on-chain voting
- ➡️ Implementation of a token burn program
- ➡️ Exploration of cross-chain bridges and further ecosystem expansion

---

## 7. Risk Factors

Participation in the Lumina Core ecosystem carries inherent risks, which all participants should understand.

- **Smart Contract Risk**: While our contracts are built on audited libraries and tested, there is always a residual risk of undiscovered vulnerabilities or bugs.
- **Market Risk**: The price and liquidity of the LMC token are subject to high volatility due to market forces, speculative trading, and broader cryptocurrency market trends.
- **Operational Risk**: The project's success is dependent on the continued dedication and execution of the core team and the stability of the underlying Base L2 infrastructure.
- **Regulatory Risk**: The legal and regulatory landscape for digital assets is constantly evolving. Future regulations could impact the project's operations and the utility of the LMC token.

---

## 8. Transparency & Community

Lumina Core is committed to operating with the highest degree of transparency.

- **Open Source**: All smart contracts are open source and verified on-chain.
- **On-Chain Integrity**: The presale mechanics, including the treasury skim and refund protection, are hard-coded into the smart contract and cannot be altered. They function autonomously and transparently.
- **Community Engagement**: We will maintain active and open communication channels on Telegram, Discord, and Twitter to keep the community informed of all progress, challenges, and decisions.

---

## 9. Contact & Resources

- **Website**: https://luminacore.space
- **BaseScan (Token)**: https://basescan.org/address/0x21583587498d054aCE7e4de41cE74BD69b61Ab0A
- **BaseScan (Presale)**: https://basescan.org/address/0xB6fb2aEe7009cDD1a36d84225Fbd76e345eC2acd
- **Community Channels**: [Telegram], [Discord], [Twitter], [GitHub]

---

## 10. Disclaimer

This whitepaper is for informational purposes only and does not constitute an offer to sell, a solicitation of an offer to buy, or a recommendation for any security or financial instrument, nor does it constitute an offer to provide investment advice or services. Participation in the Lumina Core presale and the subsequent buying, selling, or holding of LMC tokens involves substantial risk and may result in the complete loss of invested funds. You should not invest more than you are willing to lose. Please conduct your own due diligence and consult with a qualified financial advisor before making any investment decisions. The project team makes no warranties or representations as to the future success or value of the LMC token.