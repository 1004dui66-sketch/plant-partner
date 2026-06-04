import type { ReactNode } from 'react';

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export const GlassPanel = ({ children, className = '' }: GlassPanelProps) => (
  <div
    className={`glass-panel glass-ambient-shadow ${className}`}
  >
    {children}
  </div>
);
