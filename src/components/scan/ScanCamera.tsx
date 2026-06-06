'use client';

import Link from 'next/link';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { submitScanImage } from '@/lib/actions/scan';
import {
  ACCEPTED_IMAGE_INPUT,
  type CameraFacingMode,
  captureVideoFrame,
  getCameraErrorMessage,
  normalizeCaptureMimeType,
  validateImageFile,
} from '@/lib/storage/camera';
import { uploadAnalysisImage } from '@/lib/storage/upload-client';

type ScanPhase = 'live' | 'preview' | 'uploading';

type ScanCameraProps = {
  userId: string;
};

export const ScanCamera = ({ userId }: ScanCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<ScanPhase>('live');
  const [facingMode, setFacingMode] = useState<CameraFacingMode>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewMimeType, setPreviewMimeType] = useState('image/jpeg');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progressLabel, setProgressLabel] = useState('식물을 프레임 안에 맞춰 주세요');
  const [flashOn, setFlashOn] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopStream();
    setCameraError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('이 브라우저에서는 카메라를 사용할 수 없습니다.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      setCameraError(getCameraErrorMessage(error));
    }
  }, [facingMode, stopStream]);

  useEffect(() => {
    if (phase !== 'live') {
      return;
    }

    void startCamera();

    return () => {
      stopStream();
    };
  }, [phase, startCamera, stopStream]);

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const resetPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setPreviewBlob(null);
    setUploadError(null);
    setProgressLabel('식물을 프레임 안에 맞춰 주세요');
    setPhase('live');
  }, [previewUrl]);

  const setPreviewFromBlob = useCallback(
    (blob: Blob, mimeType: string) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const normalizedMimeType = normalizeCaptureMimeType(mimeType);
      setPreviewBlob(blob);
      setPreviewMimeType(normalizedMimeType);
      setPreviewUrl(URL.createObjectURL(blob));
      setPhase('preview');
      stopStream();
    },
    [previewUrl, stopStream],
  );

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    try {
      const blob = await captureVideoFrame(
        video,
        normalizeCaptureMimeType('image/jpeg'),
      );
      setPreviewFromBlob(blob, 'image/jpeg');
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : '촬영에 실패했습니다.',
      );
    }
  };

  const handleGallerySelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const mimeType = validateImageFile(file);
    if (!mimeType) {
      setUploadError('5MB 이하의 JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.');
      return;
    }

    setPreviewFromBlob(file, mimeType);
  };

  const handleSubmit = async () => {
    if (!previewBlob) {
      return;
    }

    setPhase('uploading');
    setUploadError(null);
    setProgressLabel('이미지 업로드 중...');

    try {
      const storagePath = await uploadAnalysisImage({
        file: previewBlob,
        userId,
        mimeType: previewMimeType,
      });

      setProgressLabel('AI 분석 결과 저장 중...');
      await submitScanImage(storagePath);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      setUploadError(
        error instanceof Error ? error.message : '업로드에 실패했습니다.',
      );
      setPhase('preview');
    }
  };

  const toggleFacingMode = () => {
    setFacingMode((current) =>
      current === 'environment' ? 'user' : 'environment',
    );
  };

  const isUploading = phase === 'uploading';

  return (
    <div className="bg-black h-[100dvh] w-screen overflow-hidden relative font-body-md antialiased">
      <div className="absolute inset-0 z-0 bg-black">
        {phase === 'live' ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-primary-fixed/50 rounded-3xl relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary-fixed rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary-fixed rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary-fixed rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary-fixed rounded-br-xl" />
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-fixed shadow-[0_0_15px_rgba(176,240,214,0.8)] animate-scan pointer-events-none z-10" />
          </>
        ) : (
          previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="촬영 미리보기"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-0 pointer-events-none" />
      </div>

      <header className="absolute top-0 w-full z-20 flex justify-between items-center px-gutter py-6">
        <Link
          href="/collection"
          aria-label="카메라 닫기"
          className="w-12 h-12 rounded-full bg-surface/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-surface/30 transition-colors shadow-lg"
        >
          <MaterialIcon name="close" />
        </Link>
        {phase === 'live' ? (
          <button
            type="button"
            aria-label="플래시"
            onClick={() => setFlashOn((value) => !value)}
            disabled={isUploading}
            className="w-12 h-12 rounded-full bg-surface/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-surface/30 transition-colors shadow-lg disabled:opacity-50"
          >
            <MaterialIcon name={flashOn ? 'flash_off' : 'flash_on'} />
          </button>
        ) : (
          <div className="w-12 h-12" />
        )}
      </header>

      {cameraError && phase === 'live' ? (
        <div className="absolute top-24 left-0 right-0 z-20 px-gutter">
          <p className="glass-panel rounded-xl p-4 text-on-surface text-sm text-center">
            {cameraError}
          </p>
        </div>
      ) : null}

      <div
        className={`absolute bottom-40 w-full z-10 flex justify-center items-center gap-8 px-8 transition-all duration-500 ${
          isUploading ? 'opacity-50 blur-sm pointer-events-none' : ''
        }`}
      >
          <button
            type="button"
            aria-label="갤러리에서 선택"
            onClick={() => fileInputRef.current?.click()}
            className="w-14 h-14 rounded-full bg-surface/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-surface/30 transition-colors"
          >
            <MaterialIcon name="photo_library" />
          </button>

          {phase === 'live' ? (
            <button
              type="button"
              aria-label="촬영"
              onClick={() => void handleCapture()}
              className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center p-1 hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-white rounded-full" />
            </button>
          ) : (
            <button
              type="button"
              aria-label="분석 시작"
              onClick={() => void handleSubmit()}
              className="w-20 h-20 rounded-full border-4 border-primary-fixed flex items-center justify-center bg-primary hover:bg-primary-container transition-colors"
            >
              <MaterialIcon name="check" filled className="text-on-primary text-3xl" />
            </button>
          )}

          <button
            type="button"
            aria-label="다시 촬영"
            onClick={phase === 'preview' ? resetPreview : toggleFacingMode}
            className="w-14 h-14 rounded-full bg-surface/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-surface/30 transition-colors"
          >
          <MaterialIcon name={phase === 'preview' ? 'refresh' : 'cameraswitch'} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_INPUT}
        className="hidden"
        onChange={(event) => void handleGallerySelect(event)}
      />

      <div className="absolute bottom-0 left-0 w-full z-30 px-margin-mobile md:px-margin-desktop pb-margin-mobile flex justify-center">
        <div className="w-full max-w-[600px] bg-surface/80 backdrop-blur-2xl rounded-xl border border-white/40 shadow-[0_-10px_40px_rgba(0,53,39,0.2)] p-8 flex flex-col gap-stack-md">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="font-headline-md text-headline-md text-primary">
                {isUploading ? '분석 중...' : phase === 'preview' ? '미리보기' : '식물 스캔'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                {isUploading
                  ? '식물을 구조하고 있습니다'
                  : progressLabel}
              </p>
            </div>
            <div
              className={`w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center shadow-inner border border-white/50 ${
                isUploading ? 'animate-pulse' : ''
              }`}
            >
              <MaterialIcon
                name="psychology"
                filled
                className="text-on-secondary-container"
              />
            </div>
          </div>

          {isUploading ? (
            <>
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-primary rounded-full animate-progress relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-fixed-dim/20 border border-primary/20 shadow-sm backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-label-md text-label-md text-primary tracking-wide">
                    종 분석 중...
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-variant/50 border border-outline-variant/30 text-on-surface-variant">
                  <MaterialIcon name="water_drop" className="text-[16px]" />
                  <span className="font-label-md text-label-md">
                    건강 상태 해석 중...
                  </span>
                </div>
              </div>
            </>
          ) : null}

          {uploadError ? (
            <p className="text-error text-sm font-body-md">{uploadError}</p>
          ) : null}

          {phase === 'preview' && !isUploading ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetPreview}
                className="flex-1 py-3 rounded-full border border-outline-variant text-primary font-label-md"
              >
                다시 촬영
              </button>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                className="flex-1 py-3 rounded-full bg-primary text-on-primary font-label-md"
              >
                분석 시작
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
