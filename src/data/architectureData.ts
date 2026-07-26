import { ArchitectureNode, ResearchBenchmark, DataPipelineStage, InspectionSample } from '../types';

export const SYSTEM_NODES: ArchitectureNode[] = [
  {
    id: 'node-ingest',
    stageNumber: 1,
    title: 'Ingestion & Decoding',
    subtitle: 'Decord / OpenCV + Apache Kafka',
    category: 'Ingestion',
    inputTensor: 'Raw Video MP4/MOV (Variable FPS/Res)',
    outputTensor: 'Tensor (B, 5, 3, 224, 224)',
    parameters: 'N/A (Async I/O)',
    latencyAvg: '45 ms',
    keyTech: ['Decord GPU Video Reader', 'OpenCV', 'Kafka Queue Buffer', 'H.264 De-quantizer'],
    description: 'Streams video clips asynchronously via REST/Kafka queues. Samples uniform 5-frame sequence windows at 1 FPS, converting frames into normalized 224x224 RGB tensors.',
    failureModesMitigated: ['I/O Bottlenecks', 'Dropped Frame Artifacts', 'Variable Frame Rate Desync'],
    codeSnippet: `def sample_video_frames(video_path, sequence_length=5, frame_rate=1):\n    vr = decord.VideoReader(video_path, ctx=decord.cpu(0))\n    fps = vr.get_avg_fps()\n    frame_id_interval = max(1, int(fps / frame_rate))\n    indices = [i * frame_id_interval for i in range(sequence_length)]\n    frames = vr.get_batch(indices).asnumpy()\n    return torch.tensor(frames).permute(0, 3, 1, 2) / 255.0`
  },
  {
    id: 'node-face',
    stageNumber: 2,
    title: 'Face Detection & Crop',
    subtitle: 'RetinaFace + 68 Landmark BBox',
    category: 'Preprocessing',
    inputTensor: 'Frame Sequence (B, 5, 3, 224, 224)',
    outputTensor: 'Aligned Cropped Faces (B, 5, 3, 128, 128)',
    parameters: '29.8M (RetinaFace ResNet34)',
    latencyAvg: '62 ms',
    keyTech: ['RetinaFace', 'DLIB Landmark Predictor', 'Affine Bounding-Box Alignment', '1.3x Conservative Margin'],
    description: 'Detects facial bounding boxes and 68 facial landmarks. Normalizes pitch, roll, and yaw rotation with a 1.3x conservative scaling margin around the face center, isolating forged regions and eliminating background shortcut bias.',
    mathematicalFormula: 'R_{aligned} = AffineTransform(I_{crop}, \\theta_{landmarks}, s=1.3)',
    failureModesMitigated: ['Background Noise Leakage', 'Extreme Head Pose Distortions', 'Occlusion Boundary Shifts'],
    codeSnippet: `def extract_aligned_faces(frames, detector, crop_factor=1.3):\n    aligned_faces = []\n    for frame in frames:\n        bbox, landmarks = detector.detect(frame)\n        center = calc_center(bbox)\n        crop_size = max(bbox.w, bbox.h) * crop_factor\n        face_crop = crop_and_align(frame, center, crop_size, landmarks)\n        aligned_faces.append(cv2.resize(face_crop, (128, 128)))\n    return torch.stack(aligned_faces)`
  },
  {
    id: 'node-resnet',
    stageNumber: 3,
    title: 'Spatial Feature Encoder',
    subtitle: 'ResNet-50 / ConvNeXt Backbone',
    category: 'Spatial',
    inputTensor: 'Cropped Faces (B, 5, 3, 128, 128)',
    outputTensor: 'Spatial Feature Maps (B, 5, 1024, 14, 14)',
    parameters: '23.5M (Pretrained ImageNet-1K)',
    latencyAvg: '88 ms',
    keyTech: ['Residual Skip Connections', 'High-Pass Spatial Filtering', 'Layer4 Feature Tap', 'YCbCr Color Conversion'],
    description: 'Extracts deep 1024-channel spatial feature maps per frame. Identifies pixelation, warping seams, edge blending artifacts, and frequency-domain GAN checkerboard anomalies.',
    mathematicalFormula: 'y = F(x, \\{W_i\\}) + x',
    failureModesMitigated: ['Vanishing Gradient in Deep Networks', 'Unnatural Skin Texture Smoothness', 'Blending Boundary Seams'],
    codeSnippet: `class ResNetSpatialEncoder(nn.Module):\n    def __init__(self):\n        super().__init__()\n        base = models.resnet50(pretrained=True)\n        self.backbone = nn.Sequential(*list(base.children())[:-2]) # Up to layer4\n    def forward(self, x):\n        # x shape: (B, T, C, H, W)\n        b, t, c, h, w = x.shape\n        x_reshaped = x.view(b * t, c, h, w)\n        features = self.backbone(x_reshaped)\n        return features.view(b, t, 1024, 14, 14)`
  },
  {
    id: 'node-capsule',
    stageNumber: 4,
    title: 'Structural Capsule Network',
    subtitle: 'Dynamic Routing (1568 Primary Caps)',
    category: 'Structural',
    inputTensor: 'Feature Maps (B, 5, 1024, 14, 14)',
    outputTensor: 'Vector Capsules (B, 5, 16, 16)',
    parameters: '4.2M (Dynamic Routing Layers)',
    latencyAvg: '110 ms',
    keyTech: ['Primary Vector Capsules', 'Agreement Dynamic Routing (3 Iterations)', 'Squash Activation Function', '3D Spatial Geometry preserving'],
    description: 'Encodes spatial relationships and pose vectors of facial components (eyes, nose, mouth) into 16D vector capsules. Dynamic agreement routing checks part-whole spatial hierarchy consistency without pooling loss.',
    mathematicalFormula: 'v_j = \\frac{||s_j||^2}{1 + ||s_j||^2} \\frac{s_j}{||s_j||}',
    failureModesMitigated: ['Pooling Information Loss', 'Part-Whole Geometric Disconnections', 'Affine Transformation Evading'],
    codeSnippet: `class CapsuleRoutingBlock(nn.Module):\n    def __init__(self, in_channels=1024, num_caps=16, vec_dim=16):\n        super().__init__()\n        self.primary_caps = nn.Conv2d(in_channels, num_caps * vec_dim, kernel_size=1)\n    def squash(self, s):\n        norm_sq = (s**2).sum(dim=-1, keepdim=True)\n        return (norm_sq / (1 + norm_sq)) * (s / torch.sqrt(norm_sq + 1e-8))\n    def forward(self, x):\n        u = self.primary_caps(x)\n        return self.squash(u)`
  },
  {
    id: 'node-lstm',
    stageNumber: 5,
    title: 'Temporal LSTM Aggregator',
    subtitle: 'Bidirectional LSTM Sequence Learner',
    category: 'Temporal',
    inputTensor: 'Vector Capsules (B, 5, 256)',
    outputTensor: 'Temporal Context Embedding (B, 512)',
    parameters: '1.8M (2-Layer Bi-LSTM)',
    latencyAvg: '55 ms',
    keyTech: ['Bi-Directional Cell State', 'Gated Recurrent Temporal Memory', 'Frame-to-Frame Motion Delta', 'Eye-Blink & Lip-Sync Analysis'],
    description: 'Captures sequential motion dynamics across consecutive video frames. Evaluates unnatural eye blinking intervals, mouth movement desynchronization, and inter-frame artifact jitter.',
    mathematicalFormula: 'f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)',
    failureModesMitigated: ['Inter-frame Flicker Evading', 'Static Frame Illusion False Negatives', 'Synthetic Motion Discontinuities'],
    codeSnippet: `class TemporalLSTMHead(nn.Module):\n    def __init__(self, input_size=256, hidden_size=256):\n        super().__init__()\n        self.lstm = nn.LSTM(input_size, hidden_size, num_layers=2, batch_first=True, bidirectional=True)\n    def forward(self, seq):\n        # seq shape: (B, T, Feature_Dim)\n        out, (hn, cn) = self.lstm(seq)\n        return out[:, -1, :] # Final state representation`
  },
  {
    id: 'node-classifier',
    stageNumber: 6,
    title: 'Calibrated Softmax & Grad-CAM',
    subtitle: 'Classification Head + Explainability',
    category: 'Inference',
    inputTensor: 'Temporal Embedding (B, 512)',
    outputTensor: 'Prediction JSON { isFake, confidence, gradCamMap }',
    parameters: '0.2M (Dense FC Head)',
    latencyAvg: '20 ms',
    keyTech: ['Temperature Scaling Calibration', 'Grad-CAM Heatmap Localization', 'Confidence Interval Bounds', 'Abstain Threshold (Uncertainty)'],
    description: 'Maps sequence representations to a calibrated binary score [Real: 0.0, Fake: 1.0]. Computes Grad-CAM gradients from ResNet layer4 activations to generate visual heatmaps pinpointing forged facial regions.',
    mathematicalFormula: 'L_{Grad-CAM}^c = ReLU\\left(\\sum_k \\alpha_k^c A^k\\right)',
    failureModesMitigated: ['Uncalibrated Overconfidence', 'Black-box Decision Trust Gap', 'Boundary Prediction Drift'],
    codeSnippet: `def compute_gradcam(model, target_layer, input_tensor, category_index):\n    activations = []\n    gradients = []\n    def forward_hook(module, input, output): activations.append(output)\n    def backward_hook(module, grad_in, grad_out): gradients.append(grad_out[0])\n    target_layer.register_forward_hook(forward_hook)\n    target_layer.register_backward_hook(backward_hook)\n    out = model(input_tensor)\n    loss = out[0, category_index]\n    loss.backward()\n    weights = torch.mean(gradients[0], dim=(2, 3))\n    cam = torch.zeros(activations[0].shape[2:], dtype=torch.float32)\n    for i, w in enumerate(weights[0]): cam += w * activations[0][0, i]\n    return F.relu(cam)`
  }
];

