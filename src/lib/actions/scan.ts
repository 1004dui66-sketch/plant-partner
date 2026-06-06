'use server';

import { redirect } from 'next/navigation';
import { processPlantImageUpload } from '@/lib/handlers/process-plant-image-upload';
import { createSupabaseServerClient, getSessionUser } from '@/lib/supabase/server';

export type ScanActionResult = {
  error?: string;
};

/** 업로드된 이미지 Public URL로 AI 진단 후 analyses에 저장 */
export const submitScanImage = async (imageRef: string): Promise<ScanActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  const { analysis } = await processPlantImageUpload(supabase, {
    userId: user.id,
    imageRef,
  });

  redirect(`/scan/result?id=${analysis.id}`);
};

export type AddPlantFromUploadInput = {
  imageRef: string;
  nickname?: string;
};

/** Public URL로 AI 진단 후 analyses·plants에 저장 */
export const submitPlantImageWithCollection = async ({
  imageRef,
  nickname,
}: AddPlantFromUploadInput): Promise<ScanActionResult> => {
  const user = await getSessionUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { plant } = await processPlantImageUpload(supabase, {
      userId: user.id,
      imageRef,
      nickname,
      addToCollection: true,
    });

    if (!plant) {
      return { error: '식물을 저장하지 못했습니다.' };
    }

    redirect(`/plants/${plant.id}`);
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : '업로드 처리에 실패했습니다.',
    };
  }
};
