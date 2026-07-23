// Thin wrapper around the browser's injected wallet (MetaMask, OKX Wallet, …).
// Connection only — no contract/staking calls live here.
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function isWalletAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No wallet found — install MetaMask or OKX Wallet.');
  }
  const accounts = (await window.ethereum.request({ method: 'eth_requestAccounts' })) as string[];
  if (!accounts?.[0]) {
    throw new Error('Wallet connection was rejected.');
  }
  return accounts[0];
}

/** Subscribes to the wallet's account switches. Returns an unsubscribe function. */
export function onAccountsChanged(handler: (accounts: string[]) => void): () => void {
  if (!window.ethereum) return () => {};
  const listener = (...args: unknown[]) => handler(args[0] as string[]);
  window.ethereum.on('accountsChanged', listener);
  return () => window.ethereum?.removeListener('accountsChanged', listener);
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
