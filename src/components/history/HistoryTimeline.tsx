import Image from 'next/image';
import type { HistorySection } from '@/lib/history';
import { MaterialIcon } from '@/components/ui/MaterialIcon';

type HistoryTimelineProps = {
  sections: HistorySection[];
};

export const HistoryTimeline = ({ sections }: HistoryTimelineProps) => (
  <div className="relative max-w-3xl">
    <div className="absolute left-6 top-10 bottom-10 w-px bg-outline-variant/50 z-0" />

    {sections.map((section) => (
      <div key={section.label} className="mb-stack-lg relative z-10">
        <h2 className="font-headline-md text-primary mb-stack-md flex items-center gap-4">
          <span className="bg-surface px-4 py-1 rounded-full border border-white/30 shadow-sm text-sm font-label-md tracking-wider text-secondary">
            {section.label}
          </span>
        </h2>

        <div className="flex flex-col gap-stack-sm ml-2">
          {section.entries.map((entry) => (
            <div key={entry.id} className="flex gap-6 items-start group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 relative z-10 ${
                  entry.highlight
                    ? 'bg-primary-fixed/20 border border-primary-fixed/50 shadow-[0_0_15px_rgba(176,240,214,0.4)]'
                    : 'bg-surface-variant border border-white/50'
                }`}
              >
                <MaterialIcon
                  name={entry.icon}
                  filled={entry.iconFilled}
                  className={`text-[20px] ${entry.highlight ? 'text-primary' : 'text-secondary'}`}
                />
              </div>

              <div className="glass-card flex-1 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-[0_15px_40px_rgba(0,53,39,0.08)] transition-all duration-300 transform group-hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-white/30 flex-shrink-0">
                    <Image
                      alt={entry.plantName}
                      src={entry.imageUrl}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-label-md text-on-surface text-base">
                      {entry.title}
                    </h3>
                    <p className="font-body-md text-on-surface-variant">
                      {entry.plantName}{' '}
                      <span className="mx-1 opacity-50">•</span>{' '}
                      {entry.location}
                    </p>
                    {entry.memo ? (
                      <p className="font-body-md text-on-surface-variant text-sm mt-1 line-clamp-2">
                        {entry.memo}
                      </p>
                    ) : null}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-label-md uppercase tracking-wider ${
                    entry.highlight
                      ? 'bg-secondary-fixed/30 text-primary'
                      : 'bg-surface-variant/50 text-on-surface-variant'
                  }`}
                >
                  {entry.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
