import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Config {
  alchemyKey: string;
  duneKey: string;
  contractAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): Config {
    const alchemyKey = this.getEnvVariable('ALCHEMY_API_KEY') || environment.apiKeys.alchemy;
    const duneKey = this.getEnvVariable('DUNE_API_KEY') || environment.apiKeys.dune;

    return {
      alchemyKey,
      duneKey,
      contractAddress: environment.smartContract.address,
    };
  }

  private getEnvVariable(name: string): string | null {
    // Try to get from window object (can be set by index.html or build process)
    const win = typeof window !== 'undefined' ? (window as any) : {};
    if (win._env_ && win._env_[name]) {
      return win._env_[name];
    }

    // For development, try to get from localStorage
    if (!environment.production && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(`__env_${name}`);
      if (stored) return stored;
    }

    return null;
  }

  getConfig(): Config {
    return this.config;
  }

  getAlchemyKey(): string {
    return this.config.alchemyKey;
  }

  getDuneKey(): string {
    return this.config.duneKey;
  }

  getContractAddress(): string {
    return this.config.contractAddress;
  }
}
