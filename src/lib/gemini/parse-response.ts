import { DEFAULT_CARE_SUMMARY } from '@/lib/analysis';
import type { VisionPlantResult } from '@/lib/gemini/types';

const clampConfidence = (value: unknown): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0.85;
  }
  const normalized = value <= 1 ? value : value / 100;
  return Math.min(0.99, Math.max(0, normalized));
};

const parseCareSummary = (
  value: unknown,
): VisionPlantResult['careSummary'] => {
  if (!Array.isArray(value)) {
    return DEFAULT_CARE_SUMMARY;
  }

  const items = value.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return [];
    }

    const record = entry as Record<string, unknown>;
    const icon = record.icon;
    const title = record.title;
    const text = record.text;

    if (
      typeof icon !== 'string' ||
      typeof title !== 'string' ||
      typeof text !== 'string'
    ) {
      return [];
    }

    return [{ icon, title, text }];
  });

  return items.length > 0 ? items : DEFAULT_CARE_SUMMARY;
};

export const parseVisionPlantJson = (raw: string): VisionPlantResult | null => {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const plantName =
      typeof parsed.plantName === 'string' ? parsed.plantName.trim() : '';

    if (!plantName) {
      return null;
    }

    return {
      plantName,
      scientificName:
        typeof parsed.scientificName === 'string'
          ? parsed.scientificName.trim()
          : '',
      healthStatus:
        typeof parsed.healthStatus === 'string'
          ? parsed.healthStatus.trim()
          : 'healthy',
      diagnosis:
        typeof parsed.diagnosis === 'string' ? parsed.diagnosis.trim() : '',
      recommendation:
        typeof parsed.recommendation === 'string'
          ? parsed.recommendation.trim()
          : '',
      confidence: clampConfidence(parsed.confidence),
      careSummary: parseCareSummary(parsed.careSummary),
    };
  } catch {
    return null;
  }
};

export const extractGeminiText = (payload: {
  candidates?: ReadonlyArray<{
    content?: { parts?: ReadonlyArray<{ text?: string }> };
  }>;
}): string | null => {
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  return text || null;
};
