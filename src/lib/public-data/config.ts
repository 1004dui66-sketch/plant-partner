export type PublicDataEndpointKey =
  | 'airPurifying'
  | 'standardPlant'
  | 'baekduProtected'
  | 'seedBook';

/** data.go.kr 승인 서비스 ↔ 환경 변수 매핑 */
export const PUBLIC_DATA_SERVICES: ReadonlyArray<{
  readonly key: PublicDataEndpointKey;
  readonly envKey: string;
  readonly label: string;
}> = [
  {
    key: 'airPurifying',
    envKey: 'DATA_GO_KR_AIR_PURIFYING_URL',
    label: '농촌진흥청 국립원예특작과학원_공기정화식물 조회',
  },
  {
    key: 'standardPlant',
    envKey: 'DATA_GO_KR_STANDARD_PLANT_URL',
    label: '산림청 국립수목원_국가표준식물목록 조회',
  },
  {
    key: 'baekduProtected',
    envKey: 'DATA_GO_KR_BAEKDU_PLANT_URL',
    label: '한국수목원정원관리원_백두대간 보호식물정보',
  },
  {
    key: 'seedBook',
    envKey: 'DATA_GO_KR_SEED_BOOK_URL',
    label: '한국수목원정원관리원_종자자료집정보',
  },
] as const;

const DEFAULT_ENDPOINTS: Record<PublicDataEndpointKey, string> = {
  airPurifying:
    'https://apis.data.go.kr/1390804/NihhsFuriAirInfo/selectPuriAirPlantList',
  standardPlant: '',
  baekduProtected:
    'https://apis.data.go.kr/B554620/prtcPrntInfoService/getPrtcPrntInfoList',
  seedBook:
    'https://apis.data.go.kr/B554620/srbkInfoService/getSrbkInfoList',
};

const ENV_KEYS: Record<PublicDataEndpointKey, string> = {
  airPurifying: 'DATA_GO_KR_AIR_PURIFYING_URL',
  standardPlant: 'DATA_GO_KR_STANDARD_PLANT_URL',
  baekduProtected: 'DATA_GO_KR_BAEKDU_PLANT_URL',
  seedBook: 'DATA_GO_KR_SEED_BOOK_URL',
};

const STANDARD_PLANT_OPERATION_ENV = 'DATA_GO_KR_STANDARD_PLANT_OPERATION';

const KPNI_SERVICE_BASE = 'https://apis.data.go.kr/1400119/KpniService';

const isKpniServiceBase = (url: string): boolean => {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, '');
    return pathname.endsWith('/KpniService');
  } catch {
    return false;
  }
};

const resolveStandardPlantUrl = (): string | null => {
  const baseOrFull = process.env[ENV_KEYS.standardPlant]?.trim();
  if (!baseOrFull) {
    return null;
  }

  if (!isKpniServiceBase(baseOrFull)) {
    return baseOrFull;
  }

  const operation = process.env[STANDARD_PLANT_OPERATION_ENV]?.trim();
  if (!operation) {
    return null;
  }

  return `${baseOrFull.replace(/\/$/, '')}/${operation.replace(/^\//, '')}`;
};

export const getPublicDataEndpoint = (
  key: PublicDataEndpointKey,
): string | null => {
  if (key === 'standardPlant') {
    const resolved = resolveStandardPlantUrl();
    if (resolved) {
      return resolved;
    }
  }

  const fromEnv = process.env[ENV_KEYS[key]]?.trim();
  if (fromEnv && key !== 'standardPlant') {
    return fromEnv;
  }

  const fallback = DEFAULT_ENDPOINTS[key];
  return fallback || null;
};

export const getKpniServiceBaseUrl = (): string => KPNI_SERVICE_BASE;

export const getDataGoKrServiceKey = (): string | null => {
  const key = process.env.DATA_GO_KR_SERVICE_KEY?.trim();
  return key || null;
};

export const isPublicDataConfigured = (): boolean =>
  getDataGoKrServiceKey() !== null;
