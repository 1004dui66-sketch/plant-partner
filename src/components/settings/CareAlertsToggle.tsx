'use client';

import { useActionState, useState } from 'react';
import {
  updateProfile,
  type ProfileActionResult,
} from '@/lib/actions/profile';

type CareAlertsToggleProps = {
  displayName: string;
  bio: string;
  initialEnabled: boolean;
};

const initialState: ProfileActionResult = {};

export const CareAlertsToggle = ({
  displayName,
  bio,
  initialEnabled,
}: CareAlertsToggleProps) => {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [, formAction, pending] = useActionState(updateProfile, initialState);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    const formData = new FormData();
    formData.set('displayName', displayName);
    formData.set('bio', bio);
    formData.set('careAlertsEnabled', next ? 'on' : 'off');
    formAction(formData);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        checked={enabled}
        className="sr-only peer"
        type="checkbox"
        disabled={pending}
        onChange={handleToggle}
      />
      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-fixed rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
    </label>
  );
};
