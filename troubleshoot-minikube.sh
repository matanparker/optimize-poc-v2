#!/bin/bash

# Minikube Troubleshooting Script
set -e

echo "🔧 Troubleshooting Minikube issues..."

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

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check and fix common issues
check_minikube_status() {
    print_status "Checking Minikube status..."
    
    if minikube status 2>/dev/null | grep -q "Running"; then
        print_success "Minikube is running"
        return 0
    else
        print_warning "Minikube is not running properly"
        return 1
    fi
}

# Function to restart Minikube cleanly
restart_minikube() {
    print_status "Restarting Minikube..."
    
    # Stop Minikube if running
    print_status "Stopping Minikube..."
    minikube stop 2>/dev/null || true
    
    # Delete existing cluster to start fresh
    print_status "Deleting existing cluster..."
    minikube delete 2>/dev/null || true
    
    # Wait a moment
    sleep 3
    
    # Start with specific settings to avoid issues
    print_status "Starting fresh Minikube cluster..."
    minikube start \
        --driver=docker \
        --memory=4096 \
        --cpus=2 \
        --disk-size=20g \
        --kubernetes-version=v1.28.3 \
        --wait=true \
        --wait-timeout=600s
    
    if [ $? -eq 0 ]; then
        print_success "Minikube started successfully"
        return 0
    else
        print_error "Failed to start Minikube"
        return 1
    fi
}

# Function to enable addons safely
enable_addons() {
    print_status "Enabling required addons..."
    
    # Wait for cluster to be fully ready
    print_status "Waiting for cluster to be ready..."
    kubectl wait --for=condition=Ready nodes --all --timeout=300s
    
    # Enable ingress addon
    print_status "Enabling ingress addon..."
    minikube addons enable ingress
    
    # Wait for ingress controller to be ready
    print_status "Waiting for ingress controller..."
    kubectl wait --namespace ingress-nginx \
        --for=condition=ready pod \
        --selector=app.kubernetes.io/component=controller \
        --timeout=300s
    
    # Enable metrics server
    print_status "Enabling metrics-server addon..."
    minikube addons enable metrics-server
    
    print_success "All addons enabled successfully"
}

# Function to verify cluster health
verify_cluster() {
    print_status "Verifying cluster health..."
    
    # Check node status
    kubectl get nodes
    
    # Check system pods
    kubectl get pods -n kube-system
    
    # Check if API server is responsive
    kubectl cluster-info
    
    print_success "Cluster verification completed"
}

# Main troubleshooting flow
main() {
    print_status "Starting Minikube troubleshooting..."
    
    # Check current status
    if ! check_minikube_status; then
        print_warning "Minikube needs to be restarted"
        
        if restart_minikube; then
            print_success "Minikube restarted successfully"
        else
            print_error "Failed to restart Minikube"
            echo ""
            echo "Manual troubleshooting steps:"
            echo "1. Check Docker Desktop is running"
            echo "2. Increase Docker resources (Memory: 4GB+, CPU: 2+)"
            echo "3. Run: docker system prune -a"
            echo "4. Run: minikube delete && minikube start"
            exit 1
        fi
    fi
    
    # Enable addons
    enable_addons
    
    # Verify everything is working
    verify_cluster
    
    print_success "🎉 Minikube is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Run: ./deploy-minikube.sh"
    echo "2. Or manually deploy: kubectl apply -f k8s/"
}

# Run main function
main "$@"
