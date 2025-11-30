export const VIRTUAL_WALLET_CONTRACT_ADDRESS = '0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D';

export const VIRTUAL_WALLET_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_usdqToken', type: 'address' },
      { internalType: 'address', name: '_owner', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [],
    name: 'createVirtualWallet',
    outputs: [{ internalType: 'address', name: 'walletAddress', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserBalances',
    outputs: [
      { internalType: 'uint256', name: 'usdcBalance', type: 'uint256' },
      { internalType: 'uint256', name: 'ethBalance', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'usdqAmount', type: 'uint256' }],
    name: 'getConversionQuote',
    outputs: [
      { internalType: 'uint256', name: 'usdcOutput', type: 'uint256' },
      { internalType: 'uint256', name: 'minUsdcOutput', type: 'uint256' },
      { internalType: 'uint256', name: 'ethOutput', type: 'uint256' },
      { internalType: 'uint256', name: 'minEthOutput', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'usdqAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'minOutput', type: 'uint256' }
    ],
    name: 'convertToETH',
    outputs: [{ internalType: 'uint256', name: 'outputAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'usdqAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'minOutput', type: 'uint256' }
    ],
    name: 'convertToUSDC',
    outputs: [{ internalType: 'uint256', name: 'outputAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'minOutput', type: 'uint256' }
    ],
    name: 'depositToETH',
    outputs: [{ internalType: 'uint256', name: 'outputAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'receiver', type: 'address' },
      { internalType: 'uint256', name: 'minOutput', type: 'uint256' }
    ],
    name: 'depositToUSDC',
    outputs: [{ internalType: 'uint256', name: 'outputAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minUsdqOutput', type: 'uint256' }
    ],
    name: 'withdrawETH',
    outputs: [{ internalType: 'uint256', name: 'usdqAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'minUsdqOutput', type: 'uint256' }
    ],
    name: 'withdrawUSDC',
    outputs: [{ internalType: 'uint256', name: 'usdqAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUSDqBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'wallet', type: 'address' },
      { internalType: 'address', name: 'token', type: 'address' }
    ],
    name: 'getVirtualBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' }
    ],
    name: 'getSpendingCap',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'wallet', type: 'address' }
    ],
    name: 'walletExists',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getTotalWallets',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
];

export const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Ethereum mainnet USDC
export const ETH_DECIMALS = 18;
export const USDC_DECIMALS = 6;
export const USDQ_DECIMALS = 18;
