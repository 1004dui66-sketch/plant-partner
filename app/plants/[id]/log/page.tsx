import { notFound, redirect } from 'next/navigation';
import { LogActivityForm } from '@/components/plants/LogActivityForm';
import { fetchPlantById } from '@/lib/repositories/plants';
import {
  createSupabaseServerClient,
  getSessionUser,
} from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LogActivityPage({ params }: PageProps) {
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

  return <LogActivityForm plantId={plant.id} plantName={plant.plant_name} />;
}
