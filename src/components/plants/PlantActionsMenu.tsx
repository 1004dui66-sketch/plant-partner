'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import {
  deletePlant,
  updatePlantDetails,
  type PlantActionResult,
} from '@/lib/actions/plants';

type PlantActionsMenuProps = {
  plantId: string;
  nickname: string | null;
};

const initialState: PlantActionResult = {};

export const PlantActionsMenu = ({
  plantId,
  nickname,
}: PlantActionsMenuProps) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [updateState, updateAction, updatePending] = useActionState(
    updatePlantDetails,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deletePlant,
    initialState,
  );

  useEffect(() => {
    if (!updateState.success) {
      return;
    }

    setEditing(false);
    setOpen(false);
  }, [updateState.success]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="식물 메뉴"
        onClick={() => setOpen((value) => !value)}
        className="text-primary hover:bg-primary-container/20 p-2 rounded-full transition-colors"
      >
        <MaterialIcon name="more_vert" />
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 min-w-56 glass-panel rounded-xl border border-white/30 shadow-lg overflow-hidden">
          {editing ? (
            <form action={updateAction} className="p-4 space-y-3">
              <input type="hidden" name="plantId" value={plantId} />
              <label className="block">
                <span className="font-label-md text-label-md text-on-surface-variant mb-2 block">
                  별칭
                </span>
                <input
                  name="nickname"
                  defaultValue={nickname ?? ''}
                  placeholder="예: 거실 구석"
                  className="w-full glass-input rounded-lg py-2 px-3 font-body-md text-body-md"
                />
              </label>
              {updateState.error ? (
                <p className="text-error text-sm">{updateState.error}</p>
              ) : null}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2 rounded-full border border-outline-variant text-on-surface-variant"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={updatePending}
                  className="flex-1 py-2 rounded-full bg-primary text-on-primary disabled:opacity-60"
                >
                  {updatePending ? '저장 중...' : '저장'}
                </button>
              </div>
            </form>
          ) : (
            <div className="py-2">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="w-full px-4 py-3 text-left hover:bg-surface/50 flex items-center gap-3"
              >
                <MaterialIcon name="edit" className="text-primary" />
                <span className="font-body-md">별칭 수정</span>
              </button>

              <form action={deleteAction}>
                <input type="hidden" name="plantId" value={plantId} />
                <button
                  type="submit"
                  disabled={deletePending}
                  onClick={(event) => {
                    if (
                      !window.confirm('이 식물을 컬렉션에서 삭제할까요?')
                    ) {
                      event.preventDefault();
                      return;
                    }

                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-error-container/20 flex items-center gap-3 text-error disabled:opacity-60"
                >
                  <MaterialIcon name="delete" />
                  <span className="font-body-md">
                    {deletePending ? '삭제 중...' : '식물 삭제'}
                  </span>
                </button>
                {deleteState.error ? (
                  <p className="px-4 pb-2 text-error text-sm">{deleteState.error}</p>
                ) : null}
              </form>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
