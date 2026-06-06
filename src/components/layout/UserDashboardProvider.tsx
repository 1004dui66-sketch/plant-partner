'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  useUserDashboardStatus,
  type UseUserDashboardStatusResult,
} from '@/hooks/use-user-dashboard-status';

const UserDashboardContext = createContext<UseUserDashboardStatusResult | null>(
  null,
);

type UserDashboardProviderProps = {
  readonly children: ReactNode;
};

export const UserDashboardProvider = ({
  children,
}: UserDashboardProviderProps) => {
  const value = useUserDashboardStatus();

  return (
    <UserDashboardContext.Provider value={value}>
      {children}
    </UserDashboardContext.Provider>
  );
};

export const useUserDashboardContext = (): UseUserDashboardStatusResult => {
  const context = useContext(UserDashboardContext);

  if (!context) {
    throw new Error(
      'useUserDashboardContext는 UserDashboardProvider 내부에서 사용해야 합니다.',
    );
  }

  return context;
};
