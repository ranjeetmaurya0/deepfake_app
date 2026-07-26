export interface CdnCacheRule {
  id: string;
  pattern: string;
  cacheTtl: string;
  edgeLocation: string;
  hitRatio: number;
  status: 'ACTIVE' | 'PURGING' | 'BYPASS';
  notes: string;
}

export interface ProductionChecklistGroup {
  category: string;
  items: {
    id: string;
    task: string;
    verifiedBy: string;
    status: 'VERIFIED' | 'PASSED' | 'COMPLETED';
    impact: string;
  }[];
}

export interface SlaMetric {
  metric: string;
  targetSla: string;
  currentValue: string;
  status: 'OPTIMAL' | 'COMPLIANT' | 'EXCEEDED';
  details: string;
}

export const CDN_CACHE_RULES_DATA: CdnCacheRule[] = [
  {
    id: 'cdn-01',
    pattern: '/forensics/heatmaps/*.png',
    cacheTtl: '86400s (24h)',
    edgeLocation: 'GCP Cloud CDN Edge (35+ Pops)',
    hitRatio: 98.6,
    status: 'ACTIVE',
    notes: 'Static GradCAM spatial heatmaps cached at global edge POPs to eliminate Triton GPU re-rendering overhead.'
  },
  {
    id: 'cdn-02',
    pattern: '/forensics/reports/pdf/*.pdf',
    cacheTtl: '604800s (7d)',
    edgeLocation: 'Cloudflare Enterprise Edge',
    hitRatio: 99.1,
    status: 'ACTIVE',
    notes: 'Immutable signed PDF forensic reports cached with public, max-age headers for instant global distribution.'
  },
  {
    id: 'cdn-03',
    pattern: '/static/bundle-*.js',
    cacheTtl: '31536000s (1yr)',
    edgeLocation: 'Global Edge Anycast',
    hitRatio: 99.8,
    status: 'ACTIVE',
    notes: 'Frontend SPA production Javascript and CSS assets with content hashing for zero-latency client loads.'
  }
];

export const SLA_METRICS_DATA: SlaMetric[] = [
  {
    metric: 'System Uptime SLA',
    targetSla: '99.99% Availability',
    currentValue: '99.998% Uptime',
    status: 'OPTIMAL',
    details: 'Multi-region GKE cluster failover with Cloud SQL HA standby guarantees zero unscheduled downtime.'
  },
  {
    metric: 'Media Ingestion & Analysis Latency',
    targetSla: 'p95 < 2500ms',
    currentValue: 'p95 = 1840ms',
    status: 'COMPLIANT',
    details: 'Full 30-frame tensor spatial & temporal inference completes within 1.84s per MP4 video file.'
  },
  {
    metric: 'REST API Query Latency',
    targetSla: 'p95 < 50ms',
    currentValue: 'p95 = 14ms',
    status: 'OPTIMAL',
    details: 'Redis 7 L2 cache eliminates PostgreSQL read contention for auth tokens and media metadata.'
  },
  {
    metric: 'Error Budget (30-day Window)',
    targetSla: '< 0.01% Error Rate',
    currentValue: '0.0012% Error Rate',
    status: 'OPTIMAL',
    details: '4.32 minutes remaining error budget out of 4.38 minutes monthly allowance.'
  }
];

export const PRODUCTION_CHECKLIST_DATA: ProductionChecklistGroup[] = [
  {
    category: 'Security & Secrets Management',
    items: [
      { id: 'chk-01', task: 'GCP Secret Manager integration for DB & JWT RS256 RSA keys', verifiedBy: 'Security Lead (Dr. Maurya)', status: 'VERIFIED', impact: 'Eliminates plaintext credentials in container environments.' },
      { id: 'chk-02', task: 'TLS 1.3 Strict HTTPS Transport Security (HSTS) enforcement', verifiedBy: 'DevOps Lead', status: 'VERIFIED', impact: 'Enforces end-to-end encrypted transport across all endpoints.' },
      { id: 'chk-03', task: 'OWASP ZAP automated vulnerability scan (Zero CVEs)', verifiedBy: 'SecOps Audit Team', status: 'VERIFIED', impact: 'Guarantees A+ security posture against injection & XSS attacks.' }
    ]
  },
  {
    category: 'Database & Data Persistence',
    items: [
      { id: 'chk-04', task: 'Cloud SQL PostgreSQL B-tree & Partial Indexing optimized', verifiedBy: 'DBA Lead', status: 'PASSED', impact: 'Accelerates audit log queries by 14x under heavy write loads.' },
      { id: 'chk-05', task: 'Automated multi-region point-in-time recovery (PITR) backups', verifiedBy: 'Cloud Architect', status: 'COMPLETED', impact: 'Ensures RPO < 1 min and RTO < 5 min during catastrophic failures.' }
    ]
  },
  {
    category: 'Scalability & Load Balancing',
    items: [
      { id: 'chk-06', task: 'Kubernetes Horizontal Pod Autoscaler (HPA) configured (2-20 pods)', verifiedBy: 'Site Reliability Eng', status: 'PASSED', impact: 'Autoscales Triton GPU workers dynamically on queue depth > 10.' },
      { id: 'chk-07', task: 'GCP Cloud CDN edge caching enabled for heatmaps & reports', verifiedBy: 'Infra Engineer', status: 'VERIFIED', impact: 'Reduces backend compute load by 98.6% for repeated report requests.' }
    ]
  }
];
