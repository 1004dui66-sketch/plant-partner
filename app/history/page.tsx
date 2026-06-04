import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { groupHistoryBySection } from '@/lib/history';
import { fetchHistoryEntries } from '@/lib/repositories/growth-logs';
import {
  createSupabaseServerClient,
  getSessionUser,
} from '@/lib/supabase/server';
import { HistoryTimeline } from '@/components/history/HistoryTimeline';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  const entries = await fetchHistoryEntries(supabase, user.id);
  const sections = groupHistoryBySection(entries);

  return (
    <AppShell>
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-secondary-fixed/30 blur-[100px] opacity-60" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-fixed/20 blur-[120px] opacity-50" />
      </div>

      <main className="pt-24 pb-32 md:pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="mb-stack-lg">
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-stack-sm">
            케어 히스토리
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl">
            성장 가득 반려 식물들의 케어 기록입니다.
          </p>
        </div>

        {sections.length === 0 ? (
          <div className="glass-card p-12 text-center max-w-3xl">
            <MaterialIcon name="history" className="text-primary text-5xl mb-4" />
            <p className="font-body-md text-on-surface-variant">
              아직 활동 기록이 없습니다. 식물 상세에서 케어를 기록해 보세요.
            </p>
          </div>
        ) : (
          <HistoryTimeline sections={sections} />
        )}
      </main>
    </AppShell>
  );
}
