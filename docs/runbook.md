# Echo Driftwood — Runbook

Lightweight operational guide for testnet validation and verification.

---

## Purpose

This runbook documents the **minimum steps** required to validate changes against
Base networks before merging or releasing.

---

## Testnet Validation (Base Sepolia)

1. Select **Base Sepolia** as the active network.
2. Run read-only probes (balances, token metadata).
3. Confirm RPC connectivity using the default endpoint.
4. Temporarily switch to a fallback RPC to ensure resilience.

Checklist:
- [ ] App loads without errors
- [ ] Read-only calls succeed
- [ ] No hardcoded chain IDs or RPC URLs
- [ ] Network selection comes from config

---

## Explorer Verification

For any transaction hash or address:
- Verify links open on **BaseScan Sepolia**
- Confirm chain ID is `84532`
- Ensure explorer URLs are derived from config

Checklist:
- [ ] Correct explorer domain
- [ ] Correct network context
- [ ] No mixed mainnet/testnet links

---

## Pre-Merge Notes

- Always validate on **Sepolia first**
- Avoid assumptions about wallet type (EOA vs smart account)
- Treat config changes as higher risk than UI changes

_Last updated: initial scaffold_
