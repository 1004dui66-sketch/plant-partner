const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toItemArray = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value.filter(isRecord);
  }

  if (isRecord(value)) {
    return [value];
  }

  return [];
};

const normalizeResultCode = (value: unknown): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return null;
};

/** 공공데이터 API별 성공 코드 (00·0·1 등) */
export const isDataGoKrSuccess = (resultCode: string | null): boolean =>
  resultCode === '00' || resultCode === '0' || resultCode === '1';

export const extractResponseItems = (payload: unknown): Record<string, unknown>[] => {
  if (!isRecord(payload)) {
    return [];
  }

  const documentRoot = isRecord(payload.document)
    ? payload.document.root
    : null;
  if (isRecord(documentRoot)) {
    return toItemArray(documentRoot.result);
  }

  const response = payload.response;
  if (!isRecord(response)) {
    return [];
  }

  const body = response.body;
  if (!isRecord(body)) {
    return [];
  }

  const items = body.items;
  if (!isRecord(items)) {
    return [];
  }

  return toItemArray(items.item ?? items);
};

export const getResponseResultCode = (payload: unknown): string | null => {
  if (!isRecord(payload)) {
    return null;
  }

  const documentRoot = isRecord(payload.document)
    ? payload.document.root
    : null;
  if (isRecord(documentRoot)) {
    return normalizeResultCode(documentRoot.resultCode);
  }

  const header = isRecord(payload.response) ? payload.response.header : null;
  if (!isRecord(header)) {
    return null;
  }

  return normalizeResultCode(header.resultCode);
};

export const pickString = (
  item: Record<string, unknown>,
  keys: readonly string[],
): string | null => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return null;
};

export const normalizeSearchText = (value: string): string =>
  value.toLowerCase().replace(/\s+/g, '');

export const matchesPlantQuery = (
  query: string,
  candidates: readonly (string | null | undefined)[],
): boolean => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return false;
  }

  return candidates.some((candidate) => {
    if (!candidate) {
      return false;
    }

    const normalizedCandidate = normalizeSearchText(candidate);
    return (
      normalizedCandidate.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedCandidate)
    );
  });
};
