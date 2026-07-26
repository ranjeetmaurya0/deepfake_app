export type AppPhase =
  | 'Phase 1: System Architecture'
  | 'Phase 2: Database Design'
  | 'Phase 3: Backend Services'
  | 'Phase 4: Frontend Platform'
  | 'Phase 5: Authentication & Authorization'
  | 'Phase 6: AI Pipeline Integration'
  | 'Phase 7: Admin Dashboard'
  | 'Phase 8: Deployment & Cloud Infra'
  | 'Phase 9: Testing & QA'
  | 'Phase 10: Production Optimization';

export interface ArchitectureNode {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  category: 'Ingestion' | 'Preprocessing' | 'Spatial' | 'Structural' | 'Temporal' | 'Inference' | 'Storage';
  inputTensor: string;
  outputTensor: string;
  parameters: string;
  latencyAvg: string;
  keyTech: string[];
  description: string;
  mathematicalFormula?: string;
  failureModesMitigated: string[];
  codeSnippet: string;
}

export interface ResearchBenchmark {
  dataset: string;
  manipulationType: string;
  compression: 'Raw' | 'HQ (CRF 23)' | 'LQ (CRF 40)';
  accuracy: number;
  aucScore: number;
  eer: number;
  sampleCount: string;
  referencePaper: string;
}

export interface DataPipelineStage {
  step: number;
  name: string;
  throughput: string;
  hardwareTarget: 'CPU Cluster' | 'NVIDIA Triton GPU' | 'Kafka Queue' | 'Redis Cache';
  transformDetails: string;
}

export interface InspectionSample {
  id: string;
  title: string;
  sourceDataset: string;
  manipulationMethod: string;
  isFake: boolean;
  confidenceScore: number;
  gradCamFocusRegion: string;
  tensorFrames: number;
  spatialScore: number;
  capsuleScore: number;
  temporalScore: number;
  frameThumbnails: string[];
}

export interface DbColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  isNullable: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  description: string;
}

export interface DbIndex {
  name: string;
  columns: string[];
  type: 'BTREE' | 'HASH' | 'GIN' | 'UNIQUE';
  purpose: string;
}

export interface DbTable {
  id: string;
  tableName: string;
  displayName: string;
  moduleGroup: 'Core Auth' | 'Media Management' | 'Research & Papers' | 'AI Inference & Forensics' | 'Content & Communications';
  description: string;
  estimatedRows: string;
  columns: DbColumn[];
  indexes: DbIndex[];
}

export interface DbRelationship {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: '1:1' | '1:N' | 'N:M';
  onDelete: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

export interface ApiEndpointParam {
  name: string;
  type: string;
  in: 'path' | 'query' | 'header' | 'body';
  required: boolean;
  description: string;
  exampleValue?: string;
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  category: 'Authentication' | 'Inference & Forensics' | 'Media Management' | 'Research & Papers' | 'Admin & Audit';
  security: 'Public' | 'Bearer JWT' | 'Admin Role Required';
  parameters: ApiEndpointParam[];
  requestBodyExample?: string;
  responseBodyExample: string;
  statusCode: number;
  javaControllerSnippet: string;
}

export interface SpringCodeFile {
  id: string;
  fileName: string;
  packageName: string;
  layer: 'Controller' | 'Service' | 'Repository' | 'Entity (JPA)' | 'DTO & Security';
  language: 'Java 21 / Spring Boot 3' | 'TypeScript Express';
  code: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  journalVenue: string;
  publicationYear: number;
  doi?: string;
  abstractText: string;
  keyContributions: string[];
  bibtex: string;
  pdfUrl: string;
  citationCount: number;
  isPrimaryPaper?: boolean;
}

export interface ContactFormRequest {
  fullName: string;
  email: string;
  organization: string;
  role: 'Researcher' | 'Law Enforcement / Forensics' | 'Enterprise Security' | 'Student / Educator';
  subject: string;
  message: string;
}

export interface ForensicFrameData {
  frameIndex: number;
  timeOffsetMs: number;
  thumbnailUrl: string;
  spatialScore: number;
  capsuleScore: number;
  temporalScore: number;
  gradCamHeatmapUrl: string;
  boundingBox: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  detectedArtifacts: string[];
}

export interface ForensicAnalysisReport {
  analysisId: string;
  mediaFilename: string;
  fileSizeBytes: number;
  resolution: string;
  fps: number;
  durationSeconds: number;
  sha256Hash: string;
  timestamp: string;
  isFake: boolean;
  calibratedConfidence: number;
  verdictLabel: 'DEEPFAKE FORGERY DETECTED' | 'AUTHENTIC MEDIA VERIFIED' | 'UNCERTAIN / ABSTAIN';
  spatialResNetScore: number;
  structuralCapsuleScore: number;
  temporalLstmScore: number;
  frames: ForensicFrameData[];
  processingTimeMs: number;
}

export type UserRole = 'ROLE_ANONYMOUS' | 'ROLE_RESEARCHER' | 'ROLE_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface JwtClaims {
  sub: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export interface DecodedJwtToken {
  header: {
    alg: 'HS256';
    typ: 'JWT';
  };
  payload: JwtClaims;
  signature: string;
  isExpired: boolean;
  rawToken: string;
}

export interface RbacPermission {
  permissionId: string;
  endpointPath: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
  summary: string;
  allowedRoles: UserRole[];
  description: string;
}


