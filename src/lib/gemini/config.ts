const API_KEY_ENV_KEYS = ['GEMINI_API_KEY', 'GOOGLE_AI_API_KEY'] as const;

export const getGeminiApiKey = (): string | null => {
  for (const envKey of API_KEY_ENV_KEYS) {
    const value = process.env[envKey]?.trim();
    if (value) {
      return value;
    }
  }
  return null;
};

export const getGeminiModel = (): string =>
  process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

export const isGeminiConfigured = (): boolean => getGeminiApiKey() !== null;

export const buildGeminiGenerateUrl = (model: string, apiKey: string): string =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
