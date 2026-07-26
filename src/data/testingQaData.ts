export interface TestCase {
  id: string;
  name: string;
  category: 'Unit Test' | 'Integration Test' | 'Security Test' | 'Performance Test';
  targetClass: string;
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  assertionsCount: number;
  description: string;
  codeSnippet: string;
}

export interface SecurityVulnerability {
  id: string;
  cweId: string;
  title: string;
  severity: 'PASSED' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  cvssScore: number;
  category: string;
  endpointTested: string;
  mitigationStatus: 'MITIGATED' | 'REMEDIATED' | 'MONITORED';
  details: string;
  remediationCode: string;
}

export interface ChaosScenario {
  id: string;
  name: string;
  targetService: 'Triton Inference Engine' | 'Cloud SQL PostgreSQL' | 'Redis Auth Cache' | 'Kafka Consumer Group';
  faultType: 'Network Latency (+350ms)' | 'Pod Hard Crash' | 'Pool Connection Exhaustion' | 'Memory Leak Pressure';
  expectedSystemBehavior: string;
  resilienceVerdict: 'RECOVERED IN < 3s' | 'AUTOMATIC FAILOVER OK' | 'DEGRADED READ-ONLY OK';
  recoveryTimeMs: number;
}

export const JUNIT_TEST_CASES_DATA: TestCase[] = [
  {
    id: 'tc-001',
    name: 'testJwtSignatureVerificationWithRsa256Key()',
    category: 'Security Test',
    targetClass: 'JwtTokenProviderTest.java',
    status: 'PASSED',
    durationMs: 42,
    assertionsCount: 8,
    description: 'Validates that JWT tokens signed with unauthorized symmetric keys or expired RSA-256 signatures are rejected with HTTP 401 Unauthorized.',
    codeSnippet: `@Test
@DisplayName("Verify JWT RS256 Public Key Signature Validation")
void testJwtSignatureVerificationWithRsa256Key() {
    String validToken = jwtProvider.createToken("dr.ranjeet", List.of("ROLE_ADMIN"));
    assertThat(jwtProvider.validateToken(validToken)).isTrue();

    String tamperedToken = validToken.substring(0, validToken.length() - 5) + "X9aZ";
    assertThatThrownBy(() -> jwtProvider.validateToken(tamperedToken))
        .isInstanceOf(JwtException.class)
        .hasMessageContaining("Invalid JWT signature");
}`
  },
  {
    id: 'tc-002',
    name: 'testSpatialFrame30TensorExtractionPipeline()',
    category: 'Integration Test',
    targetClass: 'TensorPipelineIntegrationTest.java',
    status: 'PASSED',
    durationMs: 184,
    assertionsCount: 12,
    description: 'Ensures 30 uniform frames extracted from MP4 video streams are resized to (30, 224, 224, 3) normalized float32 tensors with zero dropped frames.',
    codeSnippet: `@Test
@DisplayName("Verify 30-Frame Tensor Preprocessing & Normalization Pipeline")
void testSpatialFrame30TensorExtractionPipeline() throws Exception {
    byte[] testVideoBytes = TestUtils.loadSampleVideo("deepfake_sample_01.mp4");
    TensorBatch tensorBatch = frameExtractor.extract30Frames(testVideoBytes);

    assertThat(tensorBatch.getFrameCount()).isEqualTo(30);
    assertThat(tensorBatch.getDimensions()).containsExactly(30, 224, 224, 3);
    assertThat(tensorBatch.getMeanPixelValue()).isBetween(0.40f, 0.50f);
}`
  },
  {
    id: 'tc-003',
    name: 'testRestAssuredForensicMediaAnalysisEndpoint()',
    category: 'Integration Test',
    targetClass: 'ForensicApiRestAssuredTest.java',
    status: 'PASSED',
    durationMs: 310,
    assertionsCount: 15,
    description: 'E2E REST API integration test verifying multipart upload of MP4 evidence returns HTTP 200 with spatial & temporal fake confidence scores.',
    codeSnippet: `@Test
@DisplayName("E2E Forensic REST Endpoint Upload & Heatmap Response Test")
void testRestAssuredForensicMediaAnalysisEndpoint() {
    given()
        .header("Authorization", "Bearer " + adminJwtToken)
        .multiPart("file", new File("src/test/resources/sample.mp4"))
        .param("modelType", "XCEPTIONS_EFFICIENTNET_V2")
    .when()
        .post("/api/v1/forensics/analyze-media")
    .then()
        .statusCode(200)
        .body("overallFakeProbability", greaterThanOrEqualTo(0.0f))
        .body("spatialModelScore", notNullValue())
        .body("gradCamHeatmapUrl", startsWith("https://storage.googleapis.com/"));
}`
  },
  {
    id: 'tc-004',
    name: 'testSpringSecurityRoleBasedAccessControl()',
    category: 'Security Test',
    targetClass: 'RbacAuthoritySecurityTest.java',
    status: 'PASSED',
    durationMs: 65,
    assertionsCount: 10,
    description: 'Ensures ROLE_ANALYST cannot trigger administrative user role modifications or access system hardware telemetry endpoints (returns 403 Forbidden).',
    codeSnippet: `@Test
@WithMockUser(username = "analyst_user", roles = {"ANALYST"})
@DisplayName("Verify ROLE_ANALYST receives HTTP 403 on Admin Endpoints")
void testSpringSecurityRoleBasedAccessControl() throws Exception {
    mockMvc.perform(get("/api/v1/admin/telemetry"))
        .andExpect(status().isForbidden());

    mockMvc.perform(post("/api/v1/admin/users/role-grant"))
        .andExpect(status().isForbidden());
}`
  },
  {
    id: 'tc-005',
    name: 'testDatabaseConnectionPoolExhaustionAndRecovery()',
    category: 'Performance Test',
    targetClass: 'HikariCpPoolResilienceTest.java',
    status: 'PASSED',
    durationMs: 420,
    assertionsCount: 6,
    description: 'Simulates 50 concurrent SQL queries against HikariCP max 30 connection pool and verifies zero connection leaks with timeout backoff.',
    codeSnippet: `@Test
@DisplayName("HikariCP Connection Pool Stress & Leak Verification")
void testDatabaseConnectionPoolExhaustionAndRecovery() throws Exception {
    ExecutorService executor = Executors.newFixedThreadPool(50);
    List<Future<Boolean>> futures = new ArrayList<>();

    for (int i = 0; i < 50; i++) {
        futures.add(executor.submit(() -> dbRepository.executeTestQuery()));
    }

    for (Future<Boolean> f : futures) {
        assertThat(f.get(5, TimeUnit.SECONDS)).isTrue();
    }
    assertThat(hikariDataSource.getHikariPoolMXBean().getActiveConnections()).isEqualTo(0);
}`
  }
];

