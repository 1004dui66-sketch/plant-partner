export const DEFAULT_WATERING_INTERVAL_DAYS = 7;

export type WateringReminderInput = {
  readonly plantId: string;
  readonly plantName: string;
  readonly nickname: string;
  readonly lastWateredAt: string | null;
};

export type WateringReminder = WateringReminderInput & {
  readonly daysSinceWater: number | null;
  readonly isOverdue: boolean;
};

export const daysSinceWatering = (
  lastWateredAt: string | null,
  nowMs = Date.now(),
): number | null => {
  if (!lastWateredAt) {
    return null;
  }

  return Math.floor(
    (nowMs - new Date(lastWateredAt).getTime()) / 86_400_000,
  );
};

export const isWateringOverdue = (
  lastWateredAt: string | null,
  intervalDays = DEFAULT_WATERING_INTERVAL_DAYS,
  nowMs = Date.now(),
): boolean => {
  if (!lastWateredAt) {
    return true;
  }

  const days = daysSinceWatering(lastWateredAt, nowMs);
  return days !== null && days >= intervalDays;
};

export const buildWateringReminder = (
  input: WateringReminderInput,
  intervalDays = DEFAULT_WATERING_INTERVAL_DAYS,
  nowMs = Date.now(),
): WateringReminder => ({
  ...input,
  daysSinceWater: daysSinceWatering(input.lastWateredAt, nowMs),
  isOverdue: isWateringOverdue(input.lastWateredAt, intervalDays, nowMs),
});

export const buildWateringReminders = (
  inputs: readonly WateringReminderInput[],
  intervalDays = DEFAULT_WATERING_INTERVAL_DAYS,
  nowMs = Date.now(),
): WateringReminder[] =>
  inputs.map((input) =>
    buildWateringReminder(input, intervalDays, nowMs),
  );

export const countOverdueWateringReminders = (
  reminders: readonly WateringReminder[],
): number => reminders.filter((reminder) => reminder.isOverdue).length;

export const overduePlantIdSet = (
  reminders: readonly WateringReminder[],
): ReadonlySet<string> =>
  new Set(
    reminders
      .filter((reminder) => reminder.isOverdue)
      .map((reminder) => reminder.plantId),
  );
