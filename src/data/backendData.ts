import { ApiEndpoint, SpringCodeFile } from '../types';

export const API_ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'api-auth-login',
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'Authenticate user and return JWT access and refresh tokens',
    category: 'Authentication',
    security: 'Public',
    parameters: [
      { name: 'email', type: 'string', in: 'body', required: true, description: 'User login email', exampleValue: 'researcher@deepfake.org' },
      { name: 'password', type: 'string', in: 'body', required: true, description: 'User raw password', exampleValue: 'Password123!' }
    ],
    requestBodyExample: JSON.stringify({ email: 'researcher@deepfake.org', password: 'Password123!' }, null, 2),
    responseBodyExample: JSON.stringify({
      tokenType: 'Bearer',
      accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZXNlYXJjaGVyQGRlZXBmYWtlLm9yZyIsImlhdCI6MTY3MjU4OTYwMCwiZXhwIjoxNjcyNjA0MDAwfQ...',
      expiresInSeconds: 14400,
      refreshToken: 'd39f821a-6e54-4c8d-b6a2-9b5f8e121288',
      user: { id: 'usr-883921', fullName: 'Dr. Ranjeet Maurya', role: 'ROLE_RESEARCHER' }
    }, null, 2),
    statusCode: 200,
    javaControllerSnippet: `@PostMapping("/login")
public ResponseEntity<JwtAuthenticationResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
    );
    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = tokenProvider.generateToken(authentication);
    return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
}`
  },
  {
    id: 'api-predict-async',
    method: 'POST',
    path: '/api/v1/predictions/async',
    summary: 'Submit video/image media asset for async GPU inference via Kafka & Triton',
    category: 'Inference & Forensics',
    security: 'Bearer JWT',
    parameters: [
      { name: 'mediaId', type: 'string', in: 'body', required: true, description: 'UUID of uploaded video or image asset', exampleValue: '9f8b412e-128a-4c91-b31a-6e501a211902' },
      { name: 'priority', type: 'string', in: 'body', required: false, description: 'Batch queue priority (HIGH, STANDARD)', exampleValue: 'HIGH' }
    ],
    requestBodyExample: JSON.stringify({ mediaId: '9f8b412e-128a-4c91-b31a-6e501a211902', priority: 'HIGH' }, null, 2),
    responseBodyExample: JSON.stringify({
      jobId: 'job-99812-triton-kafka',
      status: 'QUEUED',
      mediaId: '9f8b412e-128a-4c91-b31a-6e501a211902',
      estimatedWaitTimeMs: 140,
      kafkaTopic: 'deepfake.inference.requests',
      pollingUrl: '/api/v1/predictions/jobs/job-99812-triton-kafka'
    }, null, 2),
    statusCode: 202,
    javaControllerSnippet: `@PostMapping("/async")
@PreAuthorize("hasRole('ROLE_RESEARCHER') or hasRole('ROLE_ADMIN')")
public ResponseEntity<InferenceJobResponse> submitAsyncPrediction(@Valid @RequestBody AsyncInferenceRequest request) {
    String jobId = inferenceOrchestratorService.dispatchToKafka(request.getMediaId(), request.getPriority());
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(new InferenceJobResponse(jobId, "QUEUED"));
}`
  },
  {
    id: 'api-predict-get',
    method: 'GET',
    path: '/api/v1/predictions/{predictionId}',
    summary: 'Retrieve complete deepfake prediction report with Grad-CAM & per-frame scores',
    category: 'Inference & Forensics',
    security: 'Public',
    parameters: [
      { name: 'predictionId', type: 'string', in: 'path', required: true, description: 'Unique Prediction UUID', exampleValue: 'pred-7712-ffraw-01' }
    ],
    responseBodyExample: JSON.stringify({
      id: 'pred-7712-ffraw-01',
      mediaId: 'vid-ffraw-001',
      isFake: true,
      confidenceScore: 0.9926,
      modelBranchScores: {
        resnet50Spatial: 0.9840,
        capsule3dStructure: 0.9912,
        lstmTemporal: 0.9985
      },
      gradCamHeatmapUrl: 'https://cdn.deepfake.org/heatmaps/pred-7712.png',
      processingTimeMs: 132,
      abstainTriggered: false,
      frameTimeline: [
        { frameIndex: 0, timeOffsetMs: 0, score: 0.9910, bbox: [120, 45, 224, 224] },
        { frameIndex: 1, timeOffsetMs: 200, score: 0.9945, bbox: [122, 46, 224, 224] }
      ]
    }, null, 2),
    statusCode: 200,
    javaControllerSnippet: `@GetMapping("/{predictionId}")
public ResponseEntity<PredictionDetailDto> getPredictionById(@PathVariable UUID predictionId) {
    PredictionDetailDto result = predictionService.findPredictionById(predictionId);
    return ResponseEntity.ok(result);
}`
  },
  {
    id: 'api-media-upload',
    method: 'POST',
    path: '/api/v1/media/upload',
    summary: 'Upload video or image file to S3/Cloud Storage with automatic SHA256 deduplication',
    category: 'Media Management',
    security: 'Bearer JWT',
    parameters: [
      { name: 'file', type: 'file (multipart/form-data)', in: 'body', required: true, description: 'Video or image binary payload' },
      { name: 'compressionLevel', type: 'string', in: 'body', required: false, description: 'CRF compression mode (Raw, HQ, LQ)', exampleValue: 'HQ' }
    ],
    responseBodyExample: JSON.stringify({
      mediaId: 'vid-88231-s3',
      originalFilename: 'test_celeb_deepfake.mp4',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      s3Url: 'https://storage.googleapis.com/deepfake-media-bucket/vid-88231.mp4',
      durationSeconds: 8.5,
      resolution: '1920x1080',
      status: 'PROCESSED'
    }, null, 2),
    statusCode: 201,
    javaControllerSnippet: `@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<MediaUploadResponse> uploadMediaFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam(value = "compressionLevel", defaultValue = "HQ") String compression) {
    MediaUploadResponse response = mediaStorageService.storeAndDeduplicate(file, compression);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}`
  },
  {
    id: 'api-papers-list',
    method: 'GET',
    path: '/api/v1/research/papers',
    summary: 'Search and filter research paper repository with BibTeX references',
    category: 'Research & Papers',
    security: 'Public',
    parameters: [
      { name: 'venue', type: 'string', in: 'query', required: false, description: 'Filter by publication venue (IEEE, IJRPR, ICCV)', exampleValue: 'IJRPR' },
      { name: 'year', type: 'integer', in: 'query', required: false, description: 'Publication year filter', exampleValue: '2025' }
    ],
    responseBodyExample: JSON.stringify({
      totalCount: 1,
      page: 0,
      size: 10,
      content: [
        {
          id: 'paper-maurya-2025',
          title: 'DEEPFAKE DETECTION USING DEEP LEARNING (ResNet-50 + Capsule Net + LSTM)',
          authors: ['Ranjeet Maurya', 'Dr. S. K. Gupta'],
          journalVenue: 'International Journal of Research Publication and Reviews (IJRPR)',
          publicationYear: 2025,
          pdfCloudUrl: 'https://cdn.deepfake.org/papers/Maurya_Deepfake_2025.pdf',
          bibtex: '@article{maurya2025deepfake, title={Deepfake Detection Using Deep Learning}...}'
        }
      ]
    }, null, 2),
    statusCode: 200,
    javaControllerSnippet: `@GetMapping
public ResponseEntity<Page<ResearchPaperDto>> listResearchPapers(
        @RequestParam(required = false) String venue,
        @RequestParam(required = false) Integer year,
        Pageable pageable) {
    Page<ResearchPaperDto> papers = paperRepositoryService.findPapers(venue, year, pageable);
    return ResponseEntity.ok(papers);
}`
  },
  {
    id: 'api-admin-audit',
    method: 'GET',
    path: '/api/v1/admin/audit-logs',
    summary: 'Query system security audit logs and AI model inference history',
    category: 'Admin & Audit',
    security: 'Admin Role Required',
    parameters: [
      { name: 'action', type: 'string', in: 'query', required: false, description: 'Action type (e.g. PREDICTION_RUN, MODEL_DEPLOY)', exampleValue: 'PREDICTION_RUN' }
    ],
    responseBodyExample: JSON.stringify({
      totalLogs: 1240,
      logs: [
        { id: 10291, userId: 'usr-883921', action: 'PREDICTION_RUN', entityType: 'predictions', ipAddress: '192.168.1.1', timestamp: '2026-07-25T10:30:00Z' }
      ]
    }, null, 2),
    statusCode: 200,
    javaControllerSnippet: `@GetMapping("/audit-logs")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public ResponseEntity<List<AuditLogDto>> getAuditLogs(@RequestParam(required = false) String action) {
    return ResponseEntity.ok(auditService.getLogs(action));
}`
  }
];

