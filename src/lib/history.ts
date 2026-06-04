export type HistoryEntry = {
  id: string;
  section: string;
  icon: string;
  iconFilled?: boolean;
  title: string;
  plantName: string;
  location: string;
  memo: string | null;
  time: string;
  imageUrl: string;
  highlight?: boolean;
};

export type HistorySection = {
  label: string;
  entries: HistoryEntry[];
};

export const groupHistoryBySection = (
  entries: readonly HistoryEntry[],
): HistorySection[] => {
  const sections = new Map<string, HistoryEntry[]>();

  for (const entry of entries) {
    const existing = sections.get(entry.section) ?? [];
    sections.set(entry.section, [...existing, entry]);
  }

  return [...sections.entries()].map(([label, sectionEntries]) => ({
    label,
    entries: sectionEntries,
  }));
};