export const RESEARCH_BENCHMARKS: ResearchBenchmark[] = [
  {
    dataset: 'FaceForensics++ (Raw)',
    manipulationType: 'DeepFakes, Face2Face, FaceSwap, NeuralTextures',
    compression: 'Raw',
    accuracy: 99.26,
    aucScore: 0.998,
    eer: 0.8,
    sampleCount: '1,000 Pristine + 4,000 Fake Videos (1.8M Frames)',
    referencePaper: 'Rössler et al., ICCV 2019'
  },
  {
    dataset: 'FaceForensics++ (HQ)',
    manipulationType: 'DeepFakes, Face2Face, FaceSwap, NeuralTextures',
    compression: 'HQ (CRF 23)',
    accuracy: 95.73,
    aucScore: 0.984,
    eer: 2.1,
    sampleCount: '1,000 Pristine + 4,000 Fake Videos',
    referencePaper: 'Rössler et al., ICCV 2019'
  },
  {
    dataset: 'FaceForensics++ (LQ)',
    manipulationType: 'DeepFakes, Face2Face, FaceSwap, NeuralTextures',
    compression: 'LQ (CRF 40)',
    accuracy: 81.00,
    aucScore: 0.892,
    eer: 8.4,
    sampleCount: '1,000 Pristine + 4,000 Fake Videos',
    referencePaper: 'Rössler et al., ICCV 2019'
  },
  {
    dataset: 'Deepfake Detection Challenge (DFDC)',
    manipulationType: 'GANs, Autoencoders, Heuristic Swaps',
    compression: 'HQ (CRF 23)',
    accuracy: 96.85,
    aucScore: 0.991,
    eer: 1.9,
    sampleCount: '124,000 Videos (3,426 Actors)',
    referencePaper: 'Maurya et al., IJRPR 2025'
  },
  {
    dataset: 'Celeb-DF v2 (Cross-Dataset)',
    manipulationType: 'Advanced DeepFake Autoencoders',
    compression: 'HQ (CRF 23)',
    accuracy: 78.38,
    aucScore: 0.865,
    eer: 11.2,
    sampleCount: '590 Real + 5,639 Fake Videos (Held-out Test)',
    referencePaper: 'Maurya et al., IJRPR 2025 / Li et al. CVPR 2020'
  }
];

