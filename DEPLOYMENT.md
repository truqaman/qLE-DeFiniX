# DeFiniX Deployment Guide

## Overview

DeFiniX is a production-ready Angular application that deploys to Google Cloud Run. This guide covers the complete deployment process, configuration, and best practices.

## Architecture

- **Framework**: Angular 20 with TypeScript
- **Styling**: TailwindCSS 3.4.11
- **Platform**: Google Cloud Run (managed, serverless)
- **Container Registry**: Google Container Registry (GCR)
- **Port**: 8080 (standard for Cloud Run)
- **Memory**: 512Mi (configurable)

## Prerequisites

1. **Google Cloud Project**

   ```bash
   PROJECT_ID=your-gcloud-project-id
   ```

2. **Required tools**
   - Docker (for local testing)
   - gcloud CLI
   - Node.js 20+
   - npm or yarn

3. **API Keys Required**
   - `ALCHEMY_API_KEY`: For Ethereum RPC access
   - `DUNE_API_KEY`: For blockchain data queries

## Environment Configuration

### Local Development

Create a `.env` file in the project root:

```env
ALCHEMY_API_KEY=your_alchemy_API_key
DUNE_API_KEY=your_dune_API_key
```

### Production Deployment

Environment variables are set via Cloud Run's `--set-env-vars` flag. See deployment scripts below.

## Multi-Chain Support

DeFiniX supports the following EVM chains:

| Chain    | Chain ID | RPC Provider | Tokens Supported |
| -------- | -------- | ------------ | ---------------- |
| Ethereum | 1        | Alchemy      | USDC             |
| Optimism | 10       | Alchemy      | USDq, YLP, YL$   |
| Base     | 8453     | Alchemy      | USDq, YLP        |
| Polygon  | 137      | Alchemy      | YLP, YL$         |

## Supported Tokens

### Optimism (OP Mainnet)

- **USDq**: `0x4b2842f382bfc19f409b1874c0480db3b36199b3` (6 decimals)
- **YLP**: `0x25789bbc835a77bc4afa862f638f09b8b8fae201` (18 decimals)
- **YL$**: `0xc618101ad5f3a5d924219f225148f8ac1ad74dba` (18 decimals)

### Base Mainnet

- **USDq**: `0xbaf56ca7996e8398300d47f055f363882126f369` (6 decimals)
- **YLP**: `0xa2f42a3db5ff5d8ff45baff00dea8b67c36c6d1c` (18 decimals)

### Polygon Mainnet

- **YLP**: `0x7332b6e5b80c9dd0cd165132434ffabdbd950612` (18 decimals)
- **YL$**: `0x80df049656a6efa89327bbc2d159aa393c30e037` (18 decimals)

## Building the Application

### Local Build

```bash
# Install dependencies
npm install

# Development build
npm start

# Production build
npm run build
```

### Docker Build (Local Testing)

```bash
# Build Docker image
docker build -t gcr.io/oceanic-grin-402108/vaultx:latest .

# Run locally (test)
docker run -p 8080:8080 \
  -e ALCHEMY_API_KEY=your_api_key \
  -e DUNE_API_KEY=your_dune_key \
  gcr.io/oceanic-grin-402108/vaultx:latest

# Access at http://localhost:8080
```

## Deployment Methods

### Method 1: Automated GitHub Actions (Recommended)

The CI/CD pipeline automatically:

1. Runs tests on every push/PR
2. Builds Docker image on push to main/develop
3. Pushes to GCR
4. Deploys to Cloud Run on main branch push

**Setup**:

1. Configure GitHub Secrets:
   - `ALCHEMY_API_KEY`
   - `DUNE_API_KEY`
2. Push to main branch
3. GitHub Actions handles the rest

### Method 2: Manual Deployment Script

```bash
# Make script executable
chmod +x scripts/deploy-gcp.sh

# Deploy to production
./scripts/deploy-gcp.sh prod us-central1

# Deploy to staging
./scripts/deploy-gcp.sh staging us-central1
```

### Method 3: Manual gcloud Commands

