import { fetchDataGoKrJson } from '@/lib/public-data/client';
import { getPublicDataEndpoint } from '@/lib/public-data/config';
import {
  extractResponseItems,
  getResponseResultCode,
  isDataGoKrSuccess,
  matchesPlantQuery,
  pickString,
} from '@/lib/public-data/parse-response';
import type { PublicPlantRecord } from '@/lib/public-data/types';

const mapItem = (
  item: Record<string, unknown>,
  source: PublicPlantRecord['source'],
  nameKeys: readonly string[],
  scientificKeys: readonly string[],
  descriptionKeys: readonly string[],
): PublicPlantRecord => ({
  source,
  raw: item,
  plantName: pickString(item, nameKeys),
  scientificName: pickString(item, scientificKeys),
  description: pickString(item, descriptionKeys),
});

const searchEndpoint = async (
  endpointKey: Parameters<typeof getPublicDataEndpoint>[0],
  query: string,
  source: PublicPlantRecord['source'],
  searchParams: Record<string, string | number | undefined>,
  fieldKeys: {
    nameKeys: readonly string[];
    scientificKeys: readonly string[];
    descriptionKeys: readonly string[];
  },
  fetchOptions: { preferJson?: boolean } = {},
): Promise<PublicPlantRecord | null> => {
  const endpoint = getPublicDataEndpoint(endpointKey);
  if (!endpoint) {
    return null;
  }

  try {
    const payload = await fetchDataGoKrJson(
      endpoint,
      searchParams,
      fetchOptions,
    );
    const resultCode = getResponseResultCode(payload);

    if (resultCode && !isDataGoKrSuccess(resultCode)) {
      return null;
    }

    const items = extractResponseItems(payload);
    const match = items.find((item) =>
      matchesPlantQuery(query, [
        pickString(item, fieldKeys.nameKeys),
        pickString(item, fieldKeys.scientificKeys),
        pickString(item, fieldKeys.descriptionKeys),
      ]),
    );

    if (!match) {
      return null;
    }

    return mapItem(
      match,
      source,
      fieldKeys.nameKeys,
      fieldKeys.scientificKeys,
      fieldKeys.descriptionKeys,
    );
  } catch {
    return null;
  }
};

export const searchStandardPlant = async (
  query: string,
): Promise<PublicPlantRecord | null> =>
  searchEndpoint(
    'standardPlant',
    query,
    'standardPlant',
    {
      searchWord: query,
      plantNm: query,
      keyword: query,
      type: 'xml',
    },
    {
      nameKeys: ['plantNm', 'plantKorNm', 'kornNm', 'koreanName', 'title'],
      scientificKeys: ['plantEngNm', 'scntfcNm', 'scientificName', 'engNm'],
      descriptionKeys: ['plantDesc', 'description', 'rmrkCn'],
    },
    { preferJson: false },
  );

export const searchAirPurifyingPlant = async (
  query: string,
): Promise<PublicPlantRecord | null> =>
  searchEndpoint(
    'airPurifying',
    query,
    'airPurifying',
    {
      searchWord: query,
      pageNo: 1,
      numOfRows: 20,
      type: 'xml',
    },
    {
      nameKeys: ['title', 'plantNm', 'plantName'],
      scientificKeys: ['scientificName', 'scntfcNm', 'engNm'],
      descriptionKeys: ['content', 'description', 'summary'],
    },
    { preferJson: false },
  );

export const searchBaekduProtectedPlant = async (
  query: string,
): Promise<PublicPlantRecord | null> =>
  searchEndpoint(
    'baekduProtected',
    query,
    'baekduProtected',
    {
      searchWord: query,
      plantNm: query,
      keyword: query,
    },
    {
      nameKeys: ['krnm', 'plantNm', 'kornNm', 'koreanName', 'title', 'plantName'],
      scientificKeys: ['scnm', 'scntfcNm', 'scientificName', 'engNm'],
      descriptionKeys: ['fturCn', 'description', 'content', 'rmrkCn', 'habitat'],
    },
    { preferJson: true },
  );

export const searchSeedBookPlant = async (
  query: string,
): Promise<PublicPlantRecord | null> =>
  searchEndpoint(
    'seedBook',
    query,
    'seedBook',
    {
      searchWord: query,
      plantNm: query,
      keyword: query,
    },
    {
      nameKeys: ['plantNm', 'kornNm', 'koreanName', 'title'],
      scientificKeys: ['scntfcNm', 'scientificName', 'engNm'],
      descriptionKeys: ['description', 'content', 'germination', 'rmrkCn'],
    },
    { preferJson: true },
  );
