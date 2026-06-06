import { redirect } from 'next/navigation';
import { SettingsView } from '@/components/settings/SettingsView';
import {
  createSupabaseServerClient,
  getSessionUser,
} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <SettingsView
      email={user.email ?? ''}
      displayName={profile?.display_name ?? '초보 식물 집사'}
      bio={
        profile?.bio ??
        '실내 정원과 지속 가능한 식물 케어에 열정을 가지고 있습니다.'
      }
      careAlertsEnabled={profile?.care_alerts_enabled ?? true}
    />
  );
}
