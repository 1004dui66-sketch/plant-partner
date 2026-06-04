'use client';

import { useActionState, useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import {
  updateProfile,
  type ProfileActionResult,
} from '@/lib/actions/profile';

type ProfileEditFormProps = {
  email: string;
  displayName: string;
  bio: string;
  careAlertsEnabled: boolean;
  plantCount: number;
};

const initialState: ProfileActionResult = {};

export const ProfileEditForm = ({
  email,
  displayName,
  bio,
  careAlertsEnabled,
  plantCount,
}: ProfileEditFormProps) => {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [alertsEnabled, setAlertsEnabled] = useState(careAlertsEnabled);

  return (
    <form action={formAction} className="relative z-10 w-full">
      <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4">
        <MaterialIcon name="person" className="text-4xl text-primary" />
      </div>

      <label className="block text-left mb-4">
        <span className="font-label-md text-label-md text-on-surface-variant mb-2 block">
          표시 이름
        </span>
        <input
          name="displayName"
          defaultValue={displayName}
          className="w-full glass-input rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface"
          required
        />
      </label>

      <p className="font-body-md text-on-surface-variant text-sm mb-4">{email}</p>

      <div className="inline-flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full text-secondary font-label-md text-label-md mb-4 border border-secondary/20">
        <MaterialIcon name="eco" className="text-sm" />
        {plantCount}개 식물 관리 중
      </div>

      <label className="block text-left mb-4">
        <span className="font-label-md text-label-md text-on-surface-variant mb-2 block">
          소개
        </span>
        <textarea
          name="bio"
          defaultValue={bio}
          rows={3}
          className="w-full glass-input rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface resize-none"
        />
      </label>

      <label className="flex items-center justify-between gap-4 mb-6 p-4 rounded-lg bg-surface/50 border border-outline-variant/30">
        <div className="text-left">
          <span className="font-body-lg text-body-lg font-semibold text-on-surface block">
            케어 알림
          </span>
          <span className="font-body-md text-body-md text-on-surface-variant text-sm">
            급수 및 비료 알림 푸시 설정
          </span>
        </div>
        <input type="hidden" name="careAlertsEnabled" value={alertsEnabled ? 'on' : 'off'} />
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            checked={alertsEnabled}
            className="sr-only peer"
            type="checkbox"
            onChange={() => setAlertsEnabled((value) => !value)}
          />
          <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-fixed rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>
      </label>

      {state.error ? (
        <p className="text-error text-sm mb-4">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-primary text-sm mb-4">프로필이 저장되었습니다.</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-on-primary font-label-md text-label-md py-3 rounded-full transition-colors"
      >
        {pending ? '저장 중...' : '프로필 저장'}
      </button>
    </form>
  );
};
