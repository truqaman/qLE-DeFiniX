export const environment = {
  production: true,
  apiKeys: {
    alchemy: process.env['ALCHEMY_API_KEY'] || '',
    dune: process.env['DUNE_API_KEY'] || '',
  },
  smartContract: {
    address: '0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D',
  },
  app: {
    name: 'DeFiniX',
    description: "World's First quantum Virtual Liquidity Engine qLE using virtual wallets and stablecoins",
    version: '1.0.0',
  },
  chains: {
    default: 10, // Optimism
    supported: [1, 10, 8453, 137] as const,
  }
};
