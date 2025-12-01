import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Web3Service } from '../services/web3.service';
import { SUPPORTED_TOKENS } from '../constants/tokens';

@Component({
  selector: 'app-deposit-withdraw-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="closeModal()">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-white">
            {{ mode === 'deposit' ? 'Deposit Tokens' : 'Withdraw Tokens' }}
          </h2>
          <button
            (click)="closeModal()"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Token Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Token to {{ mode() === 'deposit' ? 'Deposit' : 'Withdraw' }}
            </label>
            <select
              [(ngModel)]="selectedToken"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none transition-colors"
            >
              <option value="">Select a token</option>
              <option *ngFor="let token of availableTokens()" [value]="token.symbol">
                {{ token.symbol }} ({{ token.name }})
              </option>
            </select>
          </div>

          <!-- Amount Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Amount
            </label>
            <div class="relative">
              <input
                type="number"
                [(ngModel)]="amount"
                placeholder="0.00"
                class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
              />
              <button
                (click)="setMaxAmount()"
                class="absolute right-3 top-3 text-orange-400 hover:text-orange-300 text-sm font-medium"
              >
                MAX
              </button>
            </div>
          </div>

          <!-- Min Output (for deposits) -->
          <div *ngIf="mode() === 'deposit'">
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Minimum Output (with slippage)
            </label>
            <input
              type="number"
              [(ngModel)]="minOutput"
              placeholder="0.00"
              class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none transition-colors"
            />
            <p class="text-xs text-slate-400 mt-2">Protects against price slippage</p>
          </div>

          <!-- Rate Info -->
          <div class="bg-slate-700/50 rounded-lg p-4">
            <div class="flex justify-between text-sm mb-2">
              <span class="text-slate-400">Balance:</span>
              <span class="text-white font-semibold">{{ displayBalance() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Fee:</span>
              <span class="text-white font-semibold">0.1%</span>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage()" class="bg-red-900/20 border border-red-700/50 rounded-lg p-3">
            <p class="text-red-400 text-sm">{{ errorMessage() }}</p>
          </div>

          <!-- Action Button -->
          <button
            (click)="executeTransaction()"
            [disabled]="isProcessing() || !selectedToken || !amount || amount <= 0"
            class="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            [ngClass]="{
              'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600': mode() === 'deposit',
              'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600': mode() === 'withdraw'
            }"
          >
            {{ isProcessing()
              ? 'Processing...'
              : mode() === 'deposit'
              ? 'Deposit'
              : 'Withdraw' }}
          </button>

          <!-- Success Message -->
          <div *ngIf="successMessage()" class="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
            <p class="text-green-400 text-sm">{{ successMessage() }}</p>
            <a [href]="'https://etherscan.io/tx/' + txHash()" target="_blank" class="text-green-300 text-xs hover:underline mt-2 block">
              View Transaction
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DepositWithdrawModalComponent {
  @Input() mode: 'deposit' | 'withdraw' = 'deposit';
  @Input() chainId = 10; // Default to Optimism
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<string>();

  selectedToken = '';
  amount = 0;
  minOutput = 0;
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  txHash = signal<string>('');

  constructor(private web3Service: Web3Service) {}

  availableTokens() {
    return SUPPORTED_TOKENS.filter(t => t.chain === this.chainId);
  }

  displayBalance(): string {
    const token = SUPPORTED_TOKENS.find(t => t.symbol === this.selectedToken);
    if (!token) return '0.00';
    return `${(Math.random() * 1000).toFixed(2)} ${token.symbol}`;
  }

  setMaxAmount(): void {
    const maxBalance = Math.random() * 10000;
    this.amount = maxBalance;
  }

  async executeTransaction(): Promise<void> {
    if (!this.selectedToken || this.amount <= 0) {
      this.errorMessage.set('Please enter a valid amount');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const amountBigInt = BigInt(Math.floor(this.amount * 10 ** 18));
      const minOutputBigInt = BigInt(Math.floor(this.minOutput * 10 ** 18));
      const account = this.web3Service.connectedAccount();

      if (!account) {
        throw new Error('Not connected');
      }

      let txHash: string;

      if (this.mode() === 'deposit') {
        // Deposit to ETH
        txHash = await this.web3Service.depositToETH(
          this.getTokenAddress(),
          amountBigInt,
          account,
          minOutputBigInt
        );
      } else {
        // Withdraw from ETH
        txHash = await this.web3Service.withdrawETH(amountBigInt, minOutputBigInt);
      }

      this.txHash.set(txHash);
      this.successMessage.set(
        `${this.mode() === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`
      );
      this.success.emit(txHash);

      setTimeout(() => this.closeModal(), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Transaction failed';
      this.errorMessage.set(message);
      console.error('Transaction error:', error);
    } finally {
      this.isProcessing.set(false);
    }
  }

  private getTokenAddress(): string {
    const token = SUPPORTED_TOKENS.find(t => t.symbol === this.selectedToken);
    return token?.address || '';
  }

  closeModal(): void {
    this.close.emit();
  }
}