export const DATA_PIPELINE_STAGES: DataPipelineStage[] = [
  { step: 1, name: 'REST / Kafka Video Ingestion', throughput: '1,200 MB/s', hardwareTarget: 'Kafka Queue', transformDetails: 'Async payload validation, CRC32 integrity verify, video header parse' },
  { step: 2, name: 'GPU Frame Decoding', throughput: '480 FPS', hardwareTarget: 'CPU Cluster', transformDetails: 'Decord GPU memory-mapped decoding, 1 FPS uniform interval sampling' },
  { step: 3, name: 'RetinaFace Alignment & Crop', throughput: '310 FPS', hardwareTarget: 'CPU Cluster', transformDetails: '68 landmark affine transformation, 1.3x bounding box center crop' },
  { step: 4, name: 'Tensor Normalization & YCbCr Tap', throughput: '1,500 FPS', hardwareTarget: 'Redis Cache', transformDetails: 'RGB scaling [0,1], Mean=[0.485, 0.456, 0.406], YCbCr spatial channel extract' },
  { step: 5, name: 'NVIDIA Triton Model Inference', throughput: '120 FPS / GPU', hardwareTarget: 'NVIDIA Triton GPU', transformDetails: 'Dynamic batch size 16, FP16 TensorRT acceleration engine execution' },
  { step: 6, name: 'Calibrated Output & Audit Logging', throughput: '3,000 Req/s', hardwareTarget: 'Redis Cache', transformDetails: 'Grad-CAM heatmap overlay generation, JSON result write to PostgreSQL' }
];

