import { DEFAULT_CONFIDENCE } from '@/lib/analysis';
import { MOCK_ANALYSIS_RESULT } from '@/lib/constants';
import { isPublicDataConfigured } from '@/lib/public-data/config';
import {
  searchAirPurifyingPlant,
  searchBaekduProtectedPlant,
  searchSeedBookPlant,
  searchStandardPlant,
} from '@/lib/public-data/search-plants';
import type {
  EnrichedPlantAnalysis,
  PublicPlantRecord,
} from '@/lib/public-data/types';

const BADGE_LABELS: Record<PublicPlantRecord['source'], string> = {
  standardPlant: '국가표준식물',
  airPurifying: '공기정화식물',
  baekduProtected: '백두대간 보호식물',
  seedBook: '종자자료집',
};

const buildCareSummary = (
  airPurifying: PublicPlantRecord | null,
): EnrichedPlantAnalysis['careSummary'] => {
  const base = [...MOCK_ANALYSIS_RESULT.careSummary];

  if (!airPurifying) {
    return base;
  }

  return [
    {
      icon: 'air',
      title: '공기정화',
      text:
        airPurifying.description ??
        `${airPurifying.plantName ?? '이 식물'}은(는) 실내 공기정화에 도움이 될 수 있습니다.`,
    },
    base[1] ?? {
      icon: 'light_mode',
      title: '햇빛',
      text: '밝은 간접광 환경을 선호합니다.',
    },
    base[2] ?? {
      icon: 'thermostat',
      title: '온도',
      text: '18–27°C의 실내 온도가 적합합니다.',
    },
  ];
};

const buildSymbolism = (
  records: readonly (PublicPlantRecord | null)[],
): string => {
  const parts = records.flatMap((record) => {
    if (!record) {
      return [];
    }

    const label = BADGE_LABELS[record.source];
    const detail = record.description ?? record.plantName;
    return detail ? [`${label}: ${detail}`] : [label];
  });

  if (parts.length === 0) {
    return MOCK_ANALYSIS_RESULT.symbolism;
  }

  return parts.join(' ');
};

const buildDiagnosis = (
  standard: PublicPlantRecord | null,
  airPurifying: PublicPlantRecord | null,
  baekdu: PublicPlantRecord | null,
): string => {
  if (airPurifying?.description) {
    return airPurifying.description;
  }

  if (standard?.description) {
    return standard.description;
  }

  if (baekdu?.description) {
    return `백두대간 보호 대상 식물 정보: ${baekdu.description}`;
  }

  return MOCK_ANALYSIS_RESULT.diagnosis;
};

const buildRecommendation = (
  seedBook: PublicPlantRecord | null,
  airPurifying: PublicPlantRecord | null,
): string => {
  if (seedBook?.description) {
    return seedBook.description;
  }

  if (airPurifying?.plantName) {
    return `${airPurifying.plantName}은(는) 실내 배치 시 환기와 함께 관리하면 좋습니다.`;
  }

  return MOCK_ANALYSIS_RESULT.recommendation;
};

const mergeRecords = (
  query: string,
  standard: PublicPlantRecord | null,
  airPurifying: PublicPlantRecord | null,
  baekdu: PublicPlantRecord | null,
  seedBook: PublicPlantRecord | null,
): EnrichedPlantAnalysis => {
  const badges = [standard, airPurifying, baekdu, seedBook]
    .filter((record): record is PublicPlantRecord => record !== null)
    .map((record) => BADGE_LABELS[record.source]);

  return {
    plantName:
      standard?.plantName ??
      airPurifying?.plantName ??
      baekdu?.plantName ??
      seedBook?.plantName ??
      query,
    scientificName:
      standard?.scientificName ??
      airPurifying?.scientificName ??
      baekdu?.scientificName ??
      seedBook?.scientificName ??
      MOCK_ANALYSIS_RESULT.scientificName,
    healthStatus: MOCK_ANALYSIS_RESULT.healthStatus,
    diagnosis: buildDiagnosis(standard, airPurifying, baekdu),
    recommendation: buildRecommendation(seedBook, airPurifying),
    symbolism: buildSymbolism([baekdu, seedBook, airPurifying]),
    confidence: badges.length > 0 ? 0.92 : DEFAULT_CONFIDENCE,
    careSummary: buildCareSummary(airPurifying),
    badges,
  };
};

export const enrichPlantAnalysis = async (
  query: string,
): Promise<EnrichedPlantAnalysis> => {
  const normalizedQuery = query.trim() || MOCK_ANALYSIS_RESULT.plantName;

  if (!isPublicDataConfigured()) {
    return mergeRecords(normalizedQuery, null, null, null, null);
  }

  const [standard, airPurifying, baekdu, seedBook] = await Promise.all([
    searchStandardPlant(normalizedQuery),
    searchAirPurifyingPlant(normalizedQuery),
    searchBaekduProtectedPlant(normalizedQuery),
    searchSeedBookPlant(normalizedQuery),
  ]);

  return mergeRecords(
    normalizedQuery,
    standard,
    airPurifying,
    baekdu,
    seedBook,
  );
};
