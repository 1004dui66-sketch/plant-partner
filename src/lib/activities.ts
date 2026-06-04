export const ACTIVITY_TYPES = [
  'water',
  'fertilize',
  'prune',
  'repot',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

type ActivityMeta = {
  icon: string;
  label: string;
  historyTitle: string;
};

export const ACTIVITY_META: Record<ActivityType, ActivityMeta> = {
  water: {
    icon: 'water_drop',
    label: '물 주기',
    historyTitle: '물 주기 완료',
  },
  fertilize: {
    icon: 'science',
    label: '영양제',
    historyTitle: '영양제 투여',
  },
  prune: {
    icon: 'content_cut',
    label: '가지치기',
    historyTitle: '가지치기 완료',
  },
  repot: {
    icon: 'home_work',
    label: '분갈이',
    historyTitle: '분갈이 완료',
  },
};

export const ACTIVITIES = ACTIVITY_TYPES.map((id) => ({
  id,
  icon: ACTIVITY_META[id].icon,
  label: ACTIVITY_META[id].label,
}));

export const isActivityType = (value: string): value is ActivityType =>
  (ACTIVITY_TYPES as readonly string[]).includes(value);

export const buildLogMemo = (
  activityType: ActivityType,
  notes: string,
): string => {
  const trimmed = notes.trim();
  return trimmed ? `[${activityType}] ${trimmed}` : `[${activityType}]`;
};

export const parseActivityTypeFromMemo = (memo: string | null): ActivityType => {
  if (!memo) return 'water';
  const match = memo.match(/^\[(\w+)\]/);
  if (match?.[1] && isActivityType(match[1])) {
    return match[1];
  }
  return 'water';
};

export const parseNotesFromMemo = (memo: string | null): string => {
  if (!memo) return '';
  return memo.replace(/^\[\w+\]\s?/, '');
};
