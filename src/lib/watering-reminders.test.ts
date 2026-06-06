import { describe, expect, it } from 'vitest';
import {
  buildWateringReminder,
  buildWateringReminders,
  countOverdueWateringReminders,
  daysSinceWatering,
  isWateringOverdue,
  overduePlantIdSet,
} from './watering-reminders';

const NOW = new Date('2026-06-06T12:00:00.000Z').getTime();

describe('watering-reminders', () => {
  it('물주기 기록이 없으면 연체로 본다', () => {
    expect(isWateringOverdue(null, 7, NOW)).toBe(true);
  });

  it('주기 이상 경과하면 연체로 본다', () => {
    const last = new Date(NOW - 8 * 86_400_000).toISOString();
    expect(isWateringOverdue(last, 7, NOW)).toBe(true);
    expect(daysSinceWatering(last, NOW)).toBe(8);
  });

  it('주기 이내면 연체가 아니다', () => {
    const last = new Date(NOW - 3 * 86_400_000).toISOString();
    expect(isWateringOverdue(last, 7, NOW)).toBe(false);
  });

  it('식물별 알림 목록과 연체 집계를 만든다', () => {
    const reminders = buildWateringReminders(
      [
        {
          plantId: 'a',
          plantName: '몬스테라',
          nickname: '거실',
          lastWateredAt: new Date(NOW - 10 * 86_400_000).toISOString(),
        },
        {
          plantId: 'b',
          plantName: '선인장',
          nickname: '창가',
          lastWateredAt: new Date(NOW - 2 * 86_400_000).toISOString(),
        },
        {
          plantId: 'c',
          plantName: '스킨답서스',
          nickname: '베란다',
          lastWateredAt: null,
        },
      ],
      7,
      NOW,
    );

    expect(countOverdueWateringReminders(reminders)).toBe(2);
    expect(overduePlantIdSet(reminders)).toEqual(new Set(['a', 'c']));
    expect(buildWateringReminder(reminders[1]!, 7, NOW).isOverdue).toBe(false);
  });
});
