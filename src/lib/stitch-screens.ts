/** Stitch export screen id → app route (from stitch_ai.zip) */
export type StitchScreenId =
  | 'plant_buddy_kr'
  | 'kr_1'
  | 'kr_2'
  | 'kr_3'
  | 'kr_4'
  | 'kr_5'
  | 'kr_6'
  | 'kr_7';

export type StitchScreenMeta = {
  readonly id: StitchScreenId;
  readonly title: string;
  readonly route: string;
};

export const STITCH_SCREENS: readonly StitchScreenMeta[] = [
  { id: 'plant_buddy_kr', title: '로그인', route: '/login' },
  { id: 'kr_1', title: 'AI Camera', route: '/scan' },
  { id: 'kr_2', title: 'My Plants', route: '/collection' },
  { id: 'kr_3', title: 'AI 식물 인식 결과', route: '/scan/result' },
  { id: 'kr_4', title: '식물 상세', route: '/plants/[id]' },
  { id: 'kr_5', title: '활동 기록', route: '/plants/[id]/log' },
  { id: 'kr_6', title: '케어 히스토리', route: '/history' },
  { id: 'kr_7', title: '설정', route: '/settings' },
] as const;

export const stitchRouteFor = (id: StitchScreenId): string =>
  STITCH_SCREENS.find((screen) => screen.id === id)?.route ?? '/';
