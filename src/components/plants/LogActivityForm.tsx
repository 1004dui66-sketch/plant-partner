'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { ACTIVITIES } from '@/lib/activities';
import {
  saveGrowthLog,
  type LogActionResult,
} from '@/lib/actions/growth-logs';

type LogActivityFormProps = {
  plantId: string;
  plantName: string;
};

const formatToday = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const initialState: LogActionResult = {};

export const LogActivityForm = ({
  plantId,
  plantName,
}: LogActivityFormProps) => {
  const [selected, setSelected] = useState<string>('water');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [state, formAction, pending] = useActionState(
    saveGrowthLog,
    initialState,
  );

  useEffect(() => {
    setDate(formatToday());
  }, []);

  return (
    <div className="min-h-screen text-on-surface antialiased flex items-center justify-center p-4 bg-background">
      <main className="w-full max-w-2xl mx-auto z-10 relative">
        <div className="glass-panel rounded-xl p-8 md:p-12">
          <header className="flex items-center justify-between mb-stack-lg">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
                활동 기록
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant flex items-center gap-2">
                <MaterialIcon name="potted_plant" filled className="text-primary" />
                {plantName}
              </p>
            </div>
            <Link
              href={`/plants/${plantId}`}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-surface/50 hover:bg-surface transition-colors border border-outline-variant/30 text-on-surface-variant"
            >
              <MaterialIcon name="close" />
            </Link>
          </header>

          <form action={formAction} className="space-y-stack-md">
            <input type="hidden" name="plantId" value={plantId} />
            <input type="hidden" name="activityType" value={selected} />

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-stack-sm uppercase">
                활동 유형
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ACTIVITIES.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => setSelected(activity.id)}
                    className={`activity-btn flex flex-col items-center justify-center p-4 rounded-lg bg-surface/50 border border-outline-variant/50 hover:bg-surface transition-all duration-200 gap-2 ${
                      selected === activity.id ? 'selected' : ''
                    }`}
                  >
                    <MaterialIcon
                      name={activity.icon}
                      filled={selected === activity.id}
                      className="text-3xl"
                    />
                    <span className="font-label-md text-label-md">
                      {activity.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-stack-sm uppercase"
                  htmlFor="date"
                >
                  날짜
                </label>
                <input
                  className="w-full glass-input rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface"
                  id="date"
                  name="date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block font-label-md text-label-md text-on-surface mb-stack-sm uppercase"
                  htmlFor="time"
                >
                  시간
                </label>
                <input
                  className="w-full glass-input rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface"
                  id="time"
                  name="time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block font-label-md text-label-md text-on-surface mb-stack-sm uppercase"
                htmlFor="notes"
              >
                메모 (선택 사항)
              </label>
              <textarea
                className="w-full glass-input rounded-lg py-3 px-4 font-body-md text-body-md text-on-surface placeholder:text-outline resize-none"
                id="notes"
                name="notes"
                placeholder="식물의 상태는 어떤가요? 새로운 성장이 보이나요?"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>

            {state.error ? (
              <p className="text-error text-sm">{state.error}</p>
            ) : null}

            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="w-full bg-primary text-on-primary font-label-md text-label-md uppercase tracking-wider py-4 rounded-full hover:bg-primary-container transition-colors duration-300 shadow-md disabled:opacity-60"
              >
                {pending ? '저장 중...' : '기록 저장'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
