export interface FrameInferenceDetails {
  frameNumber: number;
  timeCode: string;
  spatialScore: number;
  capsulePoseError: number;
  temporalJitter: number;
  finalFakeProb: number;
  detectedArtifacts: string[];
  highPassFilterPreview: string;
  capsuleAgreementScore: number;
  lstmAttentionWeight: number;
}

export interface ModelLayerSpec {
  layerName: string;
  moduleType: 'ResNet50 Backbone' | 'Capsule Routing' | 'Bi-LSTM Temporal' | 'Softmax Classifier';
  inputShape: string;
  outputShape: string;
  parameters: string;
  flopsGiga: number;
  activation: string;
  description: string;
  codeSnippet: string;
}

export const FRAME_INFERENCE_PIPELINE_DATA: FrameInferenceDetails[] = Array.from({ length: 30 }, (_, i) => {
  const frameNum = i + 1;
  const isFakeRegion = frameNum >= 8 && frameNum <= 24;
  const spatial = isFakeRegion ? 0.88 + Math.sin(i) * 0.08 : 0.05 + Math.random() * 0.04;
  const capsuleError = isFakeRegion ? 0.92 + Math.cos(i) * 0.05 : 0.03 + Math.random() * 0.03;
  const temporalJitter = isFakeRegion ? 0.84 + Math.sin(i * 0.5) * 0.1 : 0.02 + Math.random() * 0.02;
  const finalProb = isFakeRegion ? 0.961 : 0.012;

  return {
    frameNumber: frameNum,
    timeCode: `00:00:${frameNum < 10 ? '0' + frameNum : frameNum}`,
    spatialScore: Number(spatial.toFixed(3)),
    capsulePoseError: Number(capsuleError.toFixed(3)),
    temporalJitter: Number(temporalJitter.toFixed(3)),
    finalFakeProb: Number(finalProb.toFixed(3)),
    detectedArtifacts: isFakeRegion
      ? ['ResNet Seam Discontinuity', 'Capsule Affine Distortion', 'Eye Blink Motion Anomaly']
      : ['Natural Skin Grain', 'Consistent Lighting Alignment'],
    highPassFilterPreview: isFakeRegion ? 'High-Frequency Noise Seam' : 'Uniform Micro-Texture',
    capsuleAgreementScore: isFakeRegion ? 0.18 : 0.96,
    lstmAttentionWeight: isFakeRegion ? 0.89 : 0.11,
  };
});

export const MODEL_SPECS_DATA: ModelLayerSpec[] = [
  {
    layerName: 'resnet50_highpass_backbone',
    moduleType: 'ResNet50 Backbone',
    inputShape: '(Batch, 3, 224, 224)',
    outputShape: '(Batch, 2048, 7, 7)',
    parameters: '25.6 Million',
    flopsGiga: 4.1,
    activation: 'ReLU + Residual Connections',
    description: 'Pre-trained ResNet-50 modified with a high-pass spatial filter layer in Conv1 to amplify subtle high-frequency steganographic noise artifacts and boundary blending seams.',
    codeSnippet: `class ResNet50HighPassBackbone(nn.Module):
    def __init__(self):
        super(ResNet50HighPassBackbone, self).__init__()
        self.high_pass_filter = HighPassFilterLayer(in_channels=3)
        self.resnet = models.resnet50(pretrained=True)
        self.resnet.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        
    def forward(self, x):
        hp_features = self.high_pass_filter(x)
        features = self.resnet.conv1(hp_features)
        features = self.resnet.bn1(features)
        features = self.resnet.relu(features)
        features = self.resnet.maxpool(features)
        
        x1 = self.resnet.layer1(features)
        x2 = self.resnet.layer2(x1)
        x3 = self.resnet.layer3(x2)
        x4 = self.resnet.layer4(x3) # (B, 2048, 7, 7)
        return x4`
  },
  {
    layerName: 'capsule_structural_routing',
    moduleType: 'Capsule Routing',
    inputShape: '(Batch, 2048, 7, 7)',
    outputShape: '(Batch, 16, 16) Pose Vector',
    parameters: '6.8 Million',
    flopsGiga: 1.8,
    activation: 'Squash Non-Linearity',
    description: 'Capsule Network using 3 iterations of Dynamic Routing between agreement vectors. Preserves 3D spatial hierarchy and structural coordinates (eye-to-nose-to-mouth ratio).',
    codeSnippet: `class CapsuleStructuralLayer(nn.Module):
    def __init__(self, in_channels=2048, num_capsules=16, capsule_dim=16, routing_iters=3):
        super().__init__()
        self.routing_iters = routing_iters
        self.W = nn.Parameter(torch.randn(1, 49, num_capsules, capsule_dim, in_channels))
        
    def squash(self, tensor, dim=-1):
        squared_norm = (tensor ** 2).sum(dim=dim, keepdim=True)
        scale = squared_norm / (1 + squared_norm)
        return scale * tensor / torch.sqrt(squared_norm + 1e-8)

    def forward(self, x):
        # Dynamic routing logic over spatial feature maps
        u_hat = torch.matmul(self.W, x.unsqueeze(-1))
        b_ij = torch.zeros(u_hat.shape[0], u_hat.shape[1], u_hat.shape[2], 1)
        for r in range(self.routing_iters):
            c_ij = F.softmax(b_ij, dim=2)
            v_j = self.squash((c_ij * u_hat).sum(dim=1, keepdim=True))
            if r < self.routing_iters - 1:
                b_ij = b_ij + (u_hat * v_j).sum(dim=-1, keepdim=True)
        return v_j.squeeze()`
  },
  {
    layerName: 'bilstm_temporal_sequence',
    moduleType: 'Bi-LSTM Temporal',
    inputShape: '(Batch, Frames=30, FeatureDim=256)',
    outputShape: '(Batch, 512) Temporal Embedding',
    parameters: '3.2 Million',
    flopsGiga: 0.9,
    activation: 'Tanh / Sigmoid Gates',
    description: 'Bi-directional Long Short-Term Memory network analyzing 30 consecutive frame vectors to detect temporal discontinuities, unnatural blinking frequencies, and micro-shuddering.',
    codeSnippet: `class BiLstmTemporalAggregator(nn.Module):
    def __init__(self, input_dim=256, hidden_dim=256, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True
        )
        self.attention = nn.Linear(hidden_dim * 2, 1)

    def forward(self, x_seq):
        # x_seq: (B, T=30, 256)
        lstm_out, _ = self.lstm(x_seq) # (B, 30, 512)
        attn_weights = F.softmax(self.attention(lstm_out), dim=1)
        context_vector = torch.sum(attn_weights * lstm_out, dim=1)
        return context_vector, attn_weights`
  },
  {
    layerName: 'triton_softmax_classifier',
    moduleType: 'Softmax Classifier',
    inputShape: '(Batch, 512)',
    outputShape: '(Batch, 2) [Real, Fake]',
    parameters: '1.0K',
    flopsGiga: 0.01,
    activation: 'Calibrated Softmax (Temperature = 1.2)',
    description: 'Final dense classification layer with Temperature Scaling calibration for risk-controlled forensic prediction scores.',
    codeSnippet: `class CalibratedSoftmaxClassifier(nn.Module):
    def __init__(self, in_features=512, temp=1.2):
        super().__init__()
        self.fc = nn.Linear(in_features, 2)
        self.temp = temp

    def forward(self, x):
        logits = self.fc(x) / self.temp
        probs = F.softmax(logits, dim=-1)
        return probs`
  }
];
