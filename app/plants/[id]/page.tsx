import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { RemoteImage } from '@/components/ui/RemoteImage';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { PlantActionsMenu } from '@/components/plants/PlantActionsMenu';
import { BotanicalMarker } from '@/components/plants/BotanicalMarker';
import { PlantStatusGauges } from '@/components/plants/PlantStatusGauges';
import {
  ACTIVITY_META,
  isActivityType,
  parseNotesFromMemo,
} from '@/lib/activities';
import {
  computePlantStatus,
} from '@/lib/repositories/plants';
import {
  daysSinceWaterFromLogs,
  deriveCareGauges,
} from '@/lib/plant-care-metrics';
import { DEFAULT_PLANT_IMAGE } from '@/lib/constants';
import { fetchPlantGrowthLogs } from '@/lib/repositories/growth-logs';
import {
  fetchLatestAnalysis,
  fetchPlantById,
} from '@/lib/repositories/plants';
import { resolveImageUrl } from '@/lib/storage/resolve-image-url';
import {
  createSupabaseServerClient,
  getSessionUser,
} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

const formatRelativeDays = (dateStr: string): string => {
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000,
  );
  if (days === 0) return '오늘';
  if (days === 1) return '1일 전';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
};

const timelineStyles = [
  'bg-secondary-container text-on-secondary-container',
  'bg-surface-variant text-on-surface-variant',
  'bg-tertiary-fixed text-on-tertiary-fixed',
] as const;

export default async function PlantDetailPage({ params }: PageProps) {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const plant = await fetchPlantById(supabase, user.id, id);

  if (!plant) {
    notFound();
  }

  const [logs, analysis] = await Promise.all([
    fetchPlantGrowthLogs(supabase, plant.id),
    fetchLatestAnalysis(supabase, user.id, plant.id),
  ]);

  const imageUrl = await resolveImageUrl(supabase, plant.image_url);

  const waterDates = logs
    .filter((log) => log.activity_type === 'water')
    .map((log) => log.created_at);
  const daysSinceWater = daysSinceWaterFromLogs(waterDates);
  const { status: plantStatus } = computePlantStatus(
    waterDates[0] ?? null,
  );
  const careGauges = deriveCareGauges({
    daysSinceWater,
    plantStatus,
    healthStatus: analysis?.health_status ?? null,
  });

  return (
    <AppShell>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-16 glass-panel md:hidden">
        <Link
          href="/collection"
          className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors"
        >
          <MaterialIcon name="arrow_back" />
        </Link>
        <h1 className="font-headline-md text-[20px] font-semibold text-primary">
          {plant.plant_name}
        </h1>
        <PlantActionsMenu plantId={plant.id} nickname={plant.nickname} />
      </header>

      <main className="w-full max-w-container-max mx-auto md:pt-24 pt-16 md:px-margin-desktop md:pb-12 pb-24">
        <section className="relative w-full h-[397px] md:h-[530px] md:rounded-xl overflow-hidden mb-stack-lg">
          <RemoteImage
            alt={plant.plant_name}
            src={imageUrl}
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <BotanicalMarker />
          <div className="absolute bottom-0 left-0 w-full p-gutter md:p-stack-md text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary-fixed/20 backdrop-blur-md text-primary-fixed border border-primary-fixed/30 px-3 py-1 rounded-full font-label-md text-label-md">
                {plant.category}
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg mb-1 drop-shadow-md">
              {plant.plant_name.split(' ')[0]}
            </h1>
            <p className="font-body-lg text-body-lg text-white/90">
              {plant.scientific_name ?? plant.plant_name} •{' '}
              {plant.nickname ?? '위치 미설정'}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-0">
          <div className="md:col-span-8 flex flex-col gap-stack-lg">
            <PlantStatusGauges gauges={careGauges} />
            <section>
              <div className="flex justify-between items-end mb-stack-sm">
                <h2 className="font-headline-md text-[24px] font-semibold text-primary">
                  케어 타임라인
                </h2>
                <Link
                  href="/history"
                  className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
                >
                  전체 보기
                </Link>
              </div>
              <div className="glass-card rounded-xl p-8 relative">
                {logs.length === 0 ? (
                  <p className="font-body-md text-on-surface-variant">
                    아직 기록된 활동이 없습니다.
                  </p>
                ) : (
                  <>
                    <div className="absolute left-[47px] top-[40px] bottom-[40px] w-px bg-outline-variant" />
                    <div className="flex flex-col gap-6">
                      {logs.map((log, index) => {
                        const activityType = isActivityType(log.activity_type)
                          ? log.activity_type
                          : 'water';
                        const meta = ACTIVITY_META[activityType];
                        const notes = parseNotesFromMemo(log.memo);

                        return (
                          <div key={log.id} className="flex gap-4 relative z-10">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border-2 border-white shadow-sm ${timelineStyles[index % timelineStyles.length]}`}
                            >
                              <MaterialIcon
                                name={meta.icon}
                                className="text-[16px]"
                              />
                            </div>
                            <div>
                              <h3 className="font-body-md text-body-md font-semibold text-primary">
                                {meta.historyTitle}
                              </h3>
                              <p className="font-body-md text-body-md text-on-surface-variant">
                                {formatRelativeDays(log.created_at)}
                                {notes ? ` • ${notes}` : ''}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>

          <div className="md:col-span-4 flex flex-col gap-stack-lg">
            <section className="glass-card rounded-xl p-8 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <MaterialIcon name="psychology" filled className="text-white" />
                </div>
                <h2 className="font-headline-md text-[20px] font-semibold text-primary">
                  AI 진단
                </h2>
              </div>
              <div className="relative z-10">
                {analysis ? (
                  <>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                      {analysis.diagnosis}
                    </p>
                    <div className="bg-surface/50 rounded-lg p-4 border border-outline-variant/30 mb-6">
                      <h4 className="font-label-md text-label-md text-primary mb-2">
                        권장 사항
                      </h4>
                      <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                        {analysis.recommendation}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="font-body-md text-on-surface-variant mb-6">
                    아직 AI 분석 기록이 없습니다.
                  </p>
                )}
                <Link
                  href="/scan"
                  className="w-full bg-primary hover:bg-primary-container text-white font-label-md text-label-md py-3 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md shadow-primary/20"
                >
                  <MaterialIcon name="auto_awesome" />
                  새로운 인식 분석 실행
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Link
        href={`/plants/${plant.id}/log`}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-secondary hover:bg-on-secondary-container text-white rounded-full shadow-lg flex items-center justify-center z-[55] transition-transform hover:scale-105"
      >
        <MaterialIcon name="add" filled />
      </Link>
    </AppShell>
  );
}
