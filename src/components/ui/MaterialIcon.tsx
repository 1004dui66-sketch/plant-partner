import type { ReactNode } from 'react';

type MaterialIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

export const MaterialIcon = ({
  name,
  filled = false,
  className = '',
}: MaterialIconProps): ReactNode => (
  <span
    className={`material-symbols-outlined ${className}`}
    style={{
      fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
    }}
  >
    {name}
  </span>
);
