export type ChainId = 1 | 10 | 8453 | 137;

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  chain: ChainId;
  logo?: string;
}

export const CHAIN_CONFIG: Record<ChainId, { name: string; rpcUrl: string; explorer: string }> = {
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    explorer: 'https://etherscan.io'
  },
  10: {
    name: 'Optimism Mainnet',
    rpcUrl: 'https://opt-mainnet.g.alchemy.com/v2/',
    explorer: 'https://optimistic.etherscan.io'
  },
  8453: {
    name: 'Base Mainnet',
    rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/',
    explorer: 'https://basescan.org'
  },
  137: {
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/',
    explorer: 'https://polygonscan.com'
  }
};

export const SUPPORTED_TOKENS: Token[] = [
  // USDq - OP Mainnet
  {
    address: '0x4b2842f382bfc19f409b1874c0480db3b36199b3',
    symbol: 'USDq',
    decimals: 6,
    name: 'USDq Token',
    chain: 10,
    logo: '💵'
  },
  // USDq - Base Mainnet
  {
    address: '0xbaf56ca7996e8398300d47f055f363882126f369',
    symbol: 'USDq',
    decimals: 6,
    name: 'USDq Token',
    chain: 8453,
    logo: '💵'
  },
  // YLP - Base Mainnet
  {
    address: '0xa2f42a3db5ff5d8ff45baff00dea8b67c36c6d1c',
    symbol: 'YLP',
    decimals: 18,
    name: 'Yield LP Token',
    chain: 8453,
    logo: '📊'
  },
  // YLP - Polygon Mainnet
  {
    address: '0x7332b6e5b80c9dd0cd165132434ffabdbd950612',
    symbol: 'YLP',
    decimals: 18,
    name: 'Yield LP Token',
    chain: 137,
    logo: '📊'
  },
  // YLP - OP Mainnet
  {
    address: '0x25789bbc835a77bc4afa862f638f09b8b8fae201',
    symbol: 'YLP',
    decimals: 18,
    name: 'Yield LP Token',
    chain: 10,
    logo: '📊'
  },
  // YL$ - Polygon Mainnet
  {
    address: '0x80df049656a6efa89327bbc2d159aa393c30e037',
    symbol: 'YL$',
    decimals: 18,
    name: 'Yield Dollar Token',
    chain: 137,
    logo: '💎'
  },
  // YL$ - OP Mainnet
  {
    address: '0xc618101ad5f3a5d924219f225148f8ac1ad74dba',
    symbol: 'YL$',
    decimals: 18,
    name: 'Yield Dollar Token',
    chain: 10,
    logo: '💎'
  }
];

export const USDC_ADDRESSES: Record<ChainId, string> = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Mainnet
  10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', // OP
  8453: '0x833589fCD6eDb6E08f4c7C32D4f71b1566daC625', // Base
  137: '0x2791Bca1f2de4661ED88A30C99a7a9449Aa84174' // Polygon
};

export function getTokensByChain(chainId: ChainId): Token[] {
  return SUPPORTED_TOKENS.filter(token => token.chain === chainId);
}

export function getTokenAddress(symbol: string, chainId: ChainId): string | null {
  const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol && t.chain === chainId);
  return token?.address || null;
}

export function getRpcUrl(chainId: ChainId, apiKey: string): string {
  return CHAIN_CONFIG[chainId].rpcUrl + apiKey;
}

export function getExplorer(chainId: ChainId): string {
  return CHAIN_CONFIG[chainId].explorer;
}