export const INSPECTION_SAMPLES: InspectionSample[] = [
  {
    id: 'sample-dfdc-01',
    title: 'DFDC Synthetic FaceSwap Clip #8402',
    sourceDataset: 'Deepfake Detection Challenge (DFDC)',
    manipulationMethod: 'Autoencoder FaceSwap + Poisson Blending',
    isFake: true,
    confidenceScore: 0.987,
    gradCamFocusRegion: 'Left cheek & jawline blending boundary seam',
    tensorFrames: 5,
    spatialScore: 0.96,
    capsuleScore: 0.99,
    temporalScore: 0.98,
    frameThumbnails: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'sample-ffpp-02',
    title: 'Face2Face Expression Reenactment #129',
    sourceDataset: 'FaceForensics++ (HQ)',
    manipulationMethod: 'Face2Face 76 Blendshape Transfer',
    isFake: true,
    confidenceScore: 0.954,
    gradCamFocusRegion: 'Mouth corner blendshape distortion & lip-sync mismatch',
    tensorFrames: 5,
    spatialScore: 0.91,
    capsuleScore: 0.96,
    temporalScore: 0.97,
    frameThumbnails: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'sample-pristine-03',
    title: 'Authentic Broadcast Recording #042',
    sourceDataset: 'FaceForensics++ Pristine Corpus',
    manipulationMethod: 'None (Pristine Original)',
    isFake: false,
    confidenceScore: 0.021,
    gradCamFocusRegion: 'Natural lighting gradient across forehead and chin',
    tensorFrames: 5,
    spatialScore: 0.03,
    capsuleScore: 0.02,
    temporalScore: 0.01,
    frameThumbnails: [
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    ]
  }
];
