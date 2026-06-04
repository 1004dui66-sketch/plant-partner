import { describe, expect, it, vi } from 'vitest';
import { buildDataGoKrUrl } from './client';
import { getPublicDataEndpoint, isPublicDataConfigured } from './config';

describe('public-data config', () => {
  it('서비스 키 존재 여부를 확인한다', () => {
    vi.stubEnv('DATA_GO_KR_SERVICE_KEY', 'abc');
    expect(isPublicDataConfigured()).toBe(true);
    vi.unstubAllEnvs();
  });

  it('공기정화 API 기본 URL을 제공한다', () => {
    expect(getPublicDataEndpoint('airPurifying')).toContain(
      'selectPuriAirPlantList',
    );
  });

  it('백두대간·종자자료집 기본 URL을 제공한다', () => {
    expect(getPublicDataEndpoint('baekduProtected')).toContain(
      'getPrtcPrntInfoList',
    );
    expect(getPublicDataEndpoint('seedBook')).toContain('getSrbkInfoList');
  });

  it('국가표준식물목록은 베이스만 있고 operation 없으면 null이다', () => {
    vi.stubEnv(
      'DATA_GO_KR_STANDARD_PLANT_URL',
      'https://apis.data.go.kr/1400119/KpniService',
    );
    vi.stubEnv('DATA_GO_KR_STANDARD_PLANT_OPERATION', '');
    expect(getPublicDataEndpoint('standardPlant')).toBeNull();
    vi.unstubAllEnvs();
  });

  it('국가표준식물목록은 베이스+operation을 합친다', () => {
    vi.stubEnv(
      'DATA_GO_KR_STANDARD_PLANT_URL',
      'https://apis.data.go.kr/1400119/KpniService',
    );
    vi.stubEnv('DATA_GO_KR_STANDARD_PLANT_OPERATION', 'getExampleList');
    expect(getPublicDataEndpoint('standardPlant')).toBe(
      'https://apis.data.go.kr/1400119/KpniService/getExampleList',
    );
    vi.unstubAllEnvs();
  });

  it('4개 승인 서비스에 환경 변수 키가 매핑된다', async () => {
    const { PUBLIC_DATA_SERVICES } = await import('./config');
    expect(PUBLIC_DATA_SERVICES).toHaveLength(4);
    expect(PUBLIC_DATA_SERVICES.map((service) => service.envKey)).toEqual([
      'DATA_GO_KR_AIR_PURIFYING_URL',
      'DATA_GO_KR_STANDARD_PLANT_URL',
      'DATA_GO_KR_BAEKDU_PLANT_URL',
      'DATA_GO_KR_SEED_BOOK_URL',
    ]);
  });
});

describe('buildDataGoKrUrl', () => {
  it('XML 전용 API는 type=json을 붙이지 않는다', () => {
    vi.stubEnv('DATA_GO_KR_SERVICE_KEY', 'test-key');

    const url = buildDataGoKrUrl(
      'https://apis.data.go.kr/1390804/NihhsFuriAirInfo/selectPuriAirPlantList',
      { searchWord: '몬스테라', type: 'xml' },
      { preferJson: false },
    );

    expect(url.searchParams.get('type')).toBeNull();
    expect(url.searchParams.get('searchWord')).toBe('몬스테라');
    vi.unstubAllEnvs();
  });
});
