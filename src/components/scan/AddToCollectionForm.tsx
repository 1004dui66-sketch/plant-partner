'use client';

import { useActionState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import {
  addScanResultToCollection,
  type PlantActionResult,
} from '@/lib/actions/plants';

type AddToCollectionFormProps = {
  analysisId: string;
};

const initialState: PlantActionResult = {};

export const AddToCollectionForm = ({
  analysisId,
}: AddToCollectionFormProps) => {
  const [state, formAction, pending] = useActionState(
    addScanResultToCollection,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 flex-1 w-full sm:flex-row sm:items-end">
      <input type="hidden" name="analysisId" value={analysisId} />
      <input
        name="nickname"
        placeholder="별칭 (예: 거실 구석)"
        className="w-full sm:flex-1 glass-input rounded-full py-3 px-5 font-body-md text-body-md text-on-surface placeholder:text-outline"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-on-primary font-label-md text-label-md px-8 py-4 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center space-x-2 w-full sm:w-auto shrink-0"
      >
        <MaterialIcon name="add" filled />
        <span>{pending ? '추가 중...' : '내 컬렉션에 추가'}</span>
      </button>
      {state.error ? (
        <p className="text-error text-sm w-full">{state.error}</p>
      ) : null}
    </form>
  );
};
