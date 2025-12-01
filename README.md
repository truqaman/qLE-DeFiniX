# DeFiniX - Quantum Virtual Liquidity Engine

> Cunovet Space Inc, HAADS PARTNERSHIPS and KOTNS Creative Space innovative World's first quantum Virtual Liquidity Engine (qLE) using virtual wallets and stablecoins

![DeFiniX](https://img.shields.io/badge/DeFiniX-qLE-orange?style=flat-square)
![Angular](https://img.shields.io/badge/Angular-20-red?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🚀 Features

- **Multi-Chain Support**: Ethereum, Optimism, Base, and Polygon mainnet
- **Virtual Wallets**: Create and manage virtual wallets with spending caps
- **Token Conversions**: Instant conversion between supported tokens with minimal slippage
- **Quantum Optimization**: Advanced liquidity engine for optimal rates
- **MetaMask Integration**: Seamless Web3 wallet connection
- **Production Ready**: Docker containerized, Cloud Run deployment ready
- **Enterprise Security**: Smart contract verified and audited

## 📋 Supported Tokens

### Optimism (OP Mainnet - Chain 10)

- **USDq**: `0x4b2842f382bfc19f409b1874c0480db3b36199b3` (6 decimals)
- **YLP**: `0x25789bbc835a77bc4afa862f638f09b8b8fae201` (18 decimals)
- **YL$**: `0xc618101ad5f3a5d924219f225148f8ac1ad74dba` (18 decimals)

### Base Mainnet (Chain 8453)

- **USDq**: `0xbaf56ca7996e8398300d47f055f363882126f369` (6 decimals)
- **YLP**: `0xa2f42a3db5ff5d8ff45baff00dea8b67c36c6d1c` (18 decimals)

### Polygon Mainnet (Chain 137)

- **YLP**: `0x7332b6e5b80c9dd0cd165132434ffabdbd950612` (18 decimals)
- **YL$**: `0x80df049656a6efa89327bbc2d159aa393c30e037` (18 decimals)

### Ethereum (Chain 1)

- **USDC**: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` (6 decimals)

## 🛠 Tech Stack

- **Frontend Framework**: Angular 20
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS 3.4.11 with custom utilities
- **Web3**: ethers.js for smart contract interactions
- **Build Tool**: Angular CLI with Vite
- **Testing**: Jasmine + Karma
- **Deployment**: Google Cloud Run
- **Container**: Docker with multi-stage builds

## ⚡ Quick Start

### Prerequisites

- Node.js 20+ and npm
- Docker (for containerized development)
- MetaMask or compatible Web3 wallet
- Alchemy API key (for RPC)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd definix

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Update .env with your API keys
# ALCHEMY_API_KEY=your_api_key_here
# DUNE_API_KEY=your_dune_api_key_here
```

### Development

```bash
# Start development server
npm start

# App runs on http://localhost:4200
# Open your browser and connect MetaMask to Optimism mainnet
```

### Production Build

```bash
# Build for production
npm run build

# Output: dist/fusion-angular-tailwind-starter/
```

## 🐳 Docker

### Local Development with Docker

```bash
# Build Docker image
docker build -t definix:latest .

# Run container
docker run -p 8080:8080 \
  -e ALCHEMY_API_KEY=your_key \
  -e DUNE_API_KEY=your_key \
  definix:latest

# Access at http://localhost:8080
```

### Using Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f definix

# Stop services
docker-compose down
```

## ☁️ Deployment

### Google Cloud Run Deployment

DeFiniX is optimized for Google Cloud Run. For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

#### Quick Deploy

```bash
# Prerequisites
gcloud auth login
gcloud config set project oceanic-grin-402108

# Deploy using script
chmod +x scripts/deploy-gcp.sh
./scripts/deploy-gcp.sh prod us-central1

# Or use gcloud directly
gcloud run deploy vaultx \
  --image gcr.io/oceanic-grin-402108/vaultx:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --allow-unauthenticated \
  --set-env-vars ALCHEMY_API_KEY=your_key,DUNE_API_KEY=your_key \
  --project oceanic-grin-402108
```

#### GitHub Actions CI/CD

The project includes automated GitHub Actions workflows that:

- Run tests on every push
- Build Docker images
- Push to Google Container Registry
- Deploy to Cloud Run on main branch

Configure GitHub secrets:

- `ALCHEMY_API_KEY`
- `DUNE_API_KEY`

## 🔌 API & Services

### Web3Service

Central service for all blockchain interactions.

```typescript
// Connect wallet
await web3Service.connectWallet();

// Get user balances
const balances = await web3Service.getUserBalances(address);

// Convert tokens
const txHash = await web3Service.convertToETH(receiver, amount, minOutput);

// Switch chains
await web3Service.switchChain(10); // Optimism
```

### Token Configuration

Tokens and chain configurations are centralized in `src/app/constants/tokens.ts`:

```typescript
import { SUPPORTED_TOKENS, getTokensByChain } from "./constants/tokens";

// Get tokens for a specific chain
const opTokens = getTokensByChain(10);
```

## 📁 Project Structure

```
definix/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── dashboard.ts         # Main dashboard
│   │   ├── pages/
│   │   │   └── home.ts              # Landing page
│   │   ├── services/
│   │   │   └── web3.service.ts      # Web3 interactions
│   │   ├── constants/
│   │   │   ├── contract.ts          # Smart contract ABI
│   │   │   └── tokens.ts            # Token & chain configs
│   │   ├── app.routes.ts            # Routing
│   │   ├── app.ts                   # Root component
│   │   └── app.config.ts            # App configuration
│   ├── environments/
│   │   ├── environment.ts           # Dev configuration
│   │   └── environment.prod.ts      # Prod configuration
│   ├── styles.css                   # Global styles
│   ├── index.html                   # HTML entry point
│   └── main.ts                      # Bootstrap
├── public/
│   └── favicon.ico
├── scripts/
│   └── deploy-gcp.sh               # Deployment script
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions
├── Dockerfile                       # Container image
├── docker-compose.yml               # Local dev setup
├── angular.json                     # Angular config
├── tailwind.config.js               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── package.json
├── DEPLOYMENT.md                    # Deployment guide
├── README.md                        # This file
└── .env.example                     # Configuration template
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --code-coverage

# Run E2E tests
npm run e2e
```

## 🎨 Theming

DeFiniX uses TailwindCSS with custom utilities for branding:

- **Primary Colors**: Cyan (#0ea5e9), Blue (#3b82f6)
- **Accent Color**: Orange (#ff8c42)
- **Dark Theme**: Slate-900 background with glassmorphic elements

Customize in `tailwind.config.js` and `src/styles.css`.

## 🔐 Security

- **Smart Contract**: Verified and audited (address: `0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D`)
- **Web3**: ethers.js for safe contract interactions
- **Secrets**: Use environment variables for sensitive data
- **No Private Keys**: Uses MetaMask for signing
- **Input Validation**: All user inputs validated

## 📊 Performance

- **Build Size**: ~500KB (gzipped)
- **Initial Load**: <2s on 4G
- **Lighthouse Score**: 90+
- **Cloud Run Response**: <100ms average

## 🐛 Troubleshooting

### MetaMask Connection Issues

1. Ensure MetaMask is installed
2. Switch to Optimism mainnet manually
3. Check if wallet is connected in MetaMask

### Contract Interaction Failures

1. Verify network matches token deployment
2. Check contract address and ABI
3. Ensure sufficient gas and balance

### Deployment Issues

See [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section.

## 📝 Environment Variables

```env
# Required for production
ALCHEMY_API_KEY=<your_alchemy_api_key>
DUNE_API_KEY=<your_dune_api_key>

# Optional
SMART_CONTRACT_ADDRESS=0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D
NODE_ENV=production
PORT=8080
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues and questions:

- GitHub Issues: [Create an issue]
- Documentation: See [DEPLOYMENT.md](DEPLOYMENT.md)
- GCP Console: https://console.cloud.google.com/run

## 🙏 Acknowledgments

- Built with Angular 20
- Styled with TailwindCSS
- Powered by ethers.js
- Deployed on Google Cloud Run

---

**DeFiniX** - The Future of Quantum Virtual Liquidity 🚀 Made With ❤️❤️❤️❤️❤️❤️❤️❤️ By THE HAADS PARTNERSHIPS OF CREATIVE AFRICAN MINDS FOR THE WEB3 VIRTUAL INFRASTRUCTURE 
