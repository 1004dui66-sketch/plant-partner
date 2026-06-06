import {
  buildGeminiGenerateUrl,
  getGeminiApiKey,
  getGeminiModel,
  isGeminiConfigured,
} from '@/lib/gemini/config';
import { fetchImageAsBase64 } from '@/lib/gemini/fetch-image';
import {
  extractGeminiText,
  parseVisionPlantJson,
} from '@/lib/gemini/parse-response';
import type { GeminiGenerateResponse, VisionPlantResult } from '@/lib/gemini/types';

const VISION_PROMPT = `당신은 반려식물 전문가입니다. 이미지에서 식물을 식별하고 한국어로 관리 조언을 제공하세요.
반드시 아래 JSON 형식만 출력하세요. 다른 텍스트는 금지합니다.

{
  "plantName": "식물 일반명(한국어 우선, 없으면 영어)",
  "scientificName": "학명",
  "healthStatus": "healthy | needs-attention | unknown",
  "diagnosis": "현재 상태 진단 2-3문장",
  "recommendation": "관리 권장 사항 1-2문장",
  "confidence": 0.0-1.0,
  "careSummary": [
    { "icon": "water_drop", "title": "물 주기", "text": "..." },
    { "icon": "light_mode", "title": "햇빛", "text": "..." },
    { "icon": "thermostat", "title": "온도", "text": "..." }
  ]
}`;

export const identifyPlantFromImage = async (
  imageUrl: string,
): Promise<VisionPlantResult | null> => {
  if (!isGeminiConfigured()) {
    return null;
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  const image = await fetchImageAsBase64(imageUrl);
  const model = getGeminiModel();
  const endpoint = buildGeminiGenerateUrl(model, apiKey);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: VISION_PROMPT },
            {
              inline_data: {
                mime_type: image.mimeType,
                data: image.data,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  const payload = (await response.json()) as GeminiGenerateResponse;

  if (!response.ok) {
    throw new Error(
      payload.error?.message ??
        `Gemini API 오류 (HTTP ${response.status})`,
    );
  }

  const text = extractGeminiText(payload);
  if (!text) {
    return null;
  }

  return parseVisionPlantJson(text);
};