export const SPRING_CODE_FILES: SpringCodeFile[] = [
  {
    id: 'code-controller',
    fileName: 'PredictionController.java',
    packageName: 'org.deepfake.forensics.controller',
    layer: 'Controller',
    language: 'Java 21 / Spring Boot 3',
    code: `package org.deepfake.forensics.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.deepfake.forensics.dto.AsyncInferenceRequest;
import org.deepfake.forensics.dto.InferenceJobResponse;
import org.deepfake.forensics.dto.PredictionDetailDto;
import org.deepfake.forensics.service.InferenceOrchestratorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/predictions")
@Tag(name = "Inference & Forensics Controller", description = "Endpoints for Triple-Hybrid Deepfake AI classification")
public class PredictionController {

    private final InferenceOrchestratorService orchestratorService;

    public PredictionController(InferenceOrchestratorService orchestratorService) {
        this.orchestratorService = orchestratorService;
    }

    @PostMapping("/async")
    @PreAuthorize("hasAnyRole('ROLE_RESEARCHER', 'ROLE_ADMIN')")
    @Operation(summary = "Submit video for async Triton GPU batch inference via Kafka")
    public ResponseEntity<InferenceJobResponse> submitAsyncPrediction(@Valid @RequestBody AsyncInferenceRequest request) {
        InferenceJobResponse response = orchestratorService.submitToKafkaQueue(request.getMediaId(), request.getPriority());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @GetMapping("/{predictionId}")
    @Operation(summary = "Get detailed prediction report including ResNet, Capsule, and LSTM sub-scores")
    public ResponseEntity<PredictionDetailDto> getPredictionById(@PathVariable UUID predictionId) {
        PredictionDetailDto dto = orchestratorService.getPredictionReport(predictionId);
        return ResponseEntity.ok(dto);
    }
}`
  },
  {
    id: 'code-jpa-entity',
    fileName: 'PredictionEntity.java',
    packageName: 'org.deepfake.forensics.entity',
    layer: 'Entity (JPA)',
    language: 'Java 21 / Spring Boot 3',
    code: `package org.deepfake.forensics.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "predictions", indexes = {
    @Index(name = "idx_predictions_video", columnList = "video_id"),
    @Index(name = "idx_predictions_fake_confidence", columnList = "is_fake, confidence_score")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "video_id")
    private UUID videoId;

    @Column(name = "model_version", nullable = false)
    private String modelVersion;

    @Column(name = "is_fake", nullable = false)
    private Boolean isFake;

    @Column(name = "confidence_score", precision = 5, scale = 4, nullable = false)
    private BigDecimal confidenceScore;

    @Column(name = "spatial_score", precision = 5, scale = 4, nullable = false)
    private BigDecimal spatialScore;

    @Column(name = "capsule_score", precision = 5, scale = 4, nullable = false)
    private BigDecimal capsuleScore;

    @Column(name = "temporal_score", precision = 5, scale = 4, nullable = false)
    private BigDecimal temporalScore;

    @Column(name = "gradcam_heatmap_url", length = 500)
    private String gradCamHeatmapUrl;

    @Column(name = "processing_time_ms", nullable = false)
    private Integer processingTimeMs;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}`
  },
  {
    id: 'code-service',
    fileName: 'InferenceOrchestratorService.java',
    packageName: 'org.deepfake.forensics.service',
    layer: 'Service',
    language: 'Java 21 / Spring Boot 3',
    code: `package org.deepfake.forensics.service;

import org.deepfake.forensics.dto.InferenceJobResponse;
import org.deepfake.forensics.dto.PredictionDetailDto;
import org.deepfake.forensics.repository.PredictionRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InferenceOrchestratorService {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final PredictionRepository predictionRepository;

    public InferenceOrchestratorService(KafkaTemplate<String, Object> kafkaTemplate,
                                       PredictionRepository predictionRepository) {
        this.kafkaTemplate = kafkaTemplate;
        this.predictionRepository = predictionRepository;
    }

    @Transactional
    public InferenceJobResponse submitToKafkaQueue(UUID mediaId, String priority) {
        String jobId = "job-" + UUID.randomUUID().toString().substring(0, 8);
        kafkaTemplate.send("deepfake.inference.requests", jobId, mediaId.toString());
        return new InferenceJobResponse(jobId, "QUEUED", 130);
    }

    @Transactional(readOnly = true)
    public PredictionDetailDto getPredictionReport(UUID predictionId) {
        return predictionRepository.findById(predictionId)
            .map(PredictionDetailDto::fromEntity)
            .orElseThrow(() -> new RuntimeException("Prediction not found: " + predictionId));
    }
}`
  },
  {
    id: 'code-security',
    fileName: 'JwtAuthenticationFilter.java',
    packageName: 'org.deepfake.forensics.security',
    layer: 'DTO & Security',
    language: 'Java 21 / Spring Boot 3',
    code: `package org.deepfake.forensics.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = getJwtFromRequest(request);
        if (token != null && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUserIdFromJWT(token);
            var authorities = tokenProvider.getAuthoritiesFromJwt(token);
            
            var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}`
  }
];
