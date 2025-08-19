# AWS EKS Deployment Guide - Optimize Product Offer Demo

This guide will help you deploy the Optimize Product Offer application on AWS EKS and expose it to the internet.

## Prerequisites

- AWS CLI configured with appropriate permissions
- kubectl installed
- eksctl installed
- Docker images pushed to a container registry (ECR recommended)
- Domain name for production deployment (optional)

## Table of Contents

1. [EKS Cluster Setup](#1-eks-cluster-setup)
2. [Container Registry Setup](#2-container-registry-setup)
3. [AWS Load Balancer Controller](#3-aws-load-balancer-controller)
4. [Deploy Application](#4-deploy-application)
5. [Internet Exposure](#5-internet-exposure)
6. [DNS and SSL Setup](#6-dns-and-ssl-setup)
7. [Monitoring and Scaling](#7-monitoring-and-scaling)
8. [Cleanup](#8-cleanup)

## 1. EKS Cluster Setup

### Create EKS Cluster

```bash
# Create EKS cluster
eksctl create cluster \
  --name optimize-demo \
  --region us-west-2 \
  --nodegroup-name optimize-nodes \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed

# Update kubeconfig
aws eks update-kubeconfig --region us-west-2 --name optimize-demo

# Verify cluster
kubectl get nodes
```

### Alternative: Using cluster configuration file

Create `eks-cluster.yaml`:

```yaml
apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
  name: optimize-demo
  region: us-west-2
  version: "1.28"

nodeGroups:
  - name: optimize-nodes
    instanceType: t3.medium
    desiredCapacity: 2
    minSize: 1
    maxSize: 4
    volumeSize: 20
    ssh:
      allow: false
    iam:
      withAddonPolicies:
        autoScaler: true
        awsLoadBalancerController: true
        ebs: true
        efs: true
        certManager: true

addons:
  - name: vpc-cni
    version: latest
  - name: coredns
    version: latest
  - name: kube-proxy
    version: latest
  - name: aws-ebs-csi-driver
    version: latest
```

Deploy with:
```bash
eksctl create cluster -f eks-cluster.yaml
```

## 2. Container Registry Setup

### Create ECR Repositories

```bash
# Create ECR repositories
aws ecr create-repository --repository-name optimize-client --region us-west-2
aws ecr create-repository --repository-name optimize-server --region us-west-2

# Get ECR login token
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com
```

### Build and Push Images

```bash
# Get your AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.us-west-2.amazonaws.com"

# Build and push client image
docker build -t ${ECR_REGISTRY}/optimize-client:latest ./client
docker push ${ECR_REGISTRY}/optimize-client:latest

# Build and push server image  
docker build -f server/Dockerfile -t ${ECR_REGISTRY}/optimize-server:latest .
docker push ${ECR_REGISTRY}/optimize-server:latest
```

## 3. AWS Load Balancer Controller

The AWS Load Balancer Controller is required for internet-facing load balancers.

### Install AWS Load Balancer Controller

```bash
# Create IAM OIDC provider
eksctl utils associate-iam-oidc-provider --region=us-west-2 --cluster=optimize-demo --approve

# Create IAM service account
eksctl create iamserviceaccount \
  --cluster=optimize-demo \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::aws:policy/ElasticLoadBalancingFullAccess \
  --override-existing-serviceaccounts \
  --approve

# Install AWS Load Balancer Controller using Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=optimize-demo \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller
```

### Alternative: Install using kubectl

```bash
# Download and apply the controller
curl -o v2_5_4_full.yaml https://github.com/kubernetes-sigs/aws-load-balancer-controller/releases/download/v2.5.4/v2_5_4_full.yaml

# Edit the file to set cluster name
sed -i.bak -e 's|your-cluster-name|optimize-demo|g' v2_5_4_full.yaml

kubectl apply -f v2_5_4_full.yaml
```

### Verify Installation

```bash
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## 4. Deploy Application

### Create Production Namespace

```bash
kubectl create namespace optimize-production
```

### Update Image References

Create `eks/server-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: optimize-server
  namespace: optimize-production
  labels:
    app: optimize-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: optimize-server
  template:
    metadata:
      labels:
        app: optimize-server
    spec:
      containers:
      - name: optimize-server
        image: <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com/optimize-server:latest
        ports:
        - containerPort: 5000
        env:
        - name: FLASK_ENV
          value: production
        - name: PORT
          value: "5000"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 15
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: optimize-server
  namespace: optimize-production
spec:
  selector:
    app: optimize-server
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
  type: ClusterIP
```

Create `eks/client-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: optimize-client
  namespace: optimize-production
  labels:
    app: optimize-client
spec:
  replicas: 3
  selector:
    matchLabels:
      app: optimize-client
  template:
    metadata:
      labels:
        app: optimize-client
    spec:
      containers:
      - name: optimize-client
        image: <AWS_ACCOUNT_ID>.dkr.ecr.us-west-2.amazonaws.com/optimize-client:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: optimize-client
  namespace: optimize-production
spec:
  selector:
    app: optimize-client
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

## 5. Internet Exposure

### Option A: Application Load Balancer (Recommended)

Create `eks/alb-ingress.yaml`:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: optimize-alb-ingress
  namespace: optimize-production
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    alb.ingress.kubernetes.io/healthcheck-path: /health
    alb.ingress.kubernetes.io/healthcheck-interval-seconds: '15'
    alb.ingress.kubernetes.io/healthcheck-timeout-seconds: '5'
    alb.ingress.kubernetes.io/success-codes: '200'
    alb.ingress.kubernetes.io/healthy-threshold-count: '2'
    alb.ingress.kubernetes.io/unhealthy-threshold-count: '2'
    # alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:us-west-2:123456789012:certificate/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
spec:
  rules:
  - host: optimize-demo.yourdomain.com  # Replace with your domain
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: optimize-server
            port:
              number: 5000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: optimize-client
            port:
              number: 80
  # For development/testing without domain:
  - http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: optimize-server
            port:
              number: 5000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: optimize-client
            port:
              number: 80
```

### Option B: Network Load Balancer

Create `eks/nlb-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: optimize-nlb
  namespace: optimize-production
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: "nlb"
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  selector:
    app: optimize-client
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

## 6. DNS and SSL Setup

### Request SSL Certificate (if using custom domain)

```bash
# Request certificate using AWS Certificate Manager
aws acm request-certificate \
    --domain-name optimize-demo.yourdomain.com \
    --subject-alternative-names "*.yourdomain.com" \
    --validation-method DNS \
    --region us-west-2

# Get certificate ARN
aws acm list-certificates --region us-west-2
```

### Update Route 53 (if using AWS Route 53)

```bash
# Get ALB DNS name
kubectl get ingress optimize-alb-ingress -n optimize-production

# Create Route 53 record
aws route53 change-resource-record-sets \
    --hosted-zone-id Z1234567890ABC \
    --change-batch '{
        "Changes": [{
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "optimize-demo.yourdomain.com",
                "Type": "CNAME",
                "TTL": 300,
                "ResourceRecords": [{"Value": "k8s-optimiz-optimiz-xxxxxxxxxx-yyyyyyyyyy.us-west-2.elb.amazonaws.com"}]
            }
        }]
    }'
```

## 7. Monitoring and Scaling

### Horizontal Pod Autoscaler

Create `eks/hpa.yaml`:

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: optimize-client-hpa
  namespace: optimize-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: optimize-client
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: optimize-server-hpa
  namespace: optimize-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: optimize-server
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Cluster Autoscaler

```bash
# Enable cluster autoscaler
eksctl create iamserviceaccount \
  --cluster=optimize-demo \
  --namespace=kube-system \
  --name=cluster-autoscaler \
  --attach-policy-arn=arn:aws:iam::aws:policy/AutoScalingFullAccess \
  --override-existing-serviceaccounts \
  --approve

# Deploy cluster autoscaler
kubectl apply -f https://raw.githubusercontent.com/kubernetes/autoscaler/master/cluster-autoscaler/cloudprovider/aws/examples/cluster-autoscaler-autodiscover.yaml
```

## 8. Deployment Commands

### Complete Deployment Script

Create `deploy-to-eks.sh`:

```bash
#!/bin/bash

set -e

# Configuration
AWS_REGION="us-west-2"
CLUSTER_NAME="optimize-demo"
NAMESPACE="optimize-production"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "🚀 Starting EKS deployment..."

# Update kubeconfig
echo "📋 Updating kubeconfig..."
aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME

# Create namespace
echo "📁 Creating namespace..."
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Update deployment files with correct image URIs
echo "🔄 Updating deployment files..."
sed -i.bak "s|<AWS_ACCOUNT_ID>|${AWS_ACCOUNT_ID}|g" eks/server-deployment.yaml
sed -i.bak "s|<AWS_ACCOUNT_ID>|${AWS_ACCOUNT_ID}|g" eks/client-deployment.yaml

# Deploy applications
echo "🏗️ Deploying server..."
kubectl apply -f eks/server-deployment.yaml

echo "🏗️ Deploying client..."
kubectl apply -f eks/client-deployment.yaml

# Deploy ingress
echo "🌐 Deploying ingress..."
kubectl apply -f eks/alb-ingress.yaml

# Deploy HPA
echo "📈 Deploying autoscalers..."
kubectl apply -f eks/hpa.yaml

# Wait for deployment
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/optimize-server -n $NAMESPACE
kubectl rollout status deployment/optimize-client -n $NAMESPACE

# Get ingress URL
echo "🎉 Deployment complete!"
echo "📡 Getting ingress URL..."
kubectl get ingress optimize-alb-ingress -n $NAMESPACE

echo "✅ Application should be accessible via the ALB DNS name shown above"
echo "🔍 Monitor with: kubectl get pods -n $NAMESPACE"
```

### Make it executable and run

```bash
chmod +x deploy-to-eks.sh
./deploy-to-eks.sh
```

## 9. Verification and Testing

### Check Deployment Status

```bash
# Check all resources
kubectl get all -n optimize-production

# Check ingress
kubectl get ingress -n optimize-production

# Check logs
kubectl logs -f deployment/optimize-server -n optimize-production
kubectl logs -f deployment/optimize-client -n optimize-production

# Test endpoints
ALB_URL=$(kubectl get ingress optimize-alb-ingress -n optimize-production -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
curl http://$ALB_URL/api/health
```

## 10. Cleanup

### Delete Application

```bash
kubectl delete namespace optimize-production
```

### Delete EKS Cluster

```bash
eksctl delete cluster --name optimize-demo --region us-west-2
```

### Delete ECR Repositories

```bash
aws ecr delete-repository --repository-name optimize-client --region us-west-2 --force
aws ecr delete-repository --repository-name optimize-server --region us-west-2 --force
```

## Security Best Practices

1. **Use private subnets for nodes**
2. **Enable encryption at rest**
3. **Use AWS Secrets Manager for sensitive data**
4. **Implement network policies**
5. **Regular security updates**
6. **Monitor with AWS CloudTrail**

## Cost Optimization

1. **Use Spot instances for non-critical workloads**
2. **Right-size your instances**
3. **Use AWS Fargate for serverless containers**
4. **Monitor costs with AWS Cost Explorer**

## Troubleshooting

### Common Issues

1. **Load Balancer Controller not working**: Check IAM permissions
2. **Pods not starting**: Check resource limits and image pull secrets
3. **Service mesh issues**: Verify security groups and NACLs
4. **DNS resolution**: Check CoreDNS configuration

### Useful Commands

```bash
# Debug pods
kubectl describe pod <pod-name> -n optimize-production

# Check events
kubectl get events -n optimize-production --sort-by=.metadata.creationTimestamp

# Port forward for testing
kubectl port-forward svc/optimize-client 8080:80 -n optimize-production
```

---

This guide provides a complete production-ready deployment of your Optimize Product Offer application on AWS EKS with internet exposure. Adjust the configurations based on your specific requirements and security policies.
