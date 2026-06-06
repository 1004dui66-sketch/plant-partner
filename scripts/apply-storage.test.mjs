import { describe, expect, it } from 'vitest';
import { projectRefFromUrl } from './lib/load-env.mjs';

describe('apply-storage helpers', () => {
  it('extracts project ref from Supabase URL', () => {
    expect(projectRefFromUrl('https://abc123.supabase.co')).toBe('abc123');
  });
});
