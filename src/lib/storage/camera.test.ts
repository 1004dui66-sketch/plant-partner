import { describe, expect, it } from 'vitest';
import {
  buildAnalysisFileName,
  getExtensionForMimeType,
  normalizeCaptureMimeType,
  validateImageBlob,
  validateImageFile,
} from './camera';

describe('camera helpers', () => {
  it('MIME 타입별 확장자를 반환한다', () => {
    expect(getExtensionForMimeType('image/jpeg')).toBe('jpg');
    expect(getExtensionForMimeType('image/png')).toBe('png');
  });

  it('분석 파일명을 생성한다', () => {
    expect(buildAnalysisFileName('image/jpeg', 'test-id')).toBe('test-id.jpg');
  });

  it('허용되지 않은 MIME 타입을 거부한다', () => {
    const blob = new Blob(['x'], { type: 'application/pdf' });
    expect(validateImageBlob(blob, 'application/pdf')).toBeNull();
  });

  it('허용된 파일만 통과시킨다', () => {
    const file = new File(['x'], 'plant.jpg', { type: 'image/jpeg' });
    expect(validateImageFile(file)).toBe('image/jpeg');
  });

  it('알 수 없는 MIME 타입은 jpeg로 정규화한다', () => {
    expect(normalizeCaptureMimeType(undefined)).toBe('image/jpeg');
    expect(normalizeCaptureMimeType('image/png')).toBe('image/png');
  });
});
