# Echo Driftwood

Echo Driftwood is a developer-oriented Base utility that focuses on clarity and verification. It connects a Coinbase Wallet, checks Base network identity, and exposes public blockchain state through structured, read-only probes.

---

## What this repository is for

This project exists to provide a simple but expressive surface for Base inspection tasks. It favors transparency over abstraction and is suitable for debugging, demos, and tooling validation.

Typical use cases include:
- Verifying Base chainId responses  
- Inspecting ETH balances and transaction counts  
- Checking whether an address contains contract bytecode  
- Reading ERC-20 metadata and balances  
- Jumping directly to Basescan for confirmation  

---

## Repository layout

- app/echo-driftwood.ts  
  Browser-based entry point implementing wallet connection and RPC probes.

- docs/runbook.md  
  Lightweight operational guide for testnet validation and verification steps.

- config/base.networks.json  
  Static description of supported Base networks and explorers.

- scripts/example-probes.json  
  Sample addresses and tokens used during manual testing.

- contracts/  
  Solidity contracts deployed to Base Sepolia for testnet validation:
  - base_contract.sol — minimal deployment verification contract  
  - array_contract.sol — simple stateful interaction contract  

- package.json  
  Dependency manifest referencing Base and Coinbase repositories.

- README.md  
  Primary technical documentation.

---

## Network targets

Base Mainnet  
chainId (decimal): 8453  
Explorer: https://basescan.org  

Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

---

## Tooling notes

Echo Driftwood pulls directly from official ecosystems:
- Coinbase Wallet SDK for EIP-1193 wallet access  
- OnchainKit references for Base-native primitives  
- viem for typed, read-only RPC communication  
- Multiple Base and Coinbase GitHub repositories for ecosystem alignment  

---

## License

MIT License

Copyright (c) 2025 YOUR_NAME

---

## Author socials

GitHub: https://github.com/caliph-witless0h 
Email: caliph-witless0h@icloud.com 

---

## Testnet Deployment (Base Sepolia)

As part of pre-production validation, one or more contracts may be deployed to the Base Sepolia test network to confirm correct behavior and tooling compatibility.

Network: Base Sepolia  
chainId (decimal): 84532  
Explorer: https://sepolia.basescan.org  

Contract base_contract address:  
0x96334b76159f65484d7a771bb1ed07a7dbeb318d 

Deployment and verification:
- https://sepolia.basescan.org/address/0x96334b76159f65484d7a771bb1ed07a7dbeb318d 
- https://sepolia.basescan.org/0x96334b76159f65484d7a771bb1ed07a7dbeb318d /0#code  

Contract array_contract address:  
0x21a61e48263d41dfe595a421f07002ddacd516e8

Deployment and verification:
- https://sepolia.basescan.org/address/0x21a61e48263d41dfe595a421f07002ddacd516e8
- https://sepolia.basescan.org/0x21a61e48263d41dfe595a421f07002ddacd516e8/0#code  

These testnet deployments provide a controlled environment for validating Base tooling, account abstraction flows, and read-only onchain interactions prior to Base Mainnet usage.
