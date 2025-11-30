import { Injectable, signal } from '@angular/core';
import { BrowserProvider, Contract, ethers, JsonRpcProvider } from 'ethers';
import { VIRTUAL_WALLET_CONTRACT_ADDRESS, VIRTUAL_WALLET_ABI } from '../constants/contract';
import { CHAIN_CONFIG, USDC_ADDRESSES, ChainId, SUPPORTED_TOKENS } from '../constants/tokens';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface UserBalance {
  usdcBalance: bigint;
  ethBalance: bigint;
}

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: Contract | null = null;

  // State signals
  connectedAccount = signal<string | null>(null);
  isConnected = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.checkWalletConnection();
  }

  private async checkWalletConnection() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          await this.connectWallet();
        }
      } catch (error) {
        console.log('Wallet not connected');
      }
    }
  }

  async connectWallet(): Promise<string> {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      if (!window.ethereum) {
        throw new Error('MetaMask not installed');
      }

      this.provider = new BrowserProvider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);

      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();

      this.contract = new Contract(
        VIRTUAL_WALLET_CONTRACT_ADDRESS,
        VIRTUAL_WALLET_ABI,
        this.signer
      );

      this.connectedAccount.set(address);
      this.isConnected.set(true);

      return address;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  disconnectWallet() {
    this.connectedAccount.set(null);
    this.isConnected.set(false);
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async createVirtualWallet(): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['createVirtualWallet']();
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create wallet';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getUserBalances(address: string): Promise<UserBalance> {
    if (!this.provider) throw new Error('Not connected');

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider
    );

    try {
      const [usdcBalance, ethBalance] = await (readContract as any)['getUserBalances'](address);
      return { usdcBalance, ethBalance };
    } catch (error) {
      console.error('Error fetching balances:', error);
      return { usdcBalance: BigInt(0), ethBalance: BigInt(0) };
    }
  }

  async getConversionQuote(usdqAmount: bigint) {
    if (!this.provider) throw new Error('Not connected');

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider
    );

    try {
      const [usdcOutput, minUsdcOutput, ethOutput, minEthOutput] = 
        await (readContract as any)['getConversionQuote'](usdqAmount);
      return { usdcOutput, minUsdcOutput, ethOutput, minEthOutput };
    } catch (error) {
      console.error('Error fetching conversion quote:', error);
      throw error;
    }
  }

  async convertToETH(receiver: string, usdqAmount: bigint, minOutput: bigint): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['convertToETH'](receiver, usdqAmount, minOutput);
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conversion failed';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async convertToUSDC(receiver: string, usdqAmount: bigint, minOutput: bigint): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['convertToUSDC'](receiver, usdqAmount, minOutput);
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conversion failed';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async depositToETH(
    token: string,
    amount: bigint,
    receiver: string,
    minOutput: bigint
  ): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['depositToETH'](token, amount, receiver, minOutput);
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Deposit failed';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async depositToUSDC(
    token: string,
    amount: bigint,
    receiver: string,
    minOutput: bigint
  ): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['depositToUSDC'](token, amount, receiver, minOutput);
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Deposit failed';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async withdrawETH(amount: bigint, minUsdqOutput: bigint): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['withdrawETH'](amount, minUsdqOutput);
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Withdrawal failed';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async withdrawUSDC(amount: bigint, minUsdqOutput: bigint): Promise<string> {
    if (!this.contract) throw new Error('Not connected');

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)['withdrawUSDC'](amount, minUsdqOutput);
      const receipt = await tx.wait();
      return receipt?.hash || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Withdrawal failed';
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async walletExists(address: string): Promise<boolean> {
    if (!this.provider) throw new Error('Not connected');

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider
    );

    try {
      return await (readContract as any)['walletExists'](address);
    } catch (error) {
      console.error('Error checking wallet:', error);
      return false;
    }
  }

  async getTotalWallets(): Promise<bigint> {
    if (!this.provider) throw new Error('Not connected');

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider
    );

    try {
      return await (readContract as any)['getTotalWallets']();
    } catch (error) {
      console.error('Error fetching total wallets:', error);
      return BigInt(0);
    }
  }

  formatBalance(balance: bigint, decimals: number = 18): string {
    const divisor = BigInt(10 ** decimals);
    const whole = balance / divisor;
    const remainder = balance % divisor;

    const remainderStr = remainder.toString().padStart(decimals, '0').replace(/0+$/, '');
    return remainderStr ? `${whole}.${remainderStr}` : whole.toString();
  }

  parseBalance(amount: string, decimals: number = 18): bigint {
    const [whole, frac = '0'] = amount.split('.');
    const fracPadded = frac.padEnd(decimals, '0');
    return BigInt(whole + fracPadded);
  }

  getShortAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
