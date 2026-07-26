export interface TerraformModule {
  id: string;
  filename: string;
  category: 'Compute' | 'Database' | 'Storage' | 'Networking' | 'Security';
  description: string;
  codeSnippet: string;
}

export interface K8sManifest {
  id: string;
  filename: string;
  resourceType: 'Deployment' | 'Service' | 'Ingress' | 'HorizontalPodAutoscaler' | 'ConfigMap';
  description: string;
  yamlContent: string;
}

export interface DockerAndCicdConfig {
  id: string;
  title: string;
  type: 'Dockerfile' | 'CI/CD Pipeline' | 'Helm Values';
  filename: string;
  description: string;
  codeSnippet: string;
}

export const TERRAFORM_MODULES_DATA: TerraformModule[] = [
  {
    id: 'tf-cloud-run',
    filename: 'main.tf (Cloud Run & Service Account)',
    category: 'Compute',
    description: 'Terraform configuration provisioning serverless GCP Cloud Run v2 services with dual container sidecars, CPU/Memory limits, and automatic autoscaling (1 to 50 instances).',
    codeSnippet: `terraform {
  required_version = ">= 1.6.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.20.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# Service Account for Deepfake API Engine
resource "google_service_account" "deepfake_api_sa" {
  account_id   = "deepfake-forensics-api-sa"
  display_name = "Deepfake Forensics API Service Account"
}

# Cloud Run Service for Spring Boot API & React Frontend
resource "google_cloud_run_v2_service" "deepfake_app" {
  name     = "deepfake-forensics-platform"
  location = var.gcp_region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 2
      max_instance_count = 50
    }

    service_account = google_service_account.deepfake_api_sa.email

    containers {
      name  = "spring-boot-backend"
      image = "asia-southeast1-docker.pkg.dev/\${var.gcp_project_id}/deepfake-repo/backend-api:latest"

      resources {
        limits = {
          cpu    = "4000m"
          memory = "8Gi"
        }
      }

      env {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "prod"
      }
      env {
        name = "SPRING_DATASOURCE_URL"
        value_from {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "GEMINI_API_KEY"
        value_from {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_key.secret_id
            version = "latest"
          }
        }
      }

      ports {
        container_port = 8080
      }
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "ALL_TRAFFIC"
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}`
  },
  {
    id: 'tf-cloud-sql',
    filename: 'database.tf (Cloud SQL PostgreSQL 16)',
    category: 'Database',
    description: 'Provisions HA PostgreSQL 16 Cloud SQL instance with automatic failover, private IP VPC peering, SSD storage auto-resize, and automated nightly snapshots.',
    codeSnippet: `# Cloud SQL PostgreSQL 16 Instance
resource "google_sql_database_instance" "postgres_primary" {
  name             = "deepfake-postgres-primary"
  database_version = "POSTGRES_16"
  region           = var.gcp_region

  settings {
    tier              = "db-custom-4-16384" # 4 vCPU, 16 GB RAM
    availability_type = "REGIONAL"          # High Availability (Multi-AZ)
    disk_type         = "PD_SSD"
    disk_size         = 100
    disk_autoresize   = true

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc_network.id
      ssl_mode        = "ENCRYPTED_ONLY"
    }

    backup_configuration {
      enabled            = true
      start_time         = "03:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
    }

    database_flags {
      name  = "max_connections"
      value = "500"
    }
  }
}

resource "google_sql_database" "forensics_db" {
  name     = "deepfake_forensics_db"
  instance = google_sql_database_instance.postgres_primary.name
}

resource "google_sql_user" "app_db_user" {
  name     = "deepfake_admin"
  instance = google_sql_database_instance.postgres_primary.name
  password = var.db_password
}`
  },
  {
    id: 'tf-artifact-storage',
    filename: 'storage.tf (Artifact Registry & GCS Buckets)',
    category: 'Storage',
    description: 'Creates Docker Container Artifact Registry and encrypted Cloud Storage buckets for high-resolution forensic video uploads and tensor model checkpoints.',
    codeSnippet: `# Artifact Registry Docker Repository
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.gcp_region
  repository_id = "deepfake-repo"
  description   = "Docker Container Repository for Deepfake Forensics Microservices"
  format        = "DOCKER"
}

# GCS Bucket for Forensic Evidence Video Uploads
resource "google_storage_bucket" "evidence_bucket" {
  name shadow      = "deepfake-forensics-evidence-vault-\${var.gcp_project_id}"
  location      = var.gcp_region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  encryption {
    default_kms_key_name = google_kms_crypto_key.storage_key.id
  }
}`
  },
  {
    id: 'tf-networking',
    filename: 'network.tf (VPC, Subnets & Serverless VPC Access)',
    category: 'Networking',
    description: 'Configures isolated custom VPC, private subnets, NAT gateway, and Serverless VPC Access connector for secure database connectivity.',
    codeSnippet: `# Custom VPC Network
resource "google_compute_network" "vpc_network" {
  name                    = "deepfake-vpc-network"
  auto_create_subnetworks = false
}

# Subnet for GKE / Cloud Run Connector
resource "google_compute_subnetwork" "subnet_asia" {
  name          = "deepfake-subnet-asia"
  ip_cidr_range = "10.0.0.0/20"
  region        = var.gcp_region
  network       = google_compute_network.vpc_network.id
}

# Serverless VPC Access Connector for Cloud Run to Cloud SQL
resource "google_vpc_access_connector" "connector" {
  name          = "cloudrun-vpc-connector"
  region        = var.gcp_region
  ip_cidr_range = "10.8.0.0/28"
  network       = google_compute_network.vpc_network.name
}`
  }
];

