import type {
  ImageAnalysisInput,
  ImageAnalysisProvider,
  ImageAnalysisResult,
  IssueCategory,
} from '../types/civic';
import { analyzeCivicComplaint } from './triageEngine';

interface CategoryCueRule {
  category: IssueCategory;
  keywords: readonly string[];
  signalLabel: string;
}

const CATEGORY_CUE_RULES: readonly CategoryCueRule[] = [
  {
    category: 'Drainage Blockage',
    keywords: [
      'drain',
      'drainage',
      'culvert',
      'sewer',
      'gutter',
      'manhole',
      'stormwater',
      'clogged',
      'silt',
    ],
    signalLabel: 'Matched blocked drain / culvert visual and filename indicators',
  },
  {
    category: 'Streetlight Issue',
    keywords: [
      'streetlight',
      'street_light',
      'street-light',
      'lamp',
      'luminaire',
      'pole',
      'light',
      'bulb',
      'outage',
      'electrical',
      'twilight',
    ],
    signalLabel: 'Matched streetlighting pole / low-visibility outage indicators',
  },
  {
    category: 'Water Leakage',
    keywords: ['leak', 'leakage', 'pipe', 'water', 'spray', 'burst', 'valve', 'pipeline'],
    signalLabel: 'Matched pressurized water spill / pipeline leakage indicators',
  },
  {
    category: 'Garbage',
    keywords: ['garbage', 'waste', 'trash', 'bin', 'litter', 'dump', 'refuse', 'plastic'],
    signalLabel: 'Matched uncollected municipal waste / bin overflow indicators',
  },
  {
    category: 'Pollution',
    keywords: ['smoke', 'pollution', 'burn', 'burning', 'effluent', 'smog', 'fume', 'toxic'],
    signalLabel: 'Matched smoke / environmental emission indicators',
  },
  {
    category: 'Pothole',
    keywords: ['pothole', 'crater', 'cavity', 'pit'],
    signalLabel: 'Matched asphalt carriageway pothole indicators',
  },
  {
    category: 'Damaged Road',
    keywords: ['road', 'asphalt', 'tarmac', 'pavement', 'shoulder', 'crack', 'trench'],
    signalLabel: 'Matched deteriorated road surface indicators',
  },
];

export async function extractVisualHintsFromImage(
  imageUrl: string,
): Promise<ImageAnalysisInput['visualHints']> {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !imageUrl) {
    return undefined;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timeout = window.setTimeout(() => resolve(undefined), 400);

    img.onload = () => {
      window.clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(undefined);
          return;
        }
        ctx.drawImage(img, 0, 0, 24, 24);
        const { data } = ctx.getImageData(0, 0, 24, 24);
        let totalLuminance = 0;
        let blueDominant = 0;
        let warmDominant = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          totalLuminance += 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (b > r + 18 && b >= g) {
            blueDominant += 1;
          } else if (r > b + 20 && g > b + 5) {
            warmDominant += 1;
          }
        }

        const brightness = Math.round(totalLuminance / Math.max(1, pixelCount));
        let dominantTone: NonNullable<ImageAnalysisInput['visualHints']>['dominantTone'] = 'neutral';
        if (brightness < 68) {
          dominantTone = 'dark';
        } else if (blueDominant > pixelCount * 0.25) {
          dominantTone = 'blue-wet';
        } else if (warmDominant > pixelCount * 0.28) {
          dominantTone = 'earth-warm';
        }

        resolve({ brightness, dominantTone });
      } catch {
        resolve(undefined);
      }
    };

    img.onerror = () => {
      window.clearTimeout(timeout);
      resolve(undefined);
    };

    img.src = imageUrl;
  });
}

export function detectIssueCategoryFromImage(input: {
  imageName: string;
  citizenDescription?: string;
  visualHints?: ImageAnalysisInput['visualHints'];
}): {
  category: IssueCategory;
  confidenceLabel: ImageAnalysisResult['confidenceLabel'];
  signals: string[];
} {
  const combined = `${input.imageName} ${input.citizenDescription ?? ''}`.toLowerCase();

  for (const rule of CATEGORY_CUE_RULES) {
    if (rule.keywords.some((kw) => combined.includes(kw))) {
      return {
        category: rule.category,
        confidenceLabel: 'High Confidence (Sample)',
        signals: [rule.signalLabel],
      };
    }
  }

  if (input.visualHints?.dominantTone === 'dark' || (input.visualHints?.brightness ?? 255) < 68) {
    return {
      category: 'Streetlight Issue',
      confidenceLabel: 'Moderate Confidence (Sample)',
      signals: ['Low-luminance frame detected; mapped to public lighting inspection'],
    };
  }

  if (input.visualHints?.dominantTone === 'blue-wet') {
    return {
      category: 'Water Leakage',
      confidenceLabel: 'Moderate Confidence (Sample)',
      signals: ['Cool wet-surface pixel profile detected; mapped to water supply inspection'],
    };
  }

  if (input.visualHints?.dominantTone === 'earth-warm') {
    return {
      category: 'Garbage',
      confidenceLabel: 'Moderate Confidence (Sample)',
      signals: ['Warm high-contrast texture profile detected; mapped to solid waste inspection'],
    };
  }

  return {
    category: 'Pothole',
    confidenceLabel: 'Moderate Confidence (Sample)',
    signals: ['Default urban street surface profile applied (simulated visual triage)'],
  };
}

export const sampleImageAnalysisProvider: ImageAnalysisProvider = {
  id: 'sample-visual-heuristic-v1',
  label: 'Sample Visual Heuristic Analyzer (Simulated)',
  isSimulated: true,

  async analyzeImage(input: ImageAnalysisInput): Promise<ImageAnalysisResult> {
    const visualHints =
      input.visualHints ?? (await extractVisualHintsFromImage(input.imageUrl));

    const detected = detectIssueCategoryFromImage({
      imageName: input.imageName,
      citizenDescription: input.citizenDescription,
      visualHints,
    });

    const activeCategory = input.categoryOverride ?? detected.category;
    const baseTriage = analyzeCivicComplaint({
      category: activeCategory,
      description: input.citizenDescription ?? '',
      ward: input.ward,
      imageName: input.imageName,
    });

    const signals = [...detected.signals];
    if (input.categoryOverride && input.categoryOverride !== detected.category) {
      signals.push(`Citizen confirmed category override: ${input.categoryOverride}`);
    }
    signals.push(`Auto-routed to ${baseTriage.recommendedDepartment}`);

    return {
      ...baseTriage,
      detectedCategory: detected.category,
      analyzerName: this.label,
      confidenceLabel: detected.confidenceLabel,
      visualSignals: signals,
    };
  },
};

export function createImageAnalyzer(
  provider: ImageAnalysisProvider = sampleImageAnalysisProvider,
): ImageAnalysisProvider {
  return provider;
}
