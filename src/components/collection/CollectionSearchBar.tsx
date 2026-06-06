'use client';

import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { PLANT_FILTERS, type PlantFilter } from '@/lib/plants';

type CollectionSearchBarProps = {
  readonly query: string;
  readonly activeFilter: PlantFilter;
  readonly onQueryChange: (value: string) => void;
  readonly onFilterChange: (filter: PlantFilter) => void;
};

export const CollectionSearchBar = ({
  query,
  activeFilter,
  onQueryChange,
  onFilterChange,
}: CollectionSearchBarProps) => (
  <section className="mb-stack-md relative z-10">
    <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-[0_10px_30px_rgba(0,53,39,0.05)]">
      <div className="relative w-full md:w-1/2">
        <MaterialIcon
          name="search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-outline"
        />
        <input
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-body-md font-body-md text-on-surface placeholder:text-outline outline-none transition-all"
          placeholder="내 컬렉션에서 검색..."
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>
      <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
        {PLANT_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${
              activeFilter === filter
                ? 'bg-primary text-on-primary'
                : 'glass-panel text-on-surface-variant hover:text-primary hover:bg-primary/5'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  </section>
);
