export const environment = {
  production: false,
  apiKeys: {
    alchemy: "ovF7P49HQUPcSHcMQjg9-", // Replace with your Alchemy API key
    dune: "sim_ENa3Ba3ZTFAuA9LWa0jtmJhd8fMgDaJY", // Replace with your Dune API key
  },
  smartContract: {
    address: "0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D",
  },
  app: {
    name: "DeFiniX",
    description:
      "World's First quantum Virtual Liquidity Engine qLE using virtual wallets and stablecoins",
    version: "1.0.0",
  },
  chains: {
    default: 10, // Optimism
    supported: [1, 10, 8453, 137] as const,
  },
};
