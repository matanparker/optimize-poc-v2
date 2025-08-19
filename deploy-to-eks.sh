#!/bin/bash

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Update these values
AWS_REGION="${AWS_REGION:-us-west-2}"
CLUSTER_NAME="${CLUSTER_NAME:-optimize-demo}"
NAMESPACE="optimize-production"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null)
if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo -e "${RED}❌ Error: Unable to get AWS Account ID. Please ensure AWS CLI is configured.${NC}"
    exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists aws; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    
    if ! command_exists kubectl; then
        print_error "kubectl is not installed"
        exit 1
    fi
    
    if ! command_exists docker; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
}

# Function to build and push images
build_and_push_images() {
    print_status "Building and pushing Docker images..."
    
    # Check if ECR repositories exist
    print_status "Checking ECR repositories..."
    if ! aws ecr describe-repositories --repository-names optimize-client --region $AWS_REGION >/dev/null 2>&1; then
        print_status "Creating optimize-client ECR repository..."
        aws ecr create-repository --repository-name optimize-client --region $AWS_REGION
    fi
    
    if ! aws ecr describe-repositories --repository-names optimize-server --region $AWS_REGION >/dev/null 2>&1; then
        print_status "Creating optimize-server ECR repository..."
        aws ecr create-repository --repository-name optimize-server --region $AWS_REGION
    fi
    
    # Login to ECR
    print_status "Logging into ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
    
    # Build and push client image
    print_status "Building client image..."
    docker build -t ${ECR_REGISTRY}/optimize-client:${IMAGE_TAG} ./client
    
    print_status "Pushing client image..."
    docker push ${ECR_REGISTRY}/optimize-client:${IMAGE_TAG}
    
    # Build and push server image
    print_status "Building server image..."
    # Ensure CSV files are in server directory
    cp demo_data_medium.csv demo_data_small.csv server/ 2>/dev/null || print_warning "CSV files not found in root directory"
    docker build -f server/Dockerfile -t ${ECR_REGISTRY}/optimize-server:${IMAGE_TAG} .
    
    print_status "Pushing server image..."
    docker push ${ECR_REGISTRY}/optimize-server:${IMAGE_TAG}
    
    print_success "Images built and pushed successfully"
}

# Function to update kubeconfig
update_kubeconfig() {
    print_status "Updating kubeconfig..."
    aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME
    
    # Verify cluster access
    if ! kubectl cluster-info >/dev/null 2>&1; then
        print_error "Unable to connect to EKS cluster. Please check your cluster name and region."
        exit 1
    fi
    
    print_success "Successfully connected to EKS cluster"
}

