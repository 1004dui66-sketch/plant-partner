import { describe, expect, it } from 'vitest';
import {
  extractResponseItems,
  getResponseResultCode,
  isDataGoKrSuccess,
  matchesPlantQuery,
} from './parse-response';

describe('parse-response', () => {
  it('공공데이터 JSON items를 추출한다', () => {
    const payload = {
      response: {
        header: { resultCode: '00' },
        body: {
          items: {
            item: [{ title: '몬스테라' }, { title: '스킨답서스' }],
          },
        },
      },
    };

    expect(extractResponseItems(payload)).toHaveLength(2);
    expect(getResponseResultCode(payload)).toBe('00');
  });

  it('성공 resultCode를 판별한다', () => {
    expect(isDataGoKrSuccess('00')).toBe(true);
    expect(isDataGoKrSuccess('0')).toBe(true);
    expect(isDataGoKrSuccess('1')).toBe(true);
    expect(isDataGoKrSuccess('30')).toBe(false);
  });

  it('공기정화식물 document XML 구조를 파싱한다', () => {
    const payload = {
      document: {
        root: {
          resultCode: '1',
          result: [{ title: '호야' }, { title: '피토니아' }],
        },
      },
    };

    expect(getResponseResultCode(payload)).toBe('1');
    expect(extractResponseItems(payload)).toHaveLength(2);
  });

  it('식물명 검색어를 부분 일치로 판별한다', () => {
    expect(matchesPlantQuery('monstera', ['Monstera Deliciosa'])).toBe(true);
    expect(matchesPlantQuery('선인장', ['Monstera Deliciosa'])).toBe(false);
  });
});
