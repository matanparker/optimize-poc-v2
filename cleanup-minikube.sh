#!/bin/bash

# Cleanup script for OptimizeDemo Minikube deployment
set -e

echo "🧹 Cleaning up OptimizeDemo deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if namespace exists
if kubectl get namespace optimize-demo &> /dev/null; then
    print_status "Deleting Kubernetes resources..."
    kubectl delete namespace optimize-demo
    print_success "Namespace 'optimize-demo' deleted"
else
    print_warning "Namespace 'optimize-demo' not found"
fi

# Remove from /etc/hosts
print_status "Removing optimize.local from /etc/hosts..."
if grep -q "optimize.local" /etc/hosts 2>/dev/null; then
    sudo sed -i '' '/optimize.local/d' /etc/hosts
    print_success "Removed optimize.local from /etc/hosts"
else
    print_warning "optimize.local not found in /etc/hosts"
fi

# Clean up Docker images (optional)
read -p "Do you want to remove Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Removing Docker images..."
    eval $(minikube docker-env) 2>/dev/null || true
    docker rmi optimize-server:latest optimize-client:latest 2>/dev/null || print_warning "Some images not found"
    print_success "Docker images removed"
fi

# Ask about stopping Minikube
read -p "Do you want to stop Minikube? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Stopping Minikube..."
    minikube stop
    print_success "Minikube stopped"
    
    read -p "Do you want to delete the entire Minikube cluster? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deleting Minikube cluster..."
        minikube delete
        print_success "Minikube cluster deleted"
    fi
fi

echo ""
print_success "🎉 Cleanup completed!"
echo ""
echo "To redeploy, run: ./deploy-minikube.sh"
