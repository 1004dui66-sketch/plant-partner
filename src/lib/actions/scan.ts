'use server';

import { redirect } from 'next/navigation';
import { createAnalysisFromScan } from '@/lib/repositories/analyses';
import { assertAnalysisStoragePath } from '@/lib/storage/resolve-image-url';
import { createSupabaseServerClient, getSessionUser } from '@/lib/supabase/server';

export type ScanActionResult = {
  error?: string;
};

export const submitScanImage = async (
  storagePath: string,
): Promise<ScanActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  assertAnalysisStoragePath(user.id, storagePath);

  const supabase = await createSupabaseServerClient();
  const analysis = await createAnalysisFromScan(supabase, {
    userId: user.id,
    imageUrl: storagePath,
  });

  redirect(`/scan/result?id=${analysis.id}`);
};
