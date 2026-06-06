type NotificationBadgeProps = {
  readonly count: number;
  readonly className?: string;
};

export const NotificationBadge = ({
  count,
  className = '',
}: NotificationBadgeProps) => {
  if (count <= 0) {
    return null;
  }

  const label = count > 9 ? '9+' : String(count);

  return (
    <span
      aria-label={`알림 ${label}건`}
      className={`min-w-[18px] h-[18px] px-1 rounded-full bg-error text-on-error text-[10px] font-bold leading-none flex items-center justify-center shadow-sm ${className}`}
    >
      {label}
    </span>
  );
};