export const K8S_MANIFESTS_DATA: K8sManifest[] = [
  {
    id: 'k8s-deployment',
    filename: 'deployment.yaml (Spring Boot API + Triton GPU Pods)',
    resourceType: 'Deployment',
    description: 'Kubernetes deployment manifest defining container replicas, resource requests (NVIDIA T4 GPUs), readiness/liveness probes, and rolling updates.',
    yamlContent: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: deepfake-forensics-api
  namespace: forensics-production
  labels:
    app: deepfake-forensics-api
    tier: backend
spec:
  replicas: 4
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: deepfake-forensics-api
  template:
    metadata:
      labels:
        app: deepfake-forensics-api
        tier: backend
    spec:
      containers:
      - name: spring-backend
        image: asia-southeast1-docker.pkg.dev/deepfake-project/deepfake-repo/backend-api:v1.2.0
        ports:
        - containerPort: 8080
          name: http-api
        resources:
          requests:
            memory: "4Gi"
            cpu: "2000m"
          limits:
            memory: "8Gi"
            cpu: "4000m"
        envFrom:
        - configMapRef:
            name: forensics-config
        - secretRef:
            name: forensics-secrets
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 5

      - name: triton-gpu-sidecar
        image: nvcr.io/nvidia/tritonserver:24.01-py3
        ports:
        - containerPort: 8001
          name: grpc-triton
        resources:
          limits:
            nvidia.com/gpu: 1
          requests:
            nvidia.com/gpu: 1
        args:
        - "tritonserver"
        - "--model-repository=/models"
        - "--strict-model-config=false"`
  },
  {
    id: 'k8s-hpa',
    filename: 'hpa.yaml (Horizontal Pod Autoscaler)',
    resourceType: 'HorizontalPodAutoscaler',
    description: 'Autoscales backend pods between 4 and 32 instances based on target CPU utilization (75%) and custom inference queue request metrics.',
    yamlContent: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: deepfake-api-hpa
  namespace: forensics-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: deepfake-forensics-api
  minReplicas: 4
  maxReplicas: 32
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 75
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80`
  },
  {
    id: 'k8s-ingress',
    filename: 'ingress.yaml (GKE Cloud Load Balancer & TLS)',
    resourceType: 'Ingress',
    description: 'GKE Cloud Ingress manifest managing Google-managed SSL/TLS certificates, rate limiting, and HTTP-to-HTTPS redirects.',
    yamlContent: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: deepfake-forensics-ingress
  namespace: forensics-production
  annotations:
    kubernetes.io/ingress.class: "gce"
    networking.gke.io/managed-certificates: "deepfake-ssl-cert"
    kubernetes.io/ingress.allow-http: "false"
spec:
  rules:
  - host: api.deepfake-forensics.org
    http:
      paths:
      - path: /*
        pathType: ImplementationSpecific
        backend:
          service:
            name: deepfake-forensics-service
            port:
              number: 80`
  }
];

export const DOCKER_CICD_DATA: DockerAndCicdConfig[] = [
  {
    id: 'cfg-dockerfile',
    title: 'Multi-Stage Production Dockerfile',
    type: 'Dockerfile',
    filename: 'Dockerfile (Spring Boot 3 + React SPA + Esbuild CJS)',
    description: 'Optimized multi-stage OCI Docker container build combining Maven Java 21 compilation, Vite React asset bundling, and Esbuild server bundling.',
    codeSnippet: `# Stage 1: Build React Vite Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Compile Spring Boot Java 21 Microservice
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 3: Minimal Production Runtime Container
FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /opt/app

# Security: Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

COPY --from=backend-builder /build/target/deepfake-forensics-backend-1.0.0.jar app.jar
COPY --from=frontend-builder /app/dist ./public

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]`
  },
  {
    id: 'cfg-github-actions',
    title: 'GitHub Actions Continuous Integration & Continuous Deployment (CI/CD)',
    type: 'CI/CD Pipeline',
    filename: '.github/workflows/deploy.yaml',
    description: 'Automated GitHub Actions workflow performing JUnit testing, SonarQube security SAST scans, Docker image publishing to GCP Artifact Registry, and zero-downtime Cloud Run deployment.',
    codeSnippet: `name: Build, Audit & Deploy Deepfake Forensics Platform

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  GCP_PROJECT: deepfake-forensics-prod
  GCP_REGION: asia-southeast1
  ARTIFACT_REPO: deepfake-repo
  IMAGE_NAME: backend-api

jobs:
  test-and-security-scan:
    name: Run Unit Tests & SAST Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 21
      uses: actions/setup-java@v4
      with:
        java-version: '21'
        distribution: 'temurin'
        cache: maven

    - name: Run Maven Unit & Integration Tests
      run: mvn test -Dtest=*UnitTest

    - name: SonarQube Security & Code Quality Analysis
      uses: SonarSource/sonarqube-scan-action@master
      env:
        SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}

  build-and-deploy:
    name: Build OCI Image & Deploy to GCP Cloud Run
    needs: test-and-security-scan
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - uses: actions/checkout@v4

    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v2
      with:
        credentials_json: \${{ secrets.GCP_SA_KEY }}

    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v2

    - name: Configure Docker for Artifact Registry
      run: gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet

    - name: Build and Push Docker Image
      run: |
        TAG=\${{ github.sha }}
        IMAGE_URI=asia-southeast1-docker.pkg.dev/\$GCP_PROJECT/\$ARTIFACT_REPO/\$IMAGE_NAME:\$TAG
        docker build -t \$IMAGE_URI -t asia-southeast1-docker.pkg.dev/\$GCP_PROJECT/\$ARTIFACT_REPO/\$IMAGE_NAME:latest .
        docker push \$IMAGE_URI
        docker push asia-southeast1-docker.pkg.dev/\$GCP_PROJECT/\$ARTIFACT_REPO/\$IMAGE_NAME:latest

    - name: Deploy to Cloud Run v2
      run: |
        gcloud run deploy deepfake-forensics-platform \\
          --image=asia-southeast1-docker.pkg.dev/\$GCP_PROJECT/\$ARTIFACT_REPO/\$IMAGE_NAME:\${{ github.sha }} \\
          --region=\$GCP_REGION \\
          --platform=managed \\
          --allow-unauthenticated`
  }
];
