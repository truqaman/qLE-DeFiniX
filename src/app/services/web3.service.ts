import { Injectable, signal } from "@angular/core";
import { BrowserProvider, Contract, ethers, JsonRpcProvider } from "ethers";
import {
  VIRTUAL_WALLET_CONTRACT_ADDRESS,
  VIRTUAL_WALLET_ABI,
} from "../constants/contract";
import {
  CHAIN_CONFIG,
  USDC_ADDRESSES,
  ChainId,
  SUPPORTED_TOKENS,
} from "../constants/tokens";
import { ConfigService } from "./config.service";

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
  providedIn: "root",
})
export class Web3Service {
  private provider: BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: Contract | null = null;
  private readProvider: JsonRpcProvider | null = null;

  // State signals
  connectedAccount = signal<string | null>(null);
  isConnected = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  currentChainId = signal<ChainId | null>(null);
  supportedChains = signal<ChainId[]>([10, 8453, 137, 1]); // OP, Base, Polygon, Ethereum

  constructor() {
    this.initializeReadProvider();
    this.checkWalletConnection();
  }

  private initializeReadProvider() {
    const alchemyKey = environment.apiKeys.alchemy;
    if (alchemyKey) {
      const rpcUrl = `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`;
      this.readProvider = new JsonRpcProvider(rpcUrl);
    }
  }