export const OWASP_VULNERABILITIES_DATA: SecurityVulnerability[] = [
  {
    id: 'owasp-01',
    cweId: 'CWE-89',
    title: 'SQL Injection Prevention (Prepared Statements & Hibernate ORM)',
    severity: 'PASSED',
    cvssScore: 0.0,
    category: 'Injection Vulnerabilities',
    endpointTested: 'ALL POST / GET Endpoints',
    mitigationStatus: 'MITIGATED',
    details: 'All database queries use Spring Data JPA parameterized Criteria API and Spring JDBC NamedParameterJdbcTemplate. SQL string concatenation is strictly forbidden.',
    remediationCode: `// SECURE IMPLEMENTATION: Parameterized Query
@Query("SELECT f FROM ForensicAnalysisRecord f WHERE f.user.id = :userId AND f.status = :status")
List<ForensicAnalysisRecord> findByUserIdAndStatus(
    @Param("userId") String userId, 
    @Param("status") AnalysisStatus status
);`
  },
  {
    id: 'owasp-02',
    cweId: 'CWE-79',
    title: 'Cross-Site Scripting (XSS) Sanitization & Content Security Policy',
    severity: 'PASSED',
    cvssScore: 0.0,
    category: 'XSS & Output Encoding',
    endpointTested: 'GET /api/v1/reports/*',
    mitigationStatus: 'MITIGATED',
    details: 'HTTP Headers contain strict Content-Security-Policy (CSP) headers with script-src self restriction and DOMPurify HTML sanitization applied on all frontend report views.',
    remediationCode: `// Spring Security CSP Configuration
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("default-src 'self'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none';")
    )
);`
  },
  {
    id: 'owasp-03',
    cweId: 'CWE-306',
    title: 'Broken Access Control & Missing Authentication Check',
    severity: 'PASSED',
    cvssScore: 0.0,
    category: 'Authentication & Session Management',
    endpointTested: 'POST /api/v1/admin/user-provision',
    mitigationStatus: 'REMEDIATED',
    details: 'Enforces Spring Security @PreAuthorize("hasRole(\'ADMIN\')") annotation on all administrative endpoints backed by JWT token validation filter.',
    remediationCode: `@PreAuthorize("hasRole('ROLE_ADMIN')")
@PostMapping("/user-provision")
public ResponseEntity<UserDTO> provisionUser(@Valid @RequestBody UserProvisionRequest request) {
    return ResponseEntity.ok(userService.provisionUser(request));
}`
  },
  {
    id: 'owasp-04',
    cweId: 'CWE-319',
    title: 'Cleartext Transmission of Sensitive Information (TLS 1.3 Enforcement)',
    severity: 'PASSED',
    cvssScore: 0.0,
    category: 'Cryptographic Failures',
    endpointTested: 'GKE Ingress / Cloud Run',
    mitigationStatus: 'MITIGATED',
    details: 'HSTS (HTTP Strict Transport Security) header enforced with max-age=31536000 and plain HTTP traffic automatically redirected to HTTPS (TLS 1.3).',
    remediationCode: `http.headers(headers -> headers
    .httpStrictTransportSecurity(hsts -> hsts
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000)
    )
);`
  }
];

export const CHAOS_SCENARIOS_DATA: ChaosScenario[] = [
  {
    id: 'chaos-01',
    name: 'Triton GPU Worker Pod Sudden Hard Crash',
    targetService: 'Triton Inference Engine',
    faultType: 'Pod Hard Crash',
    expectedSystemBehavior: 'Kubernetes liveness probe detects failure in 5s. Traffic automatically shifts to 3 healthy standby Triton pods.',
    resilienceVerdict: 'RECOVERED IN < 3s',
    recoveryTimeMs: 2400
  },
  {
    id: 'chaos-02',
    name: 'Cloud SQL PostgreSQL Primary DB Failover',
    targetService: 'Cloud SQL PostgreSQL',
    faultType: 'Pool Connection Exhaustion',
    expectedSystemBehavior: 'HikariCP connection pool holds pending queries for 30s. Cloud SQL HA failover switches to standby replica in 1.8 seconds.',
    resilienceVerdict: 'AUTOMATIC FAILOVER OK',
    recoveryTimeMs: 1800
  },
  {
    id: 'chaos-03',
    name: 'Redis JWT Blacklist Cache Outage',
    targetService: 'Redis Auth Cache',
    faultType: 'Network Latency (+350ms)',
    expectedSystemBehavior: 'Fallback strategy verifies JWT against PostgreSQL database directly. Read latency degrades from 2ms to 18ms without service interruption.',
    resilienceVerdict: 'DEGRADED READ-ONLY OK',
    recoveryTimeMs: 450
  }
];
