# 🚀 Minikube Deployment Guide

Deploy OptimizeDemo to your local Kubernetes cluster using Minikube.

## 📋 Prerequisites

### Required Tools
```bash
# Install Minikube
brew install minikube

# Install kubectl
brew install kubectl

# Install Docker Desktop (if not already installed)
```

### System Requirements
- **Memory**: 4GB+ available RAM
- **CPU**: 2+ cores
- **Disk**: 10GB+ free space
- **Docker**: Docker Desktop running

## 🚀 Quick Deployment

### One-Command Deployment
```bash
./deploy-minikube.sh
```

This script will:
1. ✅ Start Minikube (if not running)
2. ✅ Enable required addons (ingress, metrics-server)
3. ✅ Build Docker images locally
4. ✅ Deploy all services to Kubernetes
5. ✅ Configure ingress and networking
6. ✅ Update /etc/hosts for local access
7. ✅ Open the app in your browser

## 📊 Manual Deployment Steps

If you prefer to deploy manually:

### 1. Start Minikube
```bash
minikube start --driver=docker --memory=4096 --cpus=2
minikube addons enable ingress
minikube addons enable metrics-server
```

### 2. Build Docker Images
```bash
# Set Docker environment to use Minikube's Docker daemon
eval $(minikube docker-env)

# Build images
docker build -f server/Dockerfile -t optimize-server:latest .
docker build -t optimize-client:latest ./client
```

### 3. Deploy to Kubernetes
```bash
# Create namespace and deploy services
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/server-deployment.yaml
kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Configure Local Access
```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Add to /etc/hosts
echo "$MINIKUBE_IP optimize.local" | sudo tee -a /etc/hosts
```

## 🌐 Access Your Application

After deployment:

- **Web App**: http://optimize.local
- **API Health**: http://optimize.local/api/health
- **Minikube Dashboard**: `minikube dashboard`

## 📊 Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Flask Server   │
│   (Port 80)     │    │   (Port 5000)   │
│   Nginx         │    │   Gunicorn      │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌─────────────┐
              │   Ingress   │
              │ optimize.local │
              └─────────────┘
```

## 🛠️ Management Commands

### Check Status
```bash
# View all pods
kubectl get pods -n optimize-demo

# Check service status
kubectl get services -n optimize-demo

# View ingress
kubectl get ingress -n optimize-demo
```

### View Logs
```bash
# Server logs
kubectl logs -f deployment/optimize-server -n optimize-demo

# Client logs
kubectl logs -f deployment/optimize-client -n optimize-demo

# Follow logs from specific pod
kubectl logs -f <pod-name> -n optimize-demo
```

### Debug Issues
```bash
# Describe deployments
kubectl describe deployment optimize-server -n optimize-demo
kubectl describe deployment optimize-client -n optimize-demo

# Check pod details
kubectl describe pod <pod-name> -n optimize-demo

# Execute into container
kubectl exec -it <pod-name> -n optimize-demo -- /bin/bash
```

### Scale Services
```bash
# Scale server replicas
kubectl scale deployment optimize-server --replicas=3 -n optimize-demo

# Scale client replicas
kubectl scale deployment optimize-client --replicas=3 -n optimize-demo
```

## 🔄 Docker Compose Alternative

For simpler local testing without Kubernetes:

```bash
# Start with Docker Compose
docker-compose up --build

# Access at:
# - Frontend: http://localhost:8080
# - API: http://localhost:5000/api/health
```

## 🧹 Cleanup

### Remove Deployment
```bash
# Delete namespace (removes all resources)
kubectl delete namespace optimize-demo

# Remove from /etc/hosts
sudo sed -i '' '/optimize.local/d' /etc/hosts
```

### Stop Minikube
```bash
minikube stop
minikube delete  # Completely remove cluster
```

## 🔧 Troubleshooting

### Common Issues

**Minikube won't start:**
```bash
minikube delete
minikube start --driver=docker --memory=4096 --cpus=2
```

**Images not found:**
```bash
# Make sure you're using Minikube's Docker daemon
eval $(minikube docker-env)
docker images  # Should show your built images
```

**Ingress not working:**
```bash
# Check ingress addon
minikube addons list | grep ingress
minikube addons enable ingress

# Wait for ingress controller
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
```

**DNS resolution issues:**
```bash
# Check /etc/hosts entry
grep optimize.local /etc/hosts

# Get Minikube IP
minikube ip

# Update entry if needed
sudo sed -i '' '/optimize.local/d' /etc/hosts
echo "$(minikube ip) optimize.local" | sudo tee -a /etc/hosts
```

### Health Checks

All services include health checks:

- **Server**: `/api/health`
- **Client**: `/health`
- **Kubernetes**: Liveness and readiness probes

## 🎯 Features

- ✅ **Auto-scaling**: Kubernetes manages replicas
- ✅ **Health monitoring**: Built-in health checks
- ✅ **Rolling updates**: Zero-downtime deployments
- ✅ **Load balancing**: Kubernetes services
- ✅ **Resource limits**: Memory and CPU constraints
- ✅ **Local development**: Easy setup with Minikube

## 📈 Monitoring

View cluster resources:
```bash
# Resource usage
kubectl top nodes
kubectl top pods -n optimize-demo

# Dashboard
minikube dashboard
```

Your OptimizeDemo is now running on Kubernetes! 🎉
