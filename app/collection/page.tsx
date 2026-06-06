import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { CollectionView } from '@/components/collection/CollectionView';
import { fetchPlantCards } from '@/lib/repositories/plants';
import {
  createSupabaseServerClient,
  getSessionUser,
} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function CollectionPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  const plants = await fetchPlantCards(supabase, user.id);

  return (
    <Suspense fallback={null}>
      <CollectionView plants={plants} />
    </Suspense>
  );
}
