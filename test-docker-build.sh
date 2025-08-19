#!/bin/bash

# Test Docker builds locally
set -e

echo "🐳 Testing Docker builds..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Test server build
print_status "Building server image..."
if docker build -f server/Dockerfile -t optimize-server:test . >/dev/null 2>&1; then
    print_success "Server image built successfully"
else
    print_error "Server image build failed"
    exit 1
fi

# Test client build
print_status "Building client image..."
if docker build -t optimize-client:test ./client >/dev/null 2>&1; then
    print_success "Client image built successfully"
else
    print_error "Client image build failed"
    exit 1
fi

# Test with Docker Compose
print_status "Testing Docker Compose build..."
if docker-compose build >/dev/null 2>&1; then
    print_success "Docker Compose build successful"
else
    print_error "Docker Compose build failed"
    exit 1
fi

print_success "🎉 All Docker builds successful!"
echo ""
echo "Ready to deploy:"
echo "  • Minikube: ./deploy-minikube.sh"
echo "  • Docker Compose: docker-compose up"
