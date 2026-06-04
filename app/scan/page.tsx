import { redirect } from 'next/navigation';
import { ScanCamera } from '@/components/scan/ScanCamera';
import { getSessionUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ScanPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return <ScanCamera userId={user.id} />;
}
