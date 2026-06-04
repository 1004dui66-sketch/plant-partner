import { describe, expect, it } from 'vitest';
import {
  STITCH_SCREENS,
  stitchRouteFor,
  type StitchScreenId,
} from './stitch-screens';

describe('stitch-screens', () => {
  it('maps all 8 exported screens to app routes', () => {
    expect(STITCH_SCREENS).toHaveLength(8);
    const routes = STITCH_SCREENS.map((s) => s.route);
    expect(routes).toContain('/login');
    expect(routes).toContain('/scan');
    expect(routes).toContain('/collection');
    expect(routes).toContain('/history');
    expect(routes).toContain('/settings');
  });

  it('resolves route by stitch screen id', () => {
    expect(stitchRouteFor('kr_1')).toBe('/scan');
    expect(stitchRouteFor('kr_4')).toBe('/plants/[id]');
  });

  it('covers every StitchScreenId', () => {
    const ids = STITCH_SCREENS.map((s) => s.id);
    const expected: StitchScreenId[] = [
      'plant_buddy_kr',
      'kr_1',
      'kr_2',
      'kr_3',
      'kr_4',
      'kr_5',
      'kr_6',
      'kr_7',
    ];
    expect(ids).toEqual(expected);
  });
});