```bash
# Build image
docker build -t gcr.io/oceanic-grin-402108/vaultx:latest .

# Push to GCR
docker push gcr.io/oceanic-grin-402108/vaultx:latest

# Deploy to Cloud Run
gcloud run deploy vaultx \
  --image gcr.io/oceanic-grin-402108/vaultx:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --allow-unauthenticated \
  --set-env-vars ALCHEMY_API_KEY=your_key,DUNE_API_KEY=your_key \
  --project oceanic-grin-402108
```

## Post-Deployment

### Verify Deployment

```bash
# Get service URL
gcloud run services describe vaultx \
  --platform managed \
  --region us-central1 \
  --format 'value(status.url)' \
  --project oceanic-grin-402108

# Test health
curl -s https://your-service-url/
```

### View Logs

```bash
gcloud run logs read vaultx \
  --platform managed \
  --region us-central1 \
  --limit 100 \
  --project oceanic-grin-402108
```

### Monitor Performance

Cloud Run provides built-in monitoring:

- Cloud Console: https://console.cloud.google.com/run
- Metrics: CPU, Memory, Request count, Latency
- Logs: Stackdriver Logging

## Production Best Practices

1. **Security**
   - Never commit API keys to version control
   - Use Cloud Secrets Manager for sensitive data
   - Enable Cloud Run authentication for private services
   - Regular security audits and dependency updates

2. **Performance**
   - Monitor Cloud Run metrics in Console
   - Set appropriate memory allocation (512Mi-2Gi)
   - Enable concurrent request handling
   - Use CDN for static assets if needed

3. **Reliability**
   - Set up uptime monitoring
   - Configure Cloud Run autoscaling
   - Enable revision history and easy rollbacks
   - Monitor smart contract interactions

4. **Costs**
   - Cloud Run charges per request
   - Current setup (512Mi): ~$0.40/million requests
   - Monitor usage in GCP Console

## Troubleshooting

### Port Not Accessible

Check if port 8080 is correctly exposed:

```bash
docker run -p 8080:8080 gcr.io/oceanic-grin-402108/vaultx:latest
```

### Container Startup Issues

View detailed logs:

```bash
gcloud run logs read vaultx --limit 50 --platform managed
```

### Out of Memory

Increase Cloud Run memory:

```bash
gcloud run deploy vaultx \
  --image gcr.io/oceanic-grin-402108/vaultx:latest \
  --memory 1Gi \
  --project oceanic-grin-402108
```

### Smart Contract Connection Issues

1. Verify API keys are set
2. Check network/chain configuration
3. Verify contract address
4. Check wallet connection state

## Rollback

To rollback to a previous version:

```bash
# List previous revisions
gcloud run revisions list --service=vaultx --platform managed

# Deploy a specific revision
gcloud run deploy vaultx \
  --image gcr.io/oceanic-grin-402108/vaultx:revision-id \
  --platform managed \
  --project oceanic-grin-402108
```

## Updates and Maintenance

### Update Application

1. Make code changes
2. Update version in `package.json` and `src/environments/environment.prod.ts`
3. Push to main branch
4. GitHub Actions automatically deploys

### Update Dependencies

```bash
npm update
npm audit fix

# Test locally
npm run build
npm start

# Deploy
git push origin main
```

## Support and Monitoring

- **GCP Console**: https://console.cloud.google.com/run
- **Monitoring**: Cloud Monitoring & Logging
- **Alerts**: Configure in GCP Console for anomalies
- **Documentation**: See README.md for development setup

## Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── dashboard.ts
│   │   ├── pages/
│   │   │   └── home.ts
│   │   ├── services/
│   │   │   └── web3.service.ts
│   │   ├── constants/
│   │   │   ├── contract.ts
│   │   │   └── tokens.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── public/
│   └── favicon.ico
├── Dockerfile
├── .dockerignore
├── docker-compose.yml
├── scripts/
│   └── deploy-gcp.sh
└── .github/
    └── workflows/
        └── deploy.yml
```

## Contact & Support

For deployment issues or questions, refer to:

- GCP Documentation: https://cloud.google.com/run/docs
- Angular Documentation: https://angular.io/docs
- DeFiniX Documentation: Check README.md
