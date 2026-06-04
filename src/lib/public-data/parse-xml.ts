import { XMLParser } from 'fast-xml-parser';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const parser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
  parseTagValue: false,
  isArray: (tagName) => tagName === 'item' || tagName === 'result',
});

export const parseDataGoKrXml = (xml: string): unknown => {
  const parsed = parser.parse(xml) as Record<string, unknown> | undefined;
  if (isRecord(parsed?.response)) {
    return parsed.response;
  }

  if (isRecord(parsed?.document)) {
    return parsed;
  }

  return parsed ?? null;
};
