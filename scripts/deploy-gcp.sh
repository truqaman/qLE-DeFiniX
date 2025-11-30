#!/bin/bash

# DeFiniX Google Cloud Run Deployment Script
# Usage: ./scripts/deploy-gcp.sh [environment] [region]

set -e

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-oceanic-grin-402108}"
IMAGE_NAME="${IMAGE_NAME:-vaultx}"
REGION="${2:-us-central1}"
MEMORY="${MEMORY:-512Mi}"
ENVIRONMENT="${1:-prod}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}DeFiniX - Google Cloud Run Deployment${NC}"
echo "=========================================="
echo "Project: $PROJECT_ID"
echo "Image: $IMAGE_NAME"
echo "Region: $REGION"
echo "Memory: $MEMORY"
echo "Environment: $ENVIRONMENT"
echo "=========================================="

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}Step 1: Building Docker image...${NC}"
docker build -t "gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest" \
            -t "gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${ENVIRONMENT}-$(date +%Y%m%d)" \
            .

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build Docker image${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker image built successfully${NC}"

# Push to Google Container Registry
echo -e "${YELLOW}Step 2: Pushing to Google Container Registry...${NC}"
docker push "gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest"

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to push Docker image${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker image pushed successfully${NC}"

# Deploy to Cloud Run
echo -e "${YELLOW}Step 3: Deploying to Cloud Run...${NC}"

# Build environment variables string
ENV_VARS=""
if [ -f ".env.${ENVIRONMENT}" ]; then
    while IFS='=' read -r key value; do
        if [[ ! $key =~ ^# && -n $key ]]; then
            ENV_VARS="${ENV_VARS}${key}=${value},"
        fi
    done < ".env.${ENVIRONMENT}"
    ENV_VARS="${ENV_VARS%,}"
fi

# Deploy with environment variables
if [ -z "$ENV_VARS" ]; then
    gcloud run deploy "${IMAGE_NAME}" \
        --image "gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest" \
        --platform managed \
        --region "${REGION}" \
        --memory "${MEMORY}" \
        --allow-unauthenticated \
        --project "${PROJECT_ID}"
else
    gcloud run deploy "${IMAGE_NAME}" \
        --image "gcr.io/${PROJECT_ID}/${IMAGE_NAME}:latest" \
        --platform managed \
        --region "${REGION}" \
        --memory "${MEMORY}" \
        --set-env-vars "${ENV_VARS}" \
        --allow-unauthenticated \
        --project "${PROJECT_ID}"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to deploy to Cloud Run${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Deployment to Cloud Run successful${NC}"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "${IMAGE_NAME}" \
    --platform managed \
    --region "${REGION}" \
    --format 'value(status.url)' \
    --project "${PROJECT_ID}")

echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Service URL: ${SERVICE_URL}"
echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo -e "==========================================${NC}"
