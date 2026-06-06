'use client';

import Image from 'next/image';
import { useActionState, useState } from 'react';
import { useUserDashboardContext } from '@/components/layout/UserDashboardProvider';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import {
  updateProfile,
  type ProfileActionResult,
} from '@/lib/actions/profile';

const PROFILE_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBPRigXgR8aes-DY0dxVQNR70orTT2E0wAmkp97jLpUwiH_hBND2rzF4dSElQIRZ1EgN5hELPppz-p8DCKQE44-sg19UOSdMbuntBQf7V-6LokzdgMP-986r8TcStAqTGwhM8-gsEbpASTMdh8KSkHqbfKicRJ21QJUHttm7RPf2qVhAhPF3fyd-nsjOnpcFF-zk7ZzcIuQS7zij27OAr12rVdvMg0QSLqvzFcpnbsP0NCLKiQLH6h1bjsPSBbwqsutN5nbMAavd8W9';

type ProfileEditFormProps = {
  email: string;
  displayName: string;
  bio: string;
  careAlertsEnabled: boolean;
};

const initialState: ProfileActionResult = {};

export const ProfileEditForm = ({
  email,
  displayName,
  bio,
  careAlertsEnabled,
}: ProfileEditFormProps) => {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const { caretakerLabel, activePlantCount } = useUserDashboardContext();

  if (!editing) {
    return (
      <div className="relative z-10 w-full">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-fixed blur-[40px] opacity-40 rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-fixed blur-[40px] opacity-40 rounded-full pointer-events-none" />

        <div className="relative inline-block mb-4 mx-auto">
          <Image
            alt={displayName}
            src={PROFILE_AVATAR}
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-md mx-auto"
          />
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="프로필 수정"
            className="absolute bottom-0 right-0 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-container transition-colors"
          >
            <MaterialIcon name="edit" className="text-sm" />
          </button>
        </div>

        <h2 className="font-headline-md text-headline-md text-primary mb-1">
          {displayName}
        </h2>
        <div className="inline-flex items-center gap-2 bg-secondary/10 px-3 py-1 rounded-full text-secondary font-label-md text-label-md mb-4 border border-secondary/20">
          <MaterialIcon name="eco" className="text-sm" />
          {caretakerLabel} · {activePlantCount}개 식물
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          {bio}
        </p>
        <p className="font-body-md text-on-surface-variant text-sm mb-6">{email}</p>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full py-3 px-6 bg-surface border border-outline-variant rounded-lg font-label-md text-label-md text-primary hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
        >
          <MaterialIcon name="person" />
          프로필 정보 수정
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative z-10 w-full text-left">
      <label className="block mb-4">
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

      <label className="block mb-4">
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

      <input type="hidden" name="careAlertsEnabled" value={careAlertsEnabled ? 'on' : 'off'} />

      {state.error ? (
        <p className="text-error text-sm mb-4">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-primary text-sm mb-4">프로필이 저장되었습니다.</p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="flex-1 py-3 rounded-full border border-outline-variant text-primary font-label-md"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-60 text-on-primary font-label-md text-label-md py-3 rounded-full transition-colors"
        >
          {pending ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  );
};
