import { describe, expect, it } from 'vitest';
import {
  computeHydrationPercent,
  daysSinceWaterFromLogs,
  deriveCareGauges,
} from './plant-care-metrics';

describe('plant-care-metrics', () => {
  it('computes hydration from days since water', () => {
    expect(computeHydrationPercent(null)).toBe(35);
    expect(computeHydrationPercent(0)).toBe(100);
    expect(computeHydrationPercent(10)).toBe(0);
  });

  it('reads latest water log date', () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 2);
    expect(
      daysSinceWaterFromLogs([recent.toISOString()]),
    ).toBeGreaterThanOrEqual(1);
    expect(daysSinceWaterFromLogs([])).toBeNull();
  });

  it('builds three care gauges for detail UI', () => {
    const gauges = deriveCareGauges({
      daysSinceWater: 3,
      plantStatus: 'healthy',
      healthStatus: 'healthy',
    });
    expect(gauges).toHaveLength(3);
    expect(gauges[0]?.id).toBe('hydration');
    expect(gauges[0]?.valueLabel).toBe('70%');
  });
});
