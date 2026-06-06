import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlantCard } from './PlantCard';
import type { PlantCardData } from '@/lib/mock-plants';

vi.mock('next/image', () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const samplePlant: PlantCardData = {
  id: 'plant-1',
  plantName: 'Monstera Deliciosa',
  nickname: '거실 구석',
  imageUrl: 'https://example.com/plant.jpg',
  category: '실내',
  status: 'needs-water',
  statusLabel: '물 필요',
  lastWatered: '12일 전',
};

describe('PlantCard', () => {
  it('Stitch kr_2 카드 정보를 렌더링한다', () => {
    render(<PlantCard plant={samplePlant} />);

    expect(screen.getByText('Monstera Deliciosa')).toBeTruthy();
    expect(screen.getByText('거실 구석')).toBeTruthy();
    expect(screen.getByText('물 필요')).toBeTruthy();
    expect(screen.getByText('마지막 물 주기: 12일 전')).toBeTruthy();
  });
});
