import { MOCK_ANALYSIS_RESULT } from '@/lib/constants';

export type CareSummaryItem = {
  icon: string;
  title: string;
  text: string;
};

export const DEFAULT_CARE_SUMMARY: readonly CareSummaryItem[] =
  MOCK_ANALYSIS_RESULT.careSummary;

export const DEFAULT_CONFIDENCE = 0.98;

export const parseCareSummary = (
  value: unknown,
): readonly CareSummaryItem[] => {
  if (!Array.isArray(value)) {
    return DEFAULT_CARE_SUMMARY;
  }

  const items = value.flatMap((entry) => {
    if (
      typeof entry !== 'object' ||
      entry === null ||
      !('icon' in entry) ||
      !('title' in entry) ||
      !('text' in entry)
    ) {
      return [];
    }

    const { icon, title, text } = entry as Record<string, unknown>;

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

export const formatConfidence = (confidence: number | null | undefined): string => {
  if (confidence === null || confidence === undefined) {
    return `${Math.round(DEFAULT_CONFIDENCE * 100)}% Accuracy`;
  }

  const percent = confidence <= 1 ? confidence * 100 : confidence;
  return `${Math.round(percent)}% Accuracy`;
};
