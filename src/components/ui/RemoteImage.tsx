type RemoteImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

export const RemoteImage = ({
  src,
  alt,
  className = '',
  fill = false,
  priority = false,
}: RemoteImageProps) => {
  const classes = fill
    ? `absolute inset-0 w-full h-full object-cover ${className}`
    : className;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={classes}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};
