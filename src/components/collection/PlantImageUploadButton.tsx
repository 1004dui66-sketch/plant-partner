'use client';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useRef, useState, type ChangeEvent } from 'react';
import { useSupabaseUser } from '@/components/providers/SupabaseProvider';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { handleImageSubmit } from '@/lib/handlers/handle-image-submit';
import {
  ACCEPTED_IMAGE_INPUT,
  validateImageFile,
} from '@/lib/storage/camera';

type PlantImageUploadButtonProps = {
  readonly variant?: 'primary' | 'secondary';
  readonly label?: string;
  readonly icon?: string;
};

export const PlantImageUploadButton = ({
  variant = 'secondary',
  label = '갤러리 업로드',
  icon = 'photo_library',
}: PlantImageUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading: isAuthLoading } = useSupabaseUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !user) {
      return;
    }

    const mimeType = validateImageFile(file);
    if (!mimeType) {
      setError('5MB 이하의 JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await handleImageSubmit({
        file,
        userId: user.id,
        mimeType,
      });
    } catch (submitError) {
      if (isRedirectError(submitError)) {
        throw submitError;
      }

      setError(
        submitError instanceof Error
          ? submitError.message
          : '업로드에 실패했습니다.',
      );
      setIsSubmitting(false);
    }
  };

  const className =
    variant === 'primary'
      ? 'inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-md shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-60'
      : 'inline-flex items-center justify-center gap-2 glass-panel text-primary px-5 py-3 rounded-full font-label-md hover:bg-white/50 transition-colors disabled:opacity-60';

  return (
    <>
      <button
        type="button"
        aria-label={label}
        disabled={isAuthLoading || isSubmitting || !user}
        onClick={() => fileInputRef.current?.click()}
        className={className}
      >
        <MaterialIcon name={icon} filled={variant === 'primary'} />
        {isSubmitting ? '업로드 중...' : label}
      </button>
      {error ? (
        <p className="font-body-md text-error text-sm mt-2 w-full">{error}</p>
      ) : null}
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_INPUT}
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />
    </>
  );
};
