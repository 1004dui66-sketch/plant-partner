'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  useWateringReminders,
  type UseWateringRemindersResult,
} from '@/hooks/use-watering-reminders';

const WateringRemindersContext =
  createContext<UseWateringRemindersResult | null>(null);

type WateringRemindersProviderProps = {
  readonly children: ReactNode;
};

export const WateringRemindersProvider = ({
  children,
}: WateringRemindersProviderProps) => {
  const value = useWateringReminders();

  return (
    <WateringRemindersContext.Provider value={value}>
      {children}
    </WateringRemindersContext.Provider>
  );
};

export const useWateringRemindersContext = (): UseWateringRemindersResult => {
  const context = useContext(WateringRemindersContext);

  if (!context) {
    throw new Error(
      'useWateringRemindersContext는 WateringRemindersProvider 내부에서 사용해야 합니다.',
    );
  }

  return context;
};
