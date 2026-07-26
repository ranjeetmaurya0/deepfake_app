import { DbTable, DbRelationship } from '../types';

export const DATABASE_TABLES: DbTable[] = [
  {
    id: 'table-users',
    tableName: 'users',
    displayName: 'Users Table',
    moduleGroup: 'Core Auth',
    description: 'Stores platform users, administrative accounts, researchers, and public access credentials.',
    estimatedRows: '10,000+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Unique user identifier' },
      { name: 'email', type: 'VARCHAR(255)', isNullable: false, isUnique: true, description: 'User login email address' },
      { name: 'password_hash', type: 'VARCHAR(255)', isNullable: false, description: 'BCrypt/Argon2 encrypted password' },
      { name: 'full_name', type: 'VARCHAR(150)', isNullable: false, description: 'User full display name' },
      { name: 'organization', type: 'VARCHAR(150)', isNullable: true, description: 'University, lab, or enterprise affiliation' },
      { name: 'is_active', type: 'BOOLEAN', isNullable: false, defaultValue: 'true', description: 'Account status flag' },
      { name: 'email_verified', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Email verification confirmation status' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Record creation timestamp' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Record last update timestamp' }
    ],
    indexes: [
      { name: 'idx_users_email', columns: ['email'], type: 'UNIQUE', purpose: 'Fast login authentication lookups' },
      { name: 'idx_users_active_created', columns: ['is_active', 'created_at'], type: 'BTREE', purpose: 'Admin user pagination filtering' }
    ]
  },
  {
    id: 'table-roles',
    tableName: 'roles',
    displayName: 'Roles Table',
    moduleGroup: 'Core Auth',
    description: 'Defines Role-Based Access Control (RBAC) permissions (ROLE_ADMIN, ROLE_RESEARCHER, ROLE_USER).',
    estimatedRows: '5',
    columns: [
      { name: 'id', type: 'BIGSERIAL', isPrimary: true, isNullable: false, description: 'Primary auto-increment key' },
      { name: 'name', type: 'VARCHAR(50)', isNullable: false, isUnique: true, description: 'Role code name (e.g. ROLE_ADMIN, ROLE_RESEARCHER)' },
      { name: 'description', type: 'TEXT', isNullable: true, description: 'Human readable role permission explanation' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' }
    ],
    indexes: [
      { name: 'idx_roles_name', columns: ['name'], type: 'UNIQUE', purpose: 'Role permission string lookup' }
    ]
  },
  {
    id: 'table-user-roles',
    tableName: 'user_roles',
    displayName: 'User Roles Mapping (N:M)',
    moduleGroup: 'Core Auth',
    description: 'Junction table linking users to one or more roles.',
    estimatedRows: '15,000+',
    columns: [
      { name: 'user_id', type: 'UUID', isPrimary: true, isForeign: true, references: 'users(id)', isNullable: false, description: 'Foreign key to users' },
      { name: 'role_id', type: 'BIGINT', isPrimary: true, isForeign: true, references: 'roles(id)', isNullable: false, description: 'Foreign key to roles' },
      { name: 'assigned_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Role assignment timestamp' }
    ],
    indexes: [
      { name: 'idx_user_roles_composite', columns: ['user_id', 'role_id'], type: 'UNIQUE', purpose: 'Prevent duplicate role assignment' }
    ]
  },
  {
    id: 'table-projects',
    tableName: 'projects',
    displayName: 'Projects & Showcase',
    moduleGroup: 'Research & Papers',
    description: 'Stores research initiatives, deepfake benchmark releases, and portfolio projects.',
    estimatedRows: '200+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Project unique ID' },
      { name: 'title', type: 'VARCHAR(255)', isNullable: false, description: 'Project headline title' },
      { name: 'slug', type: 'VARCHAR(255)', isNullable: false, isUnique: true, description: 'URL-friendly permalink slug' },
      { name: 'abstract_text', type: 'TEXT', isNullable: false, description: 'Executive research abstract' },
      { name: 'github_url', type: 'VARCHAR(500)', isNullable: true, description: 'Open source repository link' },
      { name: 'demo_url', type: 'VARCHAR(500)', isNullable: true, description: 'Live preview endpoint URL' },
      { name: 'is_featured', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Featured landing page highlight' },
      { name: 'created_by', type: 'UUID', isForeign: true, references: 'users(id)', isNullable: false, description: 'Author/Admin ID' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' }
    ],
    indexes: [
      { name: 'idx_projects_slug', columns: ['slug'], type: 'UNIQUE', purpose: 'SEO permalink resolution' },
      { name: 'idx_projects_featured', columns: ['is_featured', 'created_at'], type: 'BTREE', purpose: 'Home page gallery ranking' }
    ]
  },
  {
    id: 'table-research-papers',
    tableName: 'research_papers',
    displayName: 'Research Papers Repository',
    moduleGroup: 'Research & Papers',
    description: 'Peer-reviewed publications, arXiv preprints, literature reviews, and BibTeX citations.',
    estimatedRows: '500+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Paper identifier' },
      { name: 'project_id', type: 'UUID', isForeign: true, references: 'projects(id)', isNullable: true, description: 'Optional project association' },
      { name: 'title', type: 'VARCHAR(300)', isNullable: false, description: 'Academic paper title' },
      { name: 'authors', type: 'TEXT[]', isNullable: false, description: 'Array of author names' },
      { name: 'journal_venue', type: 'VARCHAR(255)', isNullable: false, description: 'Journal name or conference (e.g. IEEE ICCV, IJRPR 2025)' },
      { name: 'publication_year', type: 'INT', isNullable: false, description: 'Year of publication' },
      { name: 'doi_isbn', type: 'VARCHAR(100)', isNullable: true, description: 'Digital Object Identifier' },
      { name: 'pdf_cloud_url', type: 'VARCHAR(500)', isNullable: false, description: 'S3/Cloudinary PDF download link' },
      { name: 'bibtex_citation', type: 'TEXT', isNullable: true, description: 'BibTeX format citation text' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Ingestion timestamp' }
    ],
    indexes: [
      { name: 'idx_papers_venue_year', columns: ['journal_venue', 'publication_year'], type: 'BTREE', purpose: 'Library filtering by venue' },
      { name: 'idx_papers_title_gin', columns: ['title'], type: 'GIN', purpose: 'Full-text search over paper titles' }
    ]
  },
  {
    id: 'table-presentations',
    tableName: 'presentations',
    displayName: 'Slide Decks & Presentations',
    moduleGroup: 'Research & Papers',
    description: 'Conference slides, keynote presentations, and PDF slide decks.',
    estimatedRows: '150+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Presentation ID' },
      { name: 'title', type: 'VARCHAR(255)', isNullable: false, description: 'Slide deck title' },
      { name: 'slide_count', type: 'INT', isNullable: false, defaultValue: '0', description: 'Number of slides' },
      { name: 'file_url', type: 'VARCHAR(500)', isNullable: false, description: 'Presentation PDF URL' },
      { name: 'speaker_notes', type: 'TEXT', isNullable: true, description: 'Accompanying speaker notes' },
      { name: 'uploaded_by', type: 'UUID', isForeign: true, references: 'users(id)', isNullable: false, description: 'Uploader user ID' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Upload timestamp' }
    ],
    indexes: [
      { name: 'idx_presentations_title', columns: ['title'], type: 'BTREE', purpose: 'Search presentation slides' }
    ]
  },
  {
    id: 'table-videos',
    tableName: 'videos',
    displayName: 'Video Media Gallery',
    moduleGroup: 'Media Management',
    description: 'Stores raw, cropped, and benchmark video clips for deepfake detection testing.',
    estimatedRows: '50,000+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Video media asset ID' },
      { name: 'original_filename', type: 'VARCHAR(255)', isNullable: false, description: 'Uploaded file original name' },
      { name: 's3_object_key', type: 'VARCHAR(500)', isNullable: false, isUnique: true, description: 'Cloud Object Storage key' },
      { name: 'duration_seconds', type: 'NUMERIC(8,2)', isNullable: false, description: 'Duration in seconds' },
      { name: 'frame_rate', type: 'NUMERIC(5,2)', isNullable: false, description: 'Video frame rate (FPS)' },
      { name: 'resolution', type: 'VARCHAR(20)', isNullable: false, description: 'Resolution (e.g. 1920x1080, 128x128)' },
      { name: 'compression_level', type: 'VARCHAR(20)', isNullable: false, defaultValue: "'HQ'", description: 'Raw, HQ (CRF 23), or LQ (CRF 40)' },
      { name: 'file_hash_sha256', type: 'VARCHAR(64)', isNullable: false, isUnique: true, description: 'Integrity hash to prevent duplicates' },
      { name: 'uploaded_by', type: 'UUID', isForeign: true, references: 'users(id)', isNullable: true, description: 'Uploader ID' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Upload timestamp' }
    ],
    indexes: [
      { name: 'idx_videos_sha256', columns: ['file_hash_sha256'], type: 'UNIQUE', purpose: 'Deduplication lookup' },
      { name: 'idx_videos_compression', columns: ['compression_level'], type: 'BTREE', purpose: 'Benchmark query grouping' }
    ]
  },
  {
    id: 'table-images',
    tableName: 'images',
    displayName: 'Image Media Gallery',
    moduleGroup: 'Media Management',
    description: 'Facial crops, architecture diagrams, and static frame assets.',
    estimatedRows: '100,000+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Image asset ID' },
      { name: 'title', type: 'VARCHAR(255)', isNullable: false, description: 'Image title' },
      { name: 'image_url', type: 'VARCHAR(500)', isNullable: false, description: 'CDN URL' },
      { name: 'category', type: 'VARCHAR(50)', isNullable: false, description: 'Face Crop, Architecture Diagram, Benchmark Chart' },
      { name: 'width_px', type: 'INT', isNullable: false, description: 'Width in pixels' },
      { name: 'height_px', type: 'INT', isNullable: false, description: 'Height in pixels' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' }
    ],
    indexes: [
      { name: 'idx_images_category', columns: ['category'], type: 'BTREE', purpose: 'Gallery filtering' }
    ]
  },
  {
    id: 'table-predictions',
    tableName: 'predictions',
    displayName: 'AI Model Predictions & Results',
    moduleGroup: 'AI Inference & Forensics',
    description: 'Stores inference predictions generated by the Triple-Hybrid ResNet+CapsNet+LSTM model.',
    estimatedRows: '250,000+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Prediction job unique ID' },
      { name: 'video_id', type: 'UUID', isForeign: true, references: 'videos(id)', isNullable: true, description: 'Input video asset ID' },
      { name: 'image_id', type: 'UUID', isForeign: true, references: 'images(id)', isNullable: true, description: 'Input image asset ID' },
      { name: 'model_version', type: 'VARCHAR(50)', isNullable: false, defaultValue: "'1.0.0-TRIPLE-HYBRID'", description: 'Version tag of deployed model' },
      { name: 'is_fake', type: 'BOOLEAN', isNullable: false, description: 'Final classification (true=Fake, false=Real)' },
      { name: 'confidence_score', type: 'NUMERIC(5,4)', isNullable: false, description: 'Calibrated confidence probability [0.0000 - 1.0000]' },
      { name: 'spatial_score', type: 'NUMERIC(5,4)', isNullable: false, description: 'ResNet spatial branch score' },
      { name: 'capsule_score', type: 'NUMERIC(5,4)', isNullable: false, description: 'Capsule structural branch score' },
      { name: 'temporal_score', type: 'NUMERIC(5,4)', isNullable: false, description: 'LSTM temporal branch score' },
      { name: 'gradcam_heatmap_url', type: 'VARCHAR(500)', isNullable: true, description: 'S3 URL for Grad-CAM overlay heatmap' },
      { name: 'processing_time_ms', type: 'INT', isNullable: false, description: 'Total inference latency in milliseconds' },
      { name: 'abstain_triggered', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Uncertainty threshold trigger flag' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Inference completion timestamp' }
    ],
    indexes: [
      { name: 'idx_predictions_video', columns: ['video_id'], type: 'BTREE', purpose: 'Lookup prediction history for video' },
      { name: 'idx_predictions_fake_confidence', columns: ['is_fake', 'confidence_score'], type: 'BTREE', purpose: 'Analytics and forensic reporting queries' }
    ]
  },
  {
    id: 'table-prediction-frames',
    tableName: 'prediction_frames',
    displayName: 'Per-Frame Granular Analysis',
    moduleGroup: 'AI Inference & Forensics',
    description: 'Detailed per-frame scores and facial bounding box coordinates for frame sequence timelines.',
    estimatedRows: '1,250,000+',
    columns: [
      { name: 'id', type: 'BIGSERIAL', isPrimary: true, isNullable: false, description: 'Frame record primary key' },
      { name: 'prediction_id', type: 'UUID', isForeign: true, references: 'predictions(id)', isNullable: false, description: 'Parent prediction job' },
      { name: 'frame_index', type: 'INT', isNullable: false, description: 'Sequence index (e.g. 0 to 4)' },
      { name: 'timestamp_offset_ms', type: 'INT', isNullable: false, description: 'Time offset in milliseconds' },
      { name: 'frame_score', type: 'NUMERIC(5,4)', isNullable: false, description: 'Per-frame forgery probability' },
      { name: 'face_bbox_json', type: 'JSONB', isNullable: false, description: 'Bounding box {x, y, w, h} and landmarks' },
      { name: 'gradcam_frame_url', type: 'VARCHAR(500)', isNullable: true, description: 'Per-frame heatmap image' }
    ],
    indexes: [
      { name: 'idx_prediction_frames_parent', columns: ['prediction_id', 'frame_index'], type: 'UNIQUE', purpose: 'Fast timeline frame retrieval' },
      { name: 'idx_prediction_frames_bbox', columns: ['face_bbox_json'], type: 'GIN', purpose: 'JSONB indexing on facial coordinates' }
    ]
  },
  {
    id: 'table-blog-posts',
    tableName: 'blog_posts',
    displayName: 'Technical Blog & News',
    moduleGroup: 'Content & Communications',
    description: 'Articles explaining research methodology, threat landscapes, and release notes.',
    estimatedRows: '100+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Post ID' },
      { name: 'title', type: 'VARCHAR(255)', isNullable: false, description: 'Article title' },
      { name: 'slug', type: 'VARCHAR(255)', isNullable: false, isUnique: true, description: 'URL slug' },
      { name: 'content_markdown', type: 'TEXT', isNullable: false, description: 'Full Markdown content' },
      { name: 'cover_image_url', type: 'VARCHAR(500)', isNullable: true, description: 'Banner image link' },
      { name: 'author_id', type: 'UUID', isForeign: true, references: 'users(id)', isNullable: false, description: 'Author user ID' },
      { name: 'is_published', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Publishing status' },
      { name: 'published_at', type: 'TIMESTAMPTZ', isNullable: true, description: 'Publication date' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Creation date' }
    ],
    indexes: [
      { name: 'idx_blog_slug', columns: ['slug'], type: 'UNIQUE', purpose: 'Fast blog article routing' }
    ]
  },
  {
    id: 'table-contact-messages',
    tableName: 'contact_messages',
    displayName: 'Contact & Inquiry Submissions',
    moduleGroup: 'Content & Communications',
    description: 'Holds visitor messages, research inquiries, and enterprise demo requests.',
    estimatedRows: '1,000+',
    columns: [
      { name: 'id', type: 'UUID', isPrimary: true, isNullable: false, defaultValue: 'gen_random_uuid()', description: 'Message ID' },
      { name: 'sender_name', type: 'VARCHAR(150)', isNullable: false, description: 'Sender full name' },
      { name: 'sender_email', type: 'VARCHAR(255)', isNullable: false, description: 'Contact email' },
      { name: 'subject', type: 'VARCHAR(255)', isNullable: false, description: 'Message subject' },
      { name: 'message_body', type: 'TEXT', isNullable: false, description: 'Content body' },
      { name: 'is_read', type: 'BOOLEAN', isNullable: false, defaultValue: 'false', description: 'Read status flag' },
      { name: 'created_at', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Submission timestamp' }
    ],
    indexes: [
      { name: 'idx_contact_unread', columns: ['is_read', 'created_at'], type: 'BTREE', purpose: 'Admin unread inbox filtering' }
    ]
  },
  {
    id: 'table-audit-logs',
    tableName: 'audit_logs',
    displayName: 'System Audit Logs',
    moduleGroup: 'Core Auth',
    description: 'Immutable forensic audit trail recording system access, model updates, and data deletion.',
    estimatedRows: '500,000+',
    columns: [
      { name: 'id', type: 'BIGSERIAL', isPrimary: true, isNullable: false, description: 'Log sequence ID' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users(id)', isNullable: true, description: 'Actor user ID' },
      { name: 'action', type: 'VARCHAR(100)', isNullable: false, description: 'Action string (e.g. MODEL_DEPLOY, PREDICTION_RUN)' },
      { name: 'entity_type', type: 'VARCHAR(100)', isNullable: false, description: 'Affected entity table name' },
      { name: 'entity_id', type: 'VARCHAR(255)', isNullable: true, description: 'Affected record ID' },
      { name: 'ip_address', type: 'VARCHAR(45)', isNullable: true, description: 'Client IP address' },
      { name: 'payload_json', type: 'JSONB', isNullable: true, description: 'Audit context metadata' },
      { name: 'timestamp', type: 'TIMESTAMPTZ', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP', description: 'Immutable action timestamp' }
    ],
    indexes: [
      { name: 'idx_audit_timestamp', columns: ['timestamp'], type: 'BTREE', purpose: 'Time-series audit search' },
      { name: 'idx_audit_action', columns: ['action'], type: 'BTREE', purpose: 'Action category search' }
    ]
  }
];

export const DATABASE_RELATIONSHIPS: DbRelationship[] = [
  { id: 'rel-1', fromTable: 'users', fromColumn: 'id', toTable: 'user_roles', toColumn: 'user_id', type: '1:N', onDelete: 'CASCADE' },
  { id: 'rel-2', fromTable: 'roles', fromColumn: 'id', toTable: 'user_roles', toColumn: 'role_id', type: '1:N', onDelete: 'CASCADE' },
  { id: 'rel-3', fromTable: 'users', fromColumn: 'id', toTable: 'projects', toColumn: 'created_by', type: '1:N', onDelete: 'RESTRICT' },
  { id: 'rel-4', fromTable: 'projects', fromColumn: 'id', toTable: 'research_papers', toColumn: 'project_id', type: '1:N', onDelete: 'SET NULL' },
  { id: 'rel-5', fromTable: 'users', fromColumn: 'id', toTable: 'videos', toColumn: 'uploaded_by', type: '1:N', onDelete: 'SET NULL' },
  { id: 'rel-6', fromTable: 'videos', fromColumn: 'id', toTable: 'predictions', toColumn: 'video_id', type: '1:N', onDelete: 'CASCADE' },
  { id: 'rel-7', fromTable: 'images', fromColumn: 'id', toTable: 'predictions', toColumn: 'image_id', type: '1:N', onDelete: 'CASCADE' },
  { id: 'rel-8', fromTable: 'predictions', fromColumn: 'id', toTable: 'prediction_frames', toColumn: 'prediction_id', type: '1:N', onDelete: 'CASCADE' },
  { id: 'rel-9', fromTable: 'users', fromColumn: 'id', toTable: 'blog_posts', toColumn: 'author_id', type: '1:N', onDelete: 'RESTRICT' },
  { id: 'rel-10', fromTable: 'users', fromColumn: 'id', toTable: 'presentations', toColumn: 'uploaded_by', type: '1:N', onDelete: 'RESTRICT' }
];

export function generatePostgreSQLDDL(): string {
  let ddl = `-- PostgreSQL Production Database DDL Schema
-- Project: Deepfake Detection System
-- Target Engine: PostgreSQL 15+ / Cloud SQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

`;

  DATABASE_TABLES.forEach((table) => {
    ddl += `-- ==========================================\n`;
    ddl += `-- Table: ${table.tableName} (${table.displayName})\n`;
    ddl += `-- ==========================================\n`;
    ddl += `CREATE TABLE ${table.tableName} (\n`;

    const columnDefs = table.columns.map((col) => {
      let line = `  ${col.name.padEnd(24)} ${col.type.padEnd(16)}`;
      if (col.isPrimary) line += ' PRIMARY KEY';
      if (!col.isNullable && !col.isPrimary) line += ' NOT NULL';
      if (col.isUnique) line += ' UNIQUE';
      if (col.defaultValue) line += ` DEFAULT ${col.defaultValue}`;
      if (col.references) line += ` REFERENCES ${col.references}`;
      return line;
    });

    ddl += columnDefs.join(',\n');
    ddl += `\n);\n\n`;

    // Add Indexes
    table.indexes.forEach((idx) => {
      if (idx.type === 'UNIQUE') {
        ddl += `CREATE UNIQUE INDEX ${idx.name} ON ${table.tableName} (${idx.columns.join(', ')});\n`;
      } else if (idx.type === 'GIN') {
        ddl += `CREATE INDEX ${idx.name} ON ${table.tableName} USING GIN (${idx.columns.join(', ')});\n`;
      } else {
        ddl += `CREATE INDEX ${idx.name} ON ${table.tableName} (${idx.columns.join(', ')});\n`;
      }
    });

    ddl += `\n`;
  });

  return ddl;
}
