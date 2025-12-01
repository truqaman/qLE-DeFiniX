import { Component, Input, Output, EventEmitter, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Web3Service } from "../services/web3.service";
import { SUPPORTED_TOKENS } from "../constants/tokens";

@Component({
  selector: "app-convert-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      (click)="closeModal()"
    >
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="p-6 border-b border-slate-700 flex items-center justify-between"
        >
          <h2 class="text-2xl font-bold text-white">Exchange Assets</h2>
          <button
            (click)="closeModal()"
            class="text-slate-400 hover:text-white transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- From Token -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              From
            </label>
            <div class="flex gap-2">
              <select
                [(ngModel)]="fromToken"
                (change)="updateQuote()"
                class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select token</option>
                <option
                  *ngFor="let token of availableTokens()"
                  [value]="token.symbol"
                >
                  {{ token.symbol }}
                </option>
              </select>
              <input
                type="number"
                [(ngModel)]="fromAmount"
                (change)="updateQuote()"
                placeholder="0.00"
                class="w-24 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- Swap Button -->
          <div class="flex justify-center">
            <button
              (click)="swapTokens()"
              class="p-3 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 transition-colors"
            >
              <svg
                class="w-5 h-5 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"
                ></path>
              </svg>
            </button>
          </div>

          <!-- To Token -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              To
            </label>
            <div class="flex gap-2">
              <select
                [(ngModel)]="toToken"
                (change)="updateQuote()"
                class="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Select token</option>
                <option
                  *ngFor="let token of availableTokens()"
                  [value]="token.symbol"
                >
                  {{ token.symbol }}
                </option>
              </select>
              <div
                class="w-24 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                {{ toAmount | number: "1.2-6" }}
              </div>
            </div>
          </div>

          <!-- Quote Info -->
          <div class="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Rate:</span>
              <span class="text-white font-semibold"
                >1 {{ fromToken }} ≈ {{ rate() | number: "1.4-6" }}
                {{ toToken }}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Min Receive:</span>
              <span class="text-white font-semibold"
                >{{ minToAmount() | number: "1.2-6" }} {{ toToken }}</span
              >
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Slippage Tolerance:</span>
              <span class="text-orange-400 font-semibold">0.1%</span>
            </div>
          </div>

          <!-- Error Message -->
          <div
            *ngIf="errorMessage()"
            class="bg-red-900/20 border border-red-700/50 rounded-lg p-3"
          >
            <p class="text-red-400 text-sm">{{ errorMessage() }}</p>
          </div>

          <!-- Action Button -->
          <button
            (click)="executeConversion()"
            [disabled]="
              isProcessing() ||
              !fromToken ||
              !toToken ||
              !fromAmount ||
              fromAmount <= 0 ||
              fromToken === toToken
            "
            class="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isProcessing() ? "Converting..." : "Exchange" }}
          </button>

          <!-- Success Message -->
          <div
            *ngIf="successMessage()"
            class="bg-green-900/20 border border-green-700/50 rounded-lg p-3"
          >
            <p class="text-green-400 text-sm">{{ successMessage() }}</p>
            <a
              [href]="'https://etherscan.io/tx/' + txHash()"
              target="_blank"
              class="text-green-300 text-xs hover:underline mt-2 block"
            >
              View Transaction
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ConvertModalComponent {
  @Input() chainId = 10; // Default to Optimism
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<string>();

  fromToken = "";
  toToken = "";
  fromAmount = 0;
  toAmount = 0;
  rate = signal(1);
  minToAmount = signal(0);
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  txHash = signal<string>("");

  constructor(private web3Service: Web3Service) {}

  availableTokens() {
    return SUPPORTED_TOKENS.filter((t) => t.chain === this.chainId);
  }

  swapTokens(): void {
    [this.fromToken, this.toToken] = [this.toToken, this.fromToken];
    [this.fromAmount, this.toAmount] = [this.toAmount, this.fromAmount];
    this.updateQuote();
  }

  async updateQuote(): Promise<void> {
    if (!this.fromToken || !this.toToken || this.fromAmount <= 0) {
      this.toAmount = 0;
      this.rate.set(1);
      return;
    }

    try {
      // Simulate rate calculation
      const simulatedRate = 0.95 + Math.random() * 0.1;
      this.rate.set(simulatedRate);
      this.toAmount = this.fromAmount * simulatedRate;
      this.minToAmount.set(this.toAmount * 0.999); // 0.1% slippage
    } catch (error) {
      console.error("Error updating quote:", error);
      this.errorMessage.set("Failed to fetch conversion rate");
    }
  }

  async executeConversion(): Promise<void> {
    if (!this.fromToken || !this.toToken || this.fromAmount <= 0) {
      this.errorMessage.set("Please fill in all fields");
      return;
    }

    if (this.fromToken === this.toToken) {
      this.errorMessage.set("From and To tokens must be different");
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const fromAmountBigInt = BigInt(Math.floor(this.fromAmount * 10 ** 18));
      const minOutputBigInt = BigInt(Math.floor(this.minToAmount() * 10 ** 18));
      const account = this.web3Service.connectedAccount();

      if (!account) {
        throw new Error("Not connected");
      }

      let txHash: string;

      // Determine conversion direction based on token symbols
      if (this.toToken === "ETH") {
        txHash = await this.web3Service.convertToETH(
          account,
          fromAmountBigInt,
          minOutputBigInt,
        );
      } else if (this.toToken === "USDC") {
        txHash = await this.web3Service.convertToUSDC(
          account,
          fromAmountBigInt,
          minOutputBigInt,
        );
      } else {
        throw new Error("Unsupported conversion pair");
      }

      this.txHash.set(txHash);
      this.successMessage.set(
        `Converted ${this.fromAmount} ${this.fromToken} to ${this.toToken}!`,
      );
      this.success.emit(txHash);

      setTimeout(() => this.closeModal(), 3000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Conversion failed";
      this.errorMessage.set(message);
      console.error("Conversion error:", error);
    } finally {
      this.isProcessing.set(false);
    }
  }

  closeModal(): void {
    this.close.emit();
  }
}
