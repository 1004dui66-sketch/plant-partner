import { MaterialIcon } from '@/components/ui/MaterialIcon';
import type { CareGauge } from '@/lib/plant-care-metrics';

const RING_PATH =
  'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

type PlantStatusGaugesProps = {
  gauges: readonly CareGauge[];
};

const RingGauge = ({ gauge }: { gauge: CareGauge }) => (
  <div className="glass-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3">
      <svg className="w-full h-full circular-progress" viewBox="0 0 36 36">
        <path
          className="text-surface-container-high"
          d={RING_PATH}
          fill="none"
          stroke="currentColor"
          strokeDasharray="100, 100"
          strokeWidth={3}
        />
        <path
          className={gauge.strokeClass}
          d={RING_PATH}
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${gauge.percent}, 100`}
          strokeLinecap="round"
          strokeWidth={3}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center ${gauge.strokeClass}`}
      >
        <MaterialIcon name={gauge.icon} filled className="text-[28px]" />
      </div>
    </div>
    <span className="font-label-md text-label-md text-on-surface-variant mb-1">
      {gauge.label}
    </span>
    <span className="font-body-md text-body-md font-semibold text-primary">
      {gauge.valueLabel}
    </span>
  </div>
);

export const PlantStatusGauges = ({ gauges }: PlantStatusGaugesProps) => (
  <section>
    <h2 className="font-headline-md text-[24px] font-semibold text-primary mb-stack-sm">
      현재 상태
    </h2>
    <div className="grid grid-cols-3 gap-unit md:gap-gutter">
      {gauges.map((gauge) => (
        <RingGauge key={gauge.id} gauge={gauge} />
      ))}
    </div>
  </section>
);
