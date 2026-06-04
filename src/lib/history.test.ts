import { describe, expect, it } from 'vitest';
import { groupHistoryBySection } from './history';
import { MOCK_HISTORY } from './mock-history';

describe('groupHistoryBySection', () => {
  it('섹션별로 기록을 그룹화한다', () => {
    const sections = groupHistoryBySection(MOCK_HISTORY);
    expect(sections).toHaveLength(3);
    expect(sections[0]?.label).toBe('오늘');
    expect(sections[0]?.entries).toHaveLength(2);
  });
});
