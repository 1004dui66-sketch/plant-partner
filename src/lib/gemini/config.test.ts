import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildGeminiGenerateUrl,
  getGeminiApiKey,
  isGeminiConfigured,
} from './config';

describe('gemini config', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reads GEMINI_API_KEY', () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-key');
    vi.stubEnv('GOOGLE_AI_API_KEY', '');

    expect(getGeminiApiKey()).toBe('test-key');
    expect(isGeminiConfigured()).toBe(true);
  });

  it('falls back to GOOGLE_AI_API_KEY', () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    vi.stubEnv('GOOGLE_AI_API_KEY', 'google-key');

    expect(getGeminiApiKey()).toBe('google-key');
  });

  it('builds generate URL', () => {
    expect(buildGeminiGenerateUrl('gemini-2.0-flash', 'abc123')).toContain(
      'generativelanguage.googleapis.com',
    );
    expect(buildGeminiGenerateUrl('gemini-2.0-flash', 'abc123')).toContain(
      'abc123',
    );
  });
});
