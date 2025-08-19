#!/bin/bash

# Minikube Deployment Script for OptimizeDemo
set -e

echo "🚀 Starting Minikube deployment for OptimizeDemo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Minikube is installed
if ! command -v minikube &> /dev/null; then
    print_error "Minikube is not installed. Please install it first:"
    echo "  brew install minikube"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install it first:"
    echo "  brew install kubectl"
    exit 1
fi

# Start Minikube if not running
print_status "Checking Minikube status..."
if ! minikube status 2>/dev/null | grep -q "Running"; then
    print_status "Starting Minikube..."
    minikube start \
        --driver=docker \
        --memory=4096 \
        --cpus=2 \
        --kubernetes-version=v1.28.3 \
        --wait=true \
        --wait-timeout=600s
    
    if [ $? -eq 0 ]; then
        print_success "Minikube started"
    else
        print_error "Failed to start Minikube. Try running ./troubleshoot-minikube.sh"
        exit 1
    fi
else
    print_success "Minikube is already running"
fi

# Enable required addons
print_status "Enabling Minikube addons..."

# Wait for cluster to be fully ready
print_status "Waiting for cluster to be ready..."
kubectl wait --for=condition=Ready nodes --all --timeout=300s

# Enable ingress addon
print_status "Enabling ingress addon..."
minikube addons enable ingress

# Wait for ingress controller
print_status "Waiting for ingress controller to be ready..."
kubectl wait --namespace ingress-nginx \
    --for=condition=ready pod \
    --selector=app.kubernetes.io/component=controller \
    --timeout=300s 2>/dev/null || print_warning "Ingress controller taking longer than expected"

# Enable metrics server
print_status "Enabling metrics-server addon..."
minikube addons enable metrics-server

print_success "Addons enabled"

# Set Docker environment to use Minikube's Docker daemon
print_status "Setting up Docker environment..."
eval $(minikube docker-env)
print_success "Docker environment configured"

# Build Docker images
print_status "Building Docker images..."

echo "Building server image..."
docker build -f server/Dockerfile -t optimize-server:latest .

echo "Building client image..."
docker build -t optimize-client:latest ./client

print_success "Docker images built successfully"

# Create namespace
print_status "Creating Kubernetes namespace..."
kubectl apply -f k8s/namespace.yaml
print_success "Namespace created"

# Deploy services
print_status "Deploying services to Kubernetes..."
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s/ingress.yaml
print_success "Services deployed"

# Wait for deployments to be ready
print_status "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/optimize-server -n optimize-demo
kubectl wait --for=condition=available --timeout=300s deployment/optimize-client -n optimize-demo
print_success "All deployments are ready"

# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
print_success "Minikube IP: $MINIKUBE_IP"

# Add entry to /etc/hosts
print_status "Updating /etc/hosts file..."
if ! grep -q "optimize.local" /etc/hosts; then
    echo "$MINIKUBE_IP optimize.local" | sudo tee -a /etc/hosts
    print_success "Added optimize.local to /etc/hosts"
else
    print_warning "optimize.local already exists in /etc/hosts"
fi

# Display access information
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "📋 Access Information:"
echo "  🌐 Web App: http://optimize.local"
echo "  🔧 API: http://optimize.local/api/health"
echo "  📊 Minikube Dashboard: minikube dashboard"
echo ""
echo "🛠️  Useful Commands:"
echo "  📈 Check status: kubectl get pods -n optimize-demo"
echo "  📝 View logs: kubectl logs -f deployment/optimize-server -n optimize-demo"
echo "  🔍 Debug: kubectl describe pod <pod-name> -n optimize-demo"
echo "  🗑️  Cleanup: kubectl delete namespace optimize-demo"
echo ""
print_status "Opening browser..."
sleep 3
open http://optimize.local

print_success "Deployment script completed!"
