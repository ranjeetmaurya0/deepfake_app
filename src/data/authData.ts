import { AuthUser, DecodedJwtToken, RbacPermission } from '../types';

export const MOCK_USERS: AuthUser[] = [
  {
    id: 'usr-researcher-001',
    email: 'ranjeet.maurya@deepfake-lab.org',
    fullName: 'Dr. Ranjeet Maurya',
    role: 'ROLE_RESEARCHER',
    organization: 'Deepfake Forensics Research Lab',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-01-15T08:30:00Z'
  },
  {
    id: 'usr-admin-002',
    email: 'admin.security@deepfake-lab.org',
    fullName: 'Platform Security Administrator',
    role: 'ROLE_ADMIN',
    organization: 'Deepfake Detection Infrastructure Team',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2024-11-01T10:00:00Z'
  },
  {
    id: 'usr-anonymous-000',
    email: 'guest.visitor@public.net',
    fullName: 'Anonymous Guest Visitor',
    role: 'ROLE_ANONYMOUS',
    organization: 'Public Unauthenticated Access',
    createdAt: '2026-07-25T12:00:00Z'
  }
];

export const RBAC_PERMISSIONS_MATRIX: RbacPermission[] = [
  {
    permissionId: 'perm-auth-login',
    endpointPath: '/api/v1/auth/login',
    httpMethod: 'POST',
    summary: 'Authenticate User & Issue JWT Token Pair',
    allowedRoles: ['ROLE_ANONYMOUS', 'ROLE_RESEARCHER', 'ROLE_ADMIN'],
    description: 'Public authentication endpoint. Takes email and password hash, returns Access Token (15min exp) + Refresh Token (7 days).'
  },
  {
    permissionId: 'perm-auth-refresh',
    endpointPath: '/api/v1/auth/refresh',
    httpMethod: 'POST',
    summary: 'Rotate Expired Access Token using Refresh Token',
    allowedRoles: ['ROLE_ANONYMOUS', 'ROLE_RESEARCHER', 'ROLE_ADMIN'],
    description: 'Rotates access token and verifies token revocation list stored in Redis cache.'
  },
  {
    permissionId: 'perm-infer-async',
    endpointPath: '/api/v1/predictions/async',
    httpMethod: 'POST',
    summary: 'Submit Async Deepfake Forensic Pipeline Job',
    allowedRoles: ['ROLE_RESEARCHER', 'ROLE_ADMIN'],
    description: 'Requires valid JWT bearer token with ROLE_RESEARCHER or ROLE_ADMIN. Enqueues job to Kafka topic for Triton GPU processing.'
  },
  {
    permissionId: 'perm-infer-gradcam',
    endpointPath: '/api/v1/predictions/{id}/gradcam',
    httpMethod: 'GET',
    summary: 'Fetch Explainable Grad-CAM Heatmap Tensors',
    allowedRoles: ['ROLE_RESEARCHER', 'ROLE_ADMIN'],
    description: 'Retrieves spatial heatmaps showing facial forgery seams for deepfake verification.'
  },
  {
    permissionId: 'perm-papers-list',
    endpointPath: '/api/v1/research/papers',
    httpMethod: 'GET',
    summary: 'Search & Fetch Literature Repository Papers',
    allowedRoles: ['ROLE_ANONYMOUS', 'ROLE_RESEARCHER', 'ROLE_ADMIN'],
    description: 'Public read-only research paper repository listing, abstracts, and BibTeX citations.'
  },
  {
    permissionId: 'perm-admin-audit',
    endpointPath: '/api/v1/admin/audit-logs',
    httpMethod: 'GET',
    summary: 'Query System Security & Compliance Audit Trail',
    allowedRoles: ['ROLE_ADMIN'],
    description: 'Protected endpoint accessible ONLY by ROLE_ADMIN. Returns security events, token revocations, and rate limit breaches.'
  },
  {
    permissionId: 'perm-admin-model-deploy',
    endpointPath: '/api/v1/admin/models/deploy',
    httpMethod: 'POST',
    summary: 'Deploy New Neural Model Weights to Triton GPU',
    allowedRoles: ['ROLE_ADMIN'],
    description: 'Protected endpoint accessible ONLY by ROLE_ADMIN. Triggers zero-downtime model weight swap on Triton cluster.'
  }
];

export function generateSampleJwt(user: AuthUser): DecodedJwtToken {
  const nowInSec = Math.floor(Date.now() / 1000);
  const expInSec = nowInSec + 900; // 15 mins

  return {
    header: {
      alg: 'HS256',
      typ: 'JWT'
    },
    payload: {
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organization: user.organization,
      iat: nowInSec,
      exp: expInSec,
      iss: 'deepfake-detection-auth-server',
      aud: 'deepfake-detection-api'
    },
    signature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855_mock_sig',
    isExpired: false,
    rawToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: expInSec
    }))}.mock_signature_hash`
  };
}

export const SPRING_SECURITY_CODE_FILES = [
  {
    id: 'sec-cfg',
    fileName: 'SecurityConfig.java',
    packageName: 'org.deepfake.detection.security',
    layer: 'DTO & Security',
    code: `package org.deepfake.detection.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint unauthHandler;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint unauthHandler) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.unauthHandler = unauthHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthHandler))
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public Endpoints
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/research/papers/**").permitAll()
                .requestMatchers("/api/v1/contact").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Role-restricted Endpoints
                .requestMatchers("/api/v1/predictions/**").hasAnyRole("RESEARCHER", "ADMIN")
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}`
  },
  {
    id: 'sec-jwt-filter',
    fileName: 'JwtAuthenticationFilter.java',
    packageName: 'org.deepfake.detection.security',
    layer: 'DTO & Security',
    code: `package org.deepfake.detection.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService userDetailsService) {
        this.tokenProvider = tokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String userEmail = tokenProvider.getUserEmailFromToken(jwt);

                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}`
  },
  {
    id: 'sec-provider',
    fileName: 'JwtTokenProvider.java',
    packageName: 'org.deepfake.detection.security',
    layer: 'DTO & Security',
    code: `package org.deepfake.detection.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expiration-ms}")
    private int jwtExpirationInMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String email, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}`
  }
];
