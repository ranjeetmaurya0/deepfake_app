import { ResearchPaper, ForensicAnalysisReport } from '../types';

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-maurya-2025',
    title: 'DEEPFAKE DETECTION USING DEEP LEARNING (ResNet-50 + Capsule Net + LSTM)',
    authors: ['Ranjeet Maurya', 'Dr. S. K. Gupta'],
    journalVenue: 'International Journal of Research Publication and Reviews (IJRPR)',
    publicationYear: 2025,
    doi: '10.55248/gengpi.5.1224.1209',
    abstractText: 'With the rapid evolution of deep generative models such as Autoencoders, GANs, and Diffusion models, hyper-realistic facial deepfakes present severe threats to digital media integrity. Standard single-frame classifiers often fail to detect spatial boundary artifacts and inter-frame temporal inconsistencies. This paper proposes a novel Triple-Hybrid Deep Learning architecture combining ResNet-50 for high-pass spatial feature extraction, a Structural Capsule Network with Dynamic Agreement Routing to preserve 3D facial geometry, and a Bidirectional LSTM to capture inter-frame motion desynchronization. Evaluated on FaceForensics++ and DFDC, our hybrid model achieves 99.26% accuracy on raw video streams and 95.73% on compressed streams with 132ms end-to-end inference latency.',
    keyContributions: [
      'Triple-Hybrid architectural fusion: ResNet-50 (Spatial) + Capsule Routing (3D Geometry) + Bi-LSTM (Temporal).',
      'Integration of Grad-CAM explainability pinpointing spatial facial forgery seams.',
      'Robust performance against high CRF video compression and cross-dataset evaluation.',
      'Deployment-ready Triton GPU batch processing design with non-blocking Kafka event streaming.'
    ],
    bibtex: `@article{maurya2025deepfake,
  title={DEEPFAKE DETECTION USING DEEP LEARNING},
  author={Maurya, Ranjeet and Gupta, S. K.},
  journal={International Journal of Research Publication and Reviews (IJRPR)},
  volume={6},
  number={1},
  pages={1042--1051},
  year={2025},
  publisher={IJRPR}
}`,
    pdfUrl: 'https://cdn.deepfake.org/papers/Maurya_Deepfake_2025.pdf',
    citationCount: 14,
    isPrimaryPaper: true
  },
  {
    id: 'paper-roessler-2019',
    title: 'FaceForensics++: Learning to Detect Manipulated Facial Images',
    authors: ['Andreas Rössler', 'Davide Cozzolino', 'Luisa Verdoliva', 'Christian Riess', 'Justus Thies', 'Matthias Nießner'],
    journalVenue: 'IEEE/CVF International Conference on Computer Vision (ICCV)',
    publicationYear: 2019,
    doi: '10.1109/ICCV.2019.00001',
    abstractText: 'FaceForensics++ is a benchmark dataset of over 1.8 million images from 1,000 pristine and 4,000 automated facial manipulations (Deepfakes, Face2Face, FaceSwap, NeuralTextures). The authors evaluate state-of-the-art forensic forgery detectors across raw and heavily compressed H.264 video streams.',
    keyContributions: [
      'Standardized 4,000 manipulated video corpus for benchmark comparability.',
      'Comparative evaluation of domain transfer and compression degradation.',
      'Standard benchmark baseline for face forgery research.'
    ],
    bibtex: `@inproceedings{roessler2019faceforensicsplus,
  title={FaceForensics++: Learning to Detect Manipulated Facial Images},
  author={R{\"o}ssler, Andreas and Cozzolino, Davide and Verdoliva, Luisa and Riess, Christian and Thies, Justus and Nie{\ss}ner, Matthias},
  booktitle={ICCV},
  year={2019}
}`,
    pdfUrl: 'https://arxiv.org/pdf/1901.08971.pdf',
    citationCount: 1820
  },
  {
    id: 'paper-nguyen-2019',
    title: 'Capsule-Forensics: Using Capsule Networks to Detect Forged Images and Videos',
    authors: ['Huy H. Nguyen', 'Junichi Yamagishi', 'Isao Echizen'],
    journalVenue: 'IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP)',
    publicationYear: 2019,
    doi: '10.1109/ICASSP.2019.8682602',
    abstractText: 'Capsule networks store geometric features in vector activations instead of scalar scalar maps. This work demonstrates that capsule dynamic routing detects subtle part-whole spatial disconnections in deepfakes.',
    keyContributions: [
      'First application of Capsule Networks to deepfake video detection.',
      'Dynamic agreement routing preserved spatial pose vectors.',
      'High detection accuracy on low-resolution face swaps.'
    ],
    bibtex: `@inproceedings{nguyen2019capsule,
  title={Capsule-forensics: Using capsule networks to detect forged images and videos},
  author={Nguyen, Huy H and Yamagishi, Junichi and Echizen, Isao},
  booktitle={ICASSP},
  pages={2307--2311},
  year={2019}
}`,
    pdfUrl: 'https://arxiv.org/pdf/1910.12467.pdf',
    citationCount: 412
  }
];