  private async checkWalletConnection() {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          await this.connectWallet();
        }
      } catch (error) {
        console.log("Wallet not connected");
      }
    }
  }

  async connectWallet(): Promise<string> {
    try {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      if (!window.ethereum) {
        throw new Error("MetaMask not installed");
      }

      this.provider = new BrowserProvider(window.ethereum);
      await this.provider.send("eth_requestAccounts", []);

      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();

      this.contract = new Contract(
        VIRTUAL_WALLET_CONTRACT_ADDRESS,
        VIRTUAL_WALLET_ABI,
        this.signer,
      );

      this.connectedAccount.set(address);
      this.isConnected.set(true);

      return address;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect wallet";
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
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["createVirtualWallet"]();
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create wallet";
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async getUserBalances(address: string): Promise<UserBalance> {
    if (!this.provider) throw new Error("Not connected");

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider,
    );

    try {
      const [usdcBalance, ethBalance] = await (readContract as any)[
        "getUserBalances"
      ](address);
      return { usdcBalance, ethBalance };
    } catch (error) {
      console.error("Error fetching balances:", error);
      return { usdcBalance: BigInt(0), ethBalance: BigInt(0) };
    }
  }

  async getConversionQuote(usdqAmount: bigint) {
    if (!this.provider) throw new Error("Not connected");

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider,
    );

    try {
      const [usdcOutput, minUsdcOutput, ethOutput, minEthOutput] = await (
        readContract as any
      )["getConversionQuote"](usdqAmount);
      return { usdcOutput, minUsdcOutput, ethOutput, minEthOutput };
    } catch (error) {
      console.error("Error fetching conversion quote:", error);
      throw error;
    }
  }

  async convertToETH(
    receiver: string,
    usdqAmount: bigint,
    minOutput: bigint,
  ): Promise<string> {
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["convertToETH"](
        receiver,
        usdqAmount,
        minOutput,
      );
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Conversion failed";
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async convertToUSDC(
    receiver: string,
    usdqAmount: bigint,
    minOutput: bigint,
  ): Promise<string> {
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["convertToUSDC"](
        receiver,
        usdqAmount,
        minOutput,
      );
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Conversion failed";
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
    minOutput: bigint,
  ): Promise<string> {
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["depositToETH"](
        token,
        amount,
        receiver,
        minOutput,
      );
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Deposit failed";
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
    minOutput: bigint,
  ): Promise<string> {
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["depositToUSDC"](
        token,
        amount,
        receiver,
        minOutput,
      );
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Deposit failed";
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async withdrawETH(amount: bigint, minUsdqOutput: bigint): Promise<string> {
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["withdrawETH"](
        amount,
        minUsdqOutput,
      );
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Withdrawal failed";
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async withdrawUSDC(amount: bigint, minUsdqOutput: bigint): Promise<string> {
    if (!this.contract) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const tx = await (this.contract as any)["withdrawUSDC"](
        amount,
        minUsdqOutput,
      );
      const receipt = await tx.wait();
      return receipt?.hash || "";
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Withdrawal failed";
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async walletExists(address: string): Promise<boolean> {
    if (!this.provider) throw new Error("Not connected");

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider,
    );

    try {
      return await (readContract as any)["walletExists"](address);
    } catch (error) {
      console.error("Error checking wallet:", error);
      return false;
    }
  }

  async getTotalWallets(): Promise<bigint> {
    if (!this.provider) throw new Error("Not connected");

    const readContract = new Contract(
      VIRTUAL_WALLET_CONTRACT_ADDRESS,
      VIRTUAL_WALLET_ABI,
      this.provider,
    );

    try {
      return await (readContract as any)["getTotalWallets"]();
    } catch (error) {
      console.error("Error fetching total wallets:", error);
      return BigInt(0);
    }
  }

  formatBalance(balance: bigint, decimals: number = 18): string {
    const divisor = BigInt(10 ** decimals);
    const whole = balance / divisor;
    const remainder = balance % divisor;

    const remainderStr = remainder
      .toString()
      .padStart(decimals, "0")
      .replace(/0+$/, "");
    return remainderStr ? `${whole}.${remainderStr}` : whole.toString();
  }

  parseBalance(amount: string, decimals: number = 18): bigint {
    const [whole, frac = "0"] = amount.split(".");
    const fracPadded = frac.padEnd(decimals, "0");
    return BigInt(whole + fracPadded);
  }

  getShortAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  async switchChain(chainId: ChainId): Promise<void> {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    try {
      this.isLoading.set(true);
      const hexChainId = "0x" + chainId.toString(16);

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }],
      });

      this.currentChainId.set(chainId);
    } catch (error: any) {
      // Chain not added to wallet, add it
      if (error.code === 4902) {
        await this.addChain(chainId);
      } else {
        throw error;
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  private async addChain(chainId: ChainId): Promise<void> {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }

    const chain = CHAIN_CONFIG[chainId];
    const alchemyKey = environment.apiKeys.alchemy;
    const rpcUrl = `${chain.rpcUrl}${alchemyKey}`;

    const chainParams = {
      chainId: "0x" + chainId.toString(16),
      chainName: chain.name,
      rpcUrls: [rpcUrl],
      blockExplorerUrls: [chain.explorer],
      nativeCurrency: {
        name: chainId === 137 ? "MATIC" : "ETH",
        symbol: chainId === 137 ? "MATIC" : "ETH",
        decimals: 18,
      },
    };

    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [chainParams],
      });

      this.currentChainId.set(chainId);
    } catch (error) {
      throw new Error(`Failed to add chain: ${error}`);
    }
  }

  getChainName(chainId: ChainId): string {
    return CHAIN_CONFIG[chainId]?.name || "Unknown Chain";
  }

  getSupportedTokens(chainId: ChainId) {
    return SUPPORTED_TOKENS.filter((token) => token.chain === chainId);
  }

  getUsdcAddress(chainId: ChainId): string {
    return USDC_ADDRESSES[chainId] || "";
  }

  async approveToken(tokenAddress: string, spenderAddress: string, amount: bigint): Promise<string> {
    if (!this.contract || !this.signer) throw new Error("Not connected");

    try {
      this.isLoading.set(true);
      const ERC20_ABI = [
        "function approve(address spender, uint256 amount) public returns (bool)"
      ];

      const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.signer);
      const tx = await (tokenContract as any)["approve"](spenderAddress, amount);
      const receipt = await tx.wait();

      return receipt?.hash || "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Approval failed";
      this.errorMessage.set(message);
      throw error;
    } finally {
      this.isLoading.set(false);
    }
  }

  async checkAllowance(tokenAddress: string, ownerAddress: string, spenderAddress: string): Promise<bigint> {
    if (!this.provider) throw new Error("Not connected");

    try {
      const ERC20_ABI = [
        "function allowance(address owner, address spender) public view returns (uint256)"
      ];

      const readContract = new Contract(tokenAddress, ERC20_ABI, this.provider);
      const allowance = await (readContract as any)["allowance"](ownerAddress, spenderAddress);

      return allowance as bigint;
    } catch (error) {
      console.error("Error checking allowance:", error);
      return BigInt(0);
    }
  }
}
