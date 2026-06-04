import { describe, expect, it } from 'vitest';
import { MOCK_PLANTS } from './mock-plants';
import { filterPlants, inferPlantCategory } from './plants';

describe('filterPlants', () => {
  it('검색어가 없으면 전체 목록을 반환한다', () => {
    expect(filterPlants(MOCK_PLANTS, '')).toHaveLength(MOCK_PLANTS.length);
  });

  it('식물 이름으로 필터링한다', () => {
    const result = filterPlants(MOCK_PLANTS, 'monstera');
    expect(result).toHaveLength(1);
    expect(result[0]?.plantName).toBe('Monstera Deliciosa');
  });

  it('닉네임으로 필터링한다', () => {
    const result = filterPlants(MOCK_PLANTS, '거실');
    expect(result).toHaveLength(1);
  });

  it('카테고리 필터를 적용한다', () => {
    const result = filterPlants(MOCK_PLANTS, '', '다육식물');
    expect(result).toHaveLength(1);
    expect(result[0]?.category).toBe('다육식물');
  });

  it('식물 이름으로 카테고리를 추론한다', () => {
    expect(inferPlantCategory('Echeveria Elegans')).toBe('다육식물');
    expect(inferPlantCategory('Monstera Deliciosa')).toBe('실내');
  });
});