export const MOCK_FORENSIC_REPORTS: ForensicAnalysisReport[] = [
  {
    analysisId: 'rep-dfdc-99812',
    mediaFilename: 'deepfake_face_swap_test_01.mp4',
    fileSizeBytes: 14200000,
    resolution: '1920x1080',
    fps: 30,
    durationSeconds: 5.0,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2026-07-25 10:45:12 UTC',
    isFake: true,
    calibratedConfidence: 0.9926,
    verdictLabel: 'DEEPFAKE FORGERY DETECTED',
    spatialResNetScore: 0.9840,
    structuralCapsuleScore: 0.9912,
    temporalLstmScore: 0.9985,
    processingTimeMs: 132,
    frames: [
      {
        frameIndex: 0,
        timeOffsetMs: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        spatialScore: 0.9780,
        capsuleScore: 0.9850,
        temporalScore: 0.9910,
        gradCamHeatmapUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        boundingBox: [110, 45, 230, 220],
        detectedArtifacts: ['Cheek boundary blending seam', 'Poisson smoothing noise on chin']
      },
      {
        frameIndex: 1,
        timeOffsetMs: 1000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        spatialScore: 0.9820,
        capsuleScore: 0.9910,
        temporalScore: 0.9950,
        gradCamHeatmapUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        boundingBox: [112, 46, 232, 221],
        detectedArtifacts: ['Irregular pupil reflection mismatch', 'Mouth corner warping artifact']
      },
      {
        frameIndex: 2,
        timeOffsetMs: 2000,
        thumbnailUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        spatialScore: 0.9890,
        capsuleScore: 0.9940,
        temporalScore: 0.9990,
        gradCamHeatmapUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        boundingBox: [115, 48, 235, 224],
        detectedArtifacts: ['Unnatural eye blinking skip (180ms delay)', 'Spatial edge discontinuity']
      }
    ]
  },
  {
    analysisId: 'rep-pristine-0012',
    mediaFilename: 'authentic_news_interview.mp4',
    fileSizeBytes: 28400000,
    resolution: '3840x2160',
    fps: 60,
    durationSeconds: 10.0,
    sha256Hash: 'a12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    timestamp: '2026-07-25 09:12:00 UTC',
    isFake: false,
    calibratedConfidence: 0.0185,
    verdictLabel: 'AUTHENTIC MEDIA VERIFIED',
    spatialResNetScore: 0.0210,
    structuralCapsuleScore: 0.0150,
    temporalLstmScore: 0.0120,
    processingTimeMs: 145,
    frames: [
      {
        frameIndex: 0,
        timeOffsetMs: 0,
        thumbnailUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
        spatialScore: 0.020,
        capsuleScore: 0.015,
        temporalScore: 0.010,
        gradCamHeatmapUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
        boundingBox: [100, 40, 220, 210],
        detectedArtifacts: []
      }
    ]
  }
];
