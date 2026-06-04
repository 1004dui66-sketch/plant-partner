'use client';

import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { signOut } from '@/lib/actions/auth';

export const LogoutButton = () => (
  <form action={signOut}>
    <button
      type="submit"
      className="flex items-center gap-4 p-4 rounded-lg hover:bg-error-container/50 text-error transition-colors w-full group"
    >
      <div className="w-10 h-10 rounded-full bg-error-container/30 flex items-center justify-center group-hover:bg-error-container">
        <MaterialIcon name="logout" />
      </div>
      <h3 className="font-body-lg text-body-lg font-semibold">로그아웃</h3>
    </button>
  </form>
);
