import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { CollectionSearchBar } from './CollectionSearchBar';

describe('CollectionSearchBar', () => {
  afterEach(() => {
    cleanup();
  });
  it('검색어와 필터 칩을 렌더링한다', () => {
    render(
      <CollectionSearchBar
        query="몬스"
        activeFilter="전체"
        onQueryChange={vi.fn()}
        onFilterChange={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText('내 컬렉션에서 검색...')).toHaveProperty(
      'value',
      '몬스',
    );
    expect(screen.getByRole('button', { name: '전체' })).toBeTruthy();
  });

  it('필터 클릭 시 onFilterChange를 호출한다', () => {
    const onFilterChange = vi.fn();
    render(
      <CollectionSearchBar
        query=""
        activeFilter="전체"
        onQueryChange={vi.fn()}
        onFilterChange={onFilterChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '실내' }));
    expect(onFilterChange).toHaveBeenCalledWith('실내');
  });
});
