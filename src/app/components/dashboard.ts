import { Component, OnInit, OnDestroy, signal, effect } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Web3Service } from "../services/web3.service";
import {
  ETH_DECIMALS,
  USDC_DECIMALS,
  USDQ_DECIMALS,
} from "../constants/contract";
import { DepositWithdrawModalComponent } from "./deposit-withdraw-modal";
import { ConvertModalComponent } from "./convert-modal";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, DepositWithdrawModalComponent, ConvertModalComponent],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20"
    >
      <div class="container mx-auto px-4 max-w-6xl">
        <!-- Header -->
        <div class="mb-12">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-12 h-12 bg-gradient-to-br from-cyan-500 via-orange-500 to-red-500 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-xl">qLE</span>
            </div>
            <div>
              <h1 class="text-4xl md:text-5xl font-bold text-white">DeFiniX</h1>
              <p class="text-sm text-orange-400">
                Quantum Virtual Liquidity Engine
              </p>
            </div>
          </div>
          <p class="text-lg text-slate-300">
            Manage your digital assets across multiple chains with advanced
            virtual wallet features
          </p>
        </div>

        <!-- Connection Status -->
        <div class="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-slate-400 text-sm mb-2">Connected Account</p>
              <p class="text-xl font-semibold text-white">
                {{
                  web3Service.isConnected()
                    ? web3Service.getShortAddress(
                        web3Service.connectedAccount() || ""
                      )
                    : "Not Connected"
                }}
              </p>
            </div>
            <button
              (click)="toggleWallet()"
              [disabled]="web3Service.isLoading()"
              class="px-6 py-3 rounded-lg font-semibold transition-all duration-200"
              [ngClass]="{
                'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white':
                  web3Service.isConnected(),
                'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white':
                  !web3Service.isConnected(),
                'opacity-50 cursor-not-allowed': web3Service.isLoading(),
              }"
            >
              {{
                web3Service.isLoading()
                  ? "Processing..."
                  : web3Service.isConnected()
                    ? "Disconnect"
                    : "Connect Wallet"
              }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        @if (web3Service.errorMessage()) {
          <div
            class="mb-8 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200"
          >
            {{ web3Service.errorMessage() }}
          </div>
        }

        @if (web3Service.isConnected()) {
          <!-- Balance Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- USDC Balance -->
            <div
              class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 hover:border-cyan-500 transition-colors"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-slate-300 font-medium">USDC Balance</h3>
                <div
                  class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
                >
                  U
                </div>
              </div>
              <p class="text-3xl font-bold text-white mb-2">
                {{ formatBalance(usdcBalance()) }}
              </p>
              <p class="text-sm text-slate-400">USD Coin</p>
            </div>

            <!-- ETH Balance -->
            <div
              class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 hover:border-purple-500 transition-colors"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-slate-300 font-medium">ETH Balance</h3>
                <div
                  class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold"
                >
                  E
                </div>
              </div>
              <p class="text-3xl font-bold text-white mb-2">
                {{ formatBalance(ethBalance(), ETH_DECIMALS) }}
              </p>
              <p class="text-sm text-slate-400">Ethereum</p>
            </div>

            <!-- Wallet Status -->
            <div
              class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 hover:border-green-500 transition-colors"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-slate-300 font-medium">Wallet Status</h3>
                <div
                  class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <span class="text-white font-bold">✓</span>
                </div>
              </div>
              <p class="text-3xl font-bold text-white mb-2">
                {{ walletExists() ? "Active" : "Inactive" }}
              </p>
              <p class="text-sm text-slate-400">Virtual Wallet</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Create Wallet Button -->
            @if (!walletExists()) {
              <button
                (click)="createWallet()"
                [disabled]="web3Service.isLoading()"
                class="col-span-1 md:col-span-2 p-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{
                  web3Service.isLoading()
                    ? "Creating Wallet..."
                    : "Create Virtual Wallet"
                }}
              </button>
            }

            <!-- Deposit / Withdraw Card -->
            <div
              class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700"
            >
              <h3 class="text-lg font-semibold text-white mb-4">
                Deposit & Withdraw
              </h3>
              <div class="flex flex-col gap-3">
                <button
                  (click)="activeTab.set('deposit')"
                  [ngClass]="{
                    'bg-gradient-to-r from-cyan-500 to-blue-500':
                      activeTab() === 'deposit',
                    'bg-slate-700 hover:bg-slate-600':
                      activeTab() !== 'deposit',
                  }"
                  class="w-full py-3 rounded-lg font-medium text-white transition-colors"
                >
                  Deposit
                </button>
                <button
                  (click)="activeTab.set('withdraw')"
                  [ngClass]="{
                    'bg-gradient-to-r from-orange-500 to-red-500':
                      activeTab() === 'withdraw',
                    'bg-slate-700 hover:bg-slate-600':
                      activeTab() !== 'withdraw',
                  }"
                  class="w-full py-3 rounded-lg font-medium text-white transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>

            <!-- Convert Card -->
            <div
              class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700"
            >
              <h3 class="text-lg font-semibold text-white mb-4">
                Convert Tokens
              </h3>
              <div class="flex flex-col gap-3">
                <button
                  (click)="activeTab.set('convert')"
                  [ngClass]="{
                    'bg-gradient-to-r from-purple-500 to-pink-500':
                      activeTab() === 'convert',
                    'bg-slate-700 hover:bg-slate-600':
                      activeTab() !== 'convert',
                  }"
                  class="w-full py-3 rounded-lg font-medium text-white transition-colors"
                >
                  Exchange Assets
                </button>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div
            class="mt-12 p-6 bg-slate-800 rounded-lg border border-slate-700"
          >
            <h3 class="text-lg font-semibold text-white mb-4">
              Network Information
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p class="text-slate-400">Total Wallets Created</p>
                <p class="text-white font-semibold">{{ totalWallets() }}</p>
              </div>
              <div>
                <p class="text-slate-400">Contract Address</p>
                <p class="text-cyan-400 font-mono text-xs break-all">
                  0x797ADa8...
                </p>
              </div>
              <div>
                <p class="text-slate-400">Network</p>
                <p class="text-white font-semibold">Ethereum</p>
              </div>
            </div>
          </div>
        } @else {
          <!-- Not Connected State -->
          <div class="text-center py-20">
            <div
              class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mb-6"
            >
              <svg
                class="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">
              Connect Your Wallet
            </h2>
            <p class="text-slate-400 mb-8">
              Connect MetaMask or another Web3 wallet to get started
            </p>
            <button
              (click)="toggleWallet()"
              [disabled]="web3Service.isLoading()"
              class="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white transition-all duration-200 disabled:opacity-50"
            >
              Connect Wallet
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  usdcBalance = signal(BigInt(0));
  ethBalance = signal(BigInt(0));
  walletExists = signal(false);
  totalWallets = signal(0n);
  activeTab = signal<"deposit" | "withdraw" | "convert">("deposit");

  ETH_DECIMALS = ETH_DECIMALS;
  USDC_DECIMALS = USDC_DECIMALS;
  USDQ_DECIMALS = USDQ_DECIMALS;

  private refreshInterval: number | null = null;

  constructor(public web3Service: Web3Service) {
    // Auto-refresh balances when account changes
    effect(() => {
      if (this.web3Service.isConnected()) {
        this.loadBalances();
      }
    });
  }

  ngOnInit() {
    this.loadBalances();
    this.loadStats();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  async toggleWallet() {
    if (this.web3Service.isConnected()) {
      this.web3Service.disconnectWallet();
      this.resetBalances();
    } else {
      await this.web3Service.connectWallet();
      this.loadBalances();
      this.loadStats();
    }
  }

  async createWallet() {
    try {
      await this.web3Service.createVirtualWallet();
      await this.loadStats();
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
  }

  private async loadBalances() {
    const account = this.web3Service.connectedAccount();
    if (!account) return;

    try {
      const balances = await this.web3Service.getUserBalances(account);
      this.usdcBalance.set(balances.usdcBalance);
      this.ethBalance.set(balances.ethBalance);
    } catch (error) {
      console.error("Failed to load balances:", error);
    }
  }

  private async loadStats() {
    const account = this.web3Service.connectedAccount();
    if (!account) return;

    try {
      const exists = await this.web3Service.walletExists(account);
      this.walletExists.set(exists);

      const total = await this.web3Service.getTotalWallets();
      this.totalWallets.set(total);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  }

  private startAutoRefresh() {
    this.refreshInterval = window.setInterval(() => {
      if (this.web3Service.isConnected()) {
        this.loadBalances();
      }
    }, 10000); // Refresh every 10 seconds
  }

  private resetBalances() {
    this.usdcBalance.set(BigInt(0));
    this.ethBalance.set(BigInt(0));
    this.walletExists.set(false);
    this.totalWallets.set(0n);
  }

  formatBalance(balance: bigint, decimals: number = 6): string {
    return this.web3Service.formatBalance(balance, decimals);
  }
}
