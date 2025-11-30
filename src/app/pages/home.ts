import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <!-- Navigation Bar -->
      <nav class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-orange-500/20">
        <div class="container mx-auto px-4 py-4 max-w-6xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 via-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">qLE</span>
            </div>
            <span class="text-xl font-bold text-white">DeFiniX</span>
          </div>
          <button
            (click)="navigateToDashboard()"
            class="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
          >
            Launch App
          </button>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="container mx-auto px-4 max-w-6xl pt-20 pb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8">
            <div class="space-y-4">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/50 mb-4">
                <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span class="text-orange-400 font-semibold text-sm">Quantum Liquidity Engine</span>
              </div>
              <h1 class="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Welcome to
                <span class="bg-gradient-to-r from-cyan-400 via-orange-400 to-red-400 text-transparent bg-clip-text"> DeFiniX</span>
              </h1>
              <p class="text-xl text-slate-300 leading-relaxed">
                World's first quantum Virtual Liquidity Engine (qLE) using virtual wallets and stablecoins. Experience seamless asset management with multi-chain support, instant conversions, and enterprise-grade security.
              </p>
            </div>

            <!-- Key Features -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                    <svg class="h-6 w-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-white">Secure & Audited</p>
                  <p class="text-sm text-slate-400">Smart contract verified</p>
                </div>
              </div>

              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-white">Lightning Fast</p>
                  <p class="text-sm text-slate-400">Optimized transactions</p>
                </div>
              </div>

              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                    <svg class="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-white">Multi-Token Support</p>
                  <p class="text-sm text-slate-400">USDq, YLP, YL$, USDC, ETH</p>
                </div>
              </div>

              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                    <svg class="h-6 w-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-semibold text-white">Quantum Optimized</p>
                  <p class="text-sm text-slate-400">Best conversion rates</p>
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                (click)="connectAndNavigate()"
                [disabled]="web3Service.isLoading()"
                class="px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
              >
                {{ web3Service.isLoading() ? 'Connecting...' : 'Get Started' }}
              </button>
              <button
                (click)="scrollToFeatures()"
                class="px-8 py-4 rounded-lg font-semibold text-white border-2 border-slate-700 hover:border-slate-600 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>

          <!-- Right Illustration -->
          <div class="hidden lg:flex items-center justify-center">
            <div class="relative w-full aspect-square max-w-md">
              <!-- Animated background gradient -->
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>

              <!-- Card illustration -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-64 h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-6 shadow-2xl">
                  <div class="flex items-center justify-between mb-8">
                    <span class="text-sm font-semibold text-slate-400">Virtual Wallet</span>
                    <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full"></div>
                  </div>

                  <div class="space-y-6">
                    <div>
                      <p class="text-xs text-slate-500 mb-2">Total Balance</p>
                      <p class="text-3xl font-bold text-white">$24,580.50</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div class="bg-slate-700/50 rounded-lg p-3">
                        <p class="text-xs text-slate-400 mb-1">USDC</p>
                        <p class="text-lg font-semibold text-cyan-400">12,500</p>
                      </div>
                      <div class="bg-slate-700/50 rounded-lg p-3">
                        <p class="text-xs text-slate-400 mb-1">ETH</p>
                        <p class="text-lg font-semibold text-purple-400">6.25</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section #featuresSection class="py-20 bg-slate-800/50 border-y border-slate-700">
        <div class="container mx-auto px-4 max-w-6xl">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p class="text-xl text-slate-300">Everything you need to manage your digital assets</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="p-8 rounded-xl border border-slate-700 hover:border-cyan-500 transition-colors bg-slate-900/50">
              <div class="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Flexible Management</h3>
              <p class="text-slate-400">Create and manage multiple virtual wallets with customizable spending caps and security settings.</p>
            </div>

            <!-- Feature 2 -->
            <div class="p-8 rounded-xl border border-slate-700 hover:border-purple-500 transition-colors bg-slate-900/50">
              <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 13m-5 4l-4 4m0 0l-4-4m4 4v-5"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Instant Conversions</h3>
              <p class="text-slate-400">Convert between USDC and ETH instantly with minimal slippage and transparent rate calculations.</p>
            </div>

            <!-- Feature 3 -->
            <div class="p-8 rounded-xl border border-slate-700 hover:border-green-500 transition-colors bg-slate-900/50">
              <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
              <p class="text-slate-400">Bank-grade encryption and security protocols protect your assets with advanced smart contract verification.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-20">
        <div class="container mx-auto px-4 max-w-6xl">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div class="text-center">
              <p class="text-4xl font-bold text-white mb-2">$2.5B+</p>
              <p class="text-slate-400">Total Volume Processed</p>
            </div>
            <div class="text-center">
              <p class="text-4xl font-bold text-white mb-2">50K+</p>
              <p class="text-slate-400">Active Wallets</p>
            </div>
            <div class="text-center">
              <p class="text-4xl font-bold text-white mb-2">99.9%</p>
              <p class="text-slate-400">Uptime Guarantee</p>
            </div>
            <div class="text-center">
              <p class="text-4xl font-bold text-white mb-2">0.1%</p>
              <p class="text-slate-400">Average Slippage</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-20 bg-gradient-to-r from-cyan-600 via-orange-500 to-red-600">
        <div class="container mx-auto px-4 max-w-4xl text-center">
          <h2 class="text-4xl font-bold text-white mb-4">Ready to Experience qLE?</h2>
          <p class="text-lg text-white mb-8">Join the quantum liquidity revolution with DeFiniX. Manage your virtual wallet across multiple chains securely and efficiently.</p>
          <button
            (click)="connectAndNavigate()"
            [disabled]="web3Service.isLoading()"
            class="px-10 py-4 rounded-lg font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            {{ web3Service.isLoading() ? 'Connecting...' : 'Launch Virtual Wallet' }}
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-slate-900 border-t border-orange-500/20 py-12">
        <div class="container mx-auto px-4 max-w-6xl">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 via-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-xs">qLE</span>
                </div>
                <span class="font-bold text-white">DeFiniX</span>
              </div>
              <p class="text-slate-400 text-sm">World's first quantum Virtual Liquidity Engine using virtual wallets and stablecoins.</p>
            </div>
            <div>
              <p class="font-semibold text-white mb-4">Product</p>
              <ul class="space-y-2 text-sm text-slate-400">
                <li><a href="#" class="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <p class="font-semibold text-white mb-4">Legal</p>
              <ul class="space-y-2 text-sm text-slate-400">
                <li><a href="#" class="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <p class="font-semibold text-white mb-4">Connect</p>
              <ul class="space-y-2 text-sm text-slate-400">
                <li><a href="#" class="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" class="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" class="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div class="border-t border-slate-800 pt-8">
            <p class="text-center text-slate-400 text-sm">© 2024 Virtual Wallet SDK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HomeComponent {
  constructor(public web3Service: Web3Service) {}

  async connectAndNavigate() {
    try {
      await this.web3Service.connectWallet();
      this.navigateToDashboard();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  }

  navigateToDashboard() {
    window.location.href = '/dashboard';
  }

  scrollToFeatures() {
    document.querySelector('[scroll-to-features]')?.scrollIntoView({ behavior: 'smooth' });
  }
}
