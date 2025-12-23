import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import {
  createPublicClient,
  http,
  formatEther,
  isAddress,
  parseAbi,
  formatUnits,
} from "viem";
import { base, baseSepolia } from "viem/chains";

type Network = {
  chain: typeof base;
  chainId: number;
  rpc: string;
  explorer: string;
  label: string;
};

const NETWORKS: Network[] = [
  {
    chain: baseSepolia,
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    label: "Base Sepolia",
  },
  {
    chain: base,
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    label: "Base Mainnet",
  },
];

let active = NETWORKS[0];

const sdk = new CoinbaseWalletSDK({
  appName: "Echo Driftwood (Built for Base)",
  appLogoUrl: "https://base.org/favicon.ico",
});

const ERC20_ABI = parseAbi([
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
]);

const out = document.createElement("pre");
out.style.whiteSpace = "pre-wrap";
out.style.background = "#0c1020";
out.style.color = "#e6ecff";
out.style.padding = "16px";
out.style.borderRadius = "12px";
out.style.minHeight = "420px";

function log(lines: string[]) {
  out.textContent = lines.join("\n");
}

function client() {
  return createPublicClient({ chain: active.chain, transport: http(active.rpc) });
}

function asAddr(v: string): `0x${string}` {
  if (!isAddress(v)) throw new Error("Invalid address");
  return v as `0x${string}`;
}

async function connect() {
  const provider = sdk.makeWeb3Provider(active.rpc, active.chainId);
  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("Wallet returned no address");

  const chainHex = (await provider.request({ method: "eth_chainId" })) as string;
  const bal = await client().getBalance({ address: asAddr(address) });

  log([
    "Connection established",
    `Network: ${active.label}`,
    `chainId: ${parseInt(chainHex, 16)}`,
    `Address: ${address}`,
    `ETH balance: ${formatEther(bal)} ETH`,
    `Explorer: ${active.explorer}/address/${address}`,
  ]);
}

async function snapshot() {
  const c = client();
  const [bn, gas, block] = await Promise.all([
    c.getBlockNumber(),
    c.getGasPrice(),
    c.getBlock(),
  ]);

  log([
    "Network snapshot",
    `Network: ${active.label}`,
    `Block number: ${bn}`,
    `Timestamp: ${block.timestamp}`,
    `Gas price (wei): ${gas.toString()}`,
    `Gas used: ${block.gasUsed}`,
    `${active.explorer}/block/${bn}`,
  ]);
}

async function probeAddress(target: string) {
  const a = asAddr(target);
  const [bal, nonce, code] = await Promise.all([
    client().getBalance({ address: a }),
    client().getTransactionCount({ address: a }),
    client().getBytecode({ address: a }),
  ]);

  log([
    "Address probe",
    `Network: ${active.label}`,
    `Address: ${a}`,
    `ETH balance: ${formatEther(bal)} ETH`,
    `Transaction count: ${nonce}`,
    `Contract bytecode present: ${code && code !== "0x" ? "yes" : "no"}`,
    `${active.explorer}/address/${a}`,
  ]);
}

async function probeErc20(token: string, holder: string) {
  const t = asAddr(token);
  const h = asAddr(holder);
  const c = client();

  const [name, symbol, decimals, supply, bal] = await Promise.all([
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "name" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "symbol" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "decimals" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "totalSupply" }),
    c.readContract({ address: t, abi: ERC20_ABI, functionName: "balanceOf", args: [h] }),
  ]);

  const d = Number(decimals);

  log([
    "ERC-20 inspection",
    `Network: ${active.label}`,
    `Token: ${t}`,
    `Holder: ${h}`,
    `Name: ${String(name)}`,
    `Symbol: ${String(symbol)}`,
    `Total supply: ${formatUnits(supply as bigint, d)}`,
    `Holder balance: ${formatUnits(bal as bigint, d)}`,
    `${active.explorer}/address/${t}`,
  ]);
}

function toggle() {
  active = active.chainId === 84532 ? NETWORKS[1] : NETWORKS[0];
  log([`Switched to ${active.label}. Reconnect wallet.`]);
}

function mount() {
  const root = document.createElement("div");
  root.style.maxWidth = "1200px";
  root.style.margin = "24px auto";
  root.style.fontFamily = "system-ui";

  const h1 = document.createElement("h1");
  h1.textContent = "Echo Driftwood";

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.flexWrap = "wrap";
  controls.style.gap = "10px";
  controls.style.marginBottom = "12px";

  function btn(label: string, fn: () => void | Promise<void>) {
    const b = document.createElement("button");
    b.textContent = label;
    b.onclick = () => Promise.resolve(fn()).catch(e => log([String(e)]));
    return b;
  }

  const addrInput = document.createElement("input");
  addrInput.placeholder = "0x… address";
  addrInput.style.minWidth = "420px";

  const tokenInput = document.createElement("input");
  tokenInput.placeholder = "0x… ERC-20 token";

  controls.append(
    btn("Connect Wallet", connect),
    btn("Toggle Network", toggle),
    btn("Snapshot", snapshot),
  );

  root.append(
    h1,
    controls,
    addrInput,
    btn("Probe Address", () => probeAddress(addrInput.value)),
    tokenInput,
    btn("Probe ERC-20", () => probeErc20(tokenInput.value, addrInput.value)),
    out,
  );

  document.body.appendChild(root);
  log(["Ready", `Active network: ${active.label}`, "Read-only mode"]);
}

mount();