# Function to update deployment manifests
update_manifests() {
    print_status "Updating deployment manifests with correct image URIs..."
    
    # Create backup directory
    mkdir -p eks/backup
    
    # Backup original files
    cp eks/server-deployment.yaml eks/backup/server-deployment.yaml.bak 2>/dev/null || true
    cp eks/client-deployment.yaml eks/backup/client-deployment.yaml.bak 2>/dev/null || true
    
    # Update image URIs in deployment files
    sed -i.tmp "s|<AWS_ACCOUNT_ID>|${AWS_ACCOUNT_ID}|g" eks/server-deployment.yaml
    sed -i.tmp "s|<AWS_ACCOUNT_ID>|${AWS_ACCOUNT_ID}|g" eks/client-deployment.yaml
    sed -i.tmp "s|:latest|:${IMAGE_TAG}|g" eks/server-deployment.yaml
    sed -i.tmp "s|:latest|:${IMAGE_TAG}|g" eks/client-deployment.yaml
    
    # Clean up temporary files
    rm -f eks/*.tmp
    
    print_success "Manifests updated successfully"
}

# Function to deploy application
deploy_application() {
    print_status "Deploying application to EKS..."
    
    # Create namespace
    print_status "Creating namespace..."
    kubectl apply -f eks/namespace.yaml
    
    # Deploy server
    print_status "Deploying server..."
    kubectl apply -f eks/server-deployment.yaml
    
    # Deploy client
    print_status "Deploying client..."
    kubectl apply -f eks/client-deployment.yaml
    
    # Deploy ingress
    print_status "Deploying ingress..."
    kubectl apply -f eks/alb-ingress.yaml
    
    # Deploy HPA
    print_status "Deploying horizontal pod autoscalers..."
    kubectl apply -f eks/hpa.yaml
    
    print_success "All resources deployed"
}

# Function to wait for deployment
wait_for_deployment() {
    print_status "Waiting for deployments to be ready..."
    
    # Wait for server deployment
    if kubectl rollout status deployment/optimize-server -n $NAMESPACE --timeout=300s; then
        print_success "Server deployment is ready"
    else
        print_error "Server deployment failed to become ready"
        exit 1
    fi
    
    # Wait for client deployment
    if kubectl rollout status deployment/optimize-client -n $NAMESPACE --timeout=300s; then
        print_success "Client deployment is ready"
    else
        print_error "Client deployment failed to become ready"
        exit 1
    fi
}

# Function to get access information
get_access_info() {
    print_status "Getting access information..."
    
    # Wait for ingress to get an address
    print_status "Waiting for ALB to be provisioned (this may take a few minutes)..."
    
    local timeout=300
    local elapsed=0
    local interval=10
    
    while [ $elapsed -lt $timeout ]; do
        ALB_URL=$(kubectl get ingress optimize-alb-ingress -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || echo "")
        
        if [ -n "$ALB_URL" ]; then
            break
        fi
        
        echo -n "."
        sleep $interval
        elapsed=$((elapsed + interval))
    done
    
    echo ""
    
    if [ -n "$ALB_URL" ]; then
        print_success "Application is accessible at:"
        echo -e "${GREEN}🌐 Frontend: http://$ALB_URL${NC}"
        echo -e "${GREEN}🔧 API Health: http://$ALB_URL/api/health${NC}"
        
        # Test the endpoints
        print_status "Testing endpoints..."
        if curl -s -o /dev/null -w "%{http_code}" "http://$ALB_URL/api/health" | grep -q "200"; then
            print_success "API health check passed"
        else
            print_warning "API health check failed - may still be starting up"
        fi
    else
        print_warning "ALB URL not available yet. Check status with:"
        echo "kubectl get ingress optimize-alb-ingress -n $NAMESPACE"
    fi
}

# Function to show monitoring commands
show_monitoring_commands() {
    print_status "Useful monitoring commands:"
    echo ""
    echo -e "${BLUE}📊 Check all resources:${NC}"
    echo "kubectl get all -n $NAMESPACE"
    echo ""
    echo -e "${BLUE}📈 Check pods status:${NC}"
    echo "kubectl get pods -n $NAMESPACE"
    echo ""
    echo -e "${BLUE}📋 Check ingress:${NC}"
    echo "kubectl get ingress -n $NAMESPACE"
    echo ""
    echo -e "${BLUE}📝 Check logs:${NC}"
    echo "kubectl logs -f deployment/optimize-server -n $NAMESPACE"
    echo "kubectl logs -f deployment/optimize-client -n $NAMESPACE"
    echo ""
    echo -e "${BLUE}🔍 Describe resources:${NC}"
    echo "kubectl describe deployment optimize-server -n $NAMESPACE"
    echo "kubectl describe deployment optimize-client -n $NAMESPACE"
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "🚀 EKS Deployment Script for Optimize Product Offer Demo"
    echo "========================================================"
    echo -e "${NC}"
    echo "Configuration:"
    echo "- AWS Region: $AWS_REGION"
    echo "- Cluster Name: $CLUSTER_NAME"
    echo "- Namespace: $NAMESPACE"
    echo "- Image Tag: $IMAGE_TAG"
    echo "- ECR Registry: $ECR_REGISTRY"
    echo ""
    
    # Confirm before proceeding
    read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    check_prerequisites
    build_and_push_images
    update_kubeconfig
    update_manifests
    deploy_application
    wait_for_deployment
    get_access_info
    show_monitoring_commands
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. Test your application using the URLs above"
    echo "2. Set up a custom domain and SSL certificate if needed"
    echo "3. Configure monitoring and alerting"
    echo "4. Set up CI/CD pipeline for automated deployments"
}

# Handle script interruption
trap 'echo -e "\n${RED}❌ Deployment interrupted${NC}"; exit 1' INT TERM

# Run main function
main "$@"
