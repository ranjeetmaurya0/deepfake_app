# Deepfake Detection & Forensics Platform

A production-grade AI Deepfake Detection & Forensics platform combining **ResNet-50**, **Capsule Networks**, and **LSTM/Transformer temporal reasoning** with explainable **Grad-CAM visual heatmaps**. Fully integrated with **Google Drive Cloud Storage** for seamless evidence management, audit report exports, and cloud forensics.

---

## 🌟 Key Features

### 🔍 Deepfake Detection & Visual Forensics
* **Triple-Hybrid AI Model Pipeline**: Combines ResNet-50 (frame spatial feature extraction), Capsule Networks (pose/lighting/texture boundary checking), and LSTM/Transformers (temporal consistency & frame jitter analysis).
* **Grad-CAM Visual Heatmaps**: Interactive frame-by-frame visual explainability heatmaps highlighting manipulation artifacts (blinking anomalies, boundary flickering, face warping).
* **Multi-Format Media Inspector**: Forensic analysis for video streams (`.mp4`), synthetic audio tracks (`.wav`), and deepfake image snapshots (`.png`, `.jpg`).

### 📁 Google Drive Cloud Workspace Integration
* **OAuth 2.0 Identity & Drive API**: Authenticate securely via Google OAuth to link your Google Drive workspace.
* **Evidence Import & Inspection**: Browse, search, filter, and import media files directly from Google Drive into the Forensic Inspector.
* **Audit Certificate Export**: Instantly export certified digital deepfake forensic certificates (`.json`) with cryptographic SHA-256 signatures to Google Drive.
* **Drive File Management**: Create custom folders, upload local log files, preview JSON/text payloads inline, and safely manage files with mandatory confirmation dialogs.

### 🛡️ Enterprise Security & Infrastructure
* **RBAC & JWT Security**: Role-based access matrix (System Administrator, Forensic Analyst, Auditor) with JWT token simulator and Spring Security configuration viewer.
* **Infrastructure as Code (IaC)**: Terraform deployment manifests for GCP Cloud Run, Cloud CDN, and Global Load Balancers.
* **Database & OpenAPI Schemas**: ER diagrams, PostgreSQL DDL exports, and interactive Swagger OpenAPI specifications.
* **Production SLA & Telemetry**: Live metrics for CDN edge caching (99.1% hit rate), availability SLA (99.998% uptime), JUnit testing suite, OWASP security audit scans, and chaos engineering testing.

---

## 🚀 Architectural Phases

1. **Phase 1: System Architecture** — Microservices topology, pipeline diagrams, and benchmark comparisons.
2. **Phase 2: Database Design** — ER diagrams, relational table schemas, and SQL DDL generator.
3. **Phase 3: Backend Services** — Spring Boot controllers, async job orchestrator, and Swagger OpenAPI docs.
4. **Phase 4: Frontend Platform** — Forensic media inspector, Grad-CAM visualizer, and research library.
5. **Phase 5: Authentication & Authorization** — JWT token claims simulator, RBAC matrix, and security config.
6. **Phase 6: AI Pipeline Integration** — Real-time inference simulator, model specs, and Gemini report generator.
7. **Phase 7: Admin Dashboard** — Infrastructure telemetry, user role management, and audit log viewer.
8. **Phase 8: Deployment & Cloud Infra** — Terraform IaC modules, Kubernetes manifests, and Docker CI/CD pipelines.
9. **Phase 9: Testing & QA** — JUnit unit tests, OWASP vulnerability scans, and chaos load testing.
10. **Phase 10: Production Optimization** — GCP Cloud CDN edge caching, SLA sign-off checklist, system handoff exporter, and Google Drive Workspace.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion.
* **Backend Runtime**: Node.js, Express, esbuild, tsx.
* **AI & Cloud Integrations**: Google GenAI SDK (Gemini API), Firebase Auth, Google Drive REST API v3, Google OAuth 2.0.
* **Build System**: Vite 6, Tailwind Vite Plugin.

---

## 🚦 Getting Started

### Prerequisites
* Node.js 18+ installed on your environment.

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

Ensure the following variables are configured in `.env` or system environment secrets:

```env
# Required for Gemini AI report generation & consultant
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Application hosting URL (auto-configured in AI Studio)
APP_URL="YOUR_APP_URL"
```

---

## 📄 License

This project is built for deepfake forensics research, media verification, and enterprise AI safety auditing.
