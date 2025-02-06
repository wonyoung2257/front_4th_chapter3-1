import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const events: Event[] = [
  {
    id: '1',
    title: '회의',
    date: '2024-01-14',
    startTime: '10:00',
    endTime: '11:00',
    description: '회의 내용',
    location: '회의실',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '2',
    title: '점심',
    date: '2024-01-01',
    startTime: '12:00',
    endTime: '13:00',
    description: '점심 내용',
    location: '식당',
    category: '점심',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '3',
    title: '점심식사하기',
    date: '2024-01-01',
    startTime: '12:00',
    endTime: '13:00',
    description: ' 내용',
    location: '식당',
    category: '점심',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '4',
    title: '저녁',
    date: '2024-02-01',
    startTime: '18:00',
    endTime: '19:00',
    description: ' 내용',
    location: '식당',
    category: '저녁',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
];

it('검색어가 빈문자열("")일 때 month view에서 1월에 해당하는 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-01-01'), 'month'));
  expect(result.current.filteredEvents).toEqual([events[0], events[1], events[2]]);
});

it('검색어가 제목, 설명, 위치 중 하나에 부분적으로 일치하면 month view에서 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-01-01'), 'month'));
  act(() => {
    result.current.setSearchTerm('점심');
  });
  expect(result.current.filteredEvents).toEqual([events[1], events[2]]);
});

it('오늘이 2024-01-14이고 view가 week일 떄 2024-01-14~2024-01-20 범위에 해당하는 이벤트만 반환해야 한다', () => {
  // given
  const { result } = renderHook(() => useSearch(events, new Date('2024-01-14'), 'week'));

  // when
  act(() => {
    result.current.setSearchTerm('');
  });

  // then
  expect(result.current.filteredEvents).toEqual([events[0]]);
});

it('오늘이 2024-01-01이고 view가 month일 떄 2024-01-01~2024-01-31 월간 날짜 범위에 해당하는 이벤트만 반환해야 한다', () => {
  // given
  const { result } = renderHook(() => useSearch(events, new Date('2024-01-01'), 'month'));

  // when
  act(() => {
    result.current.setSearchTerm('');
  });

  // then
  expect(result.current.filteredEvents).toEqual([events[0], events[1], events[2]]);
});

it('searchTerm을 "회의"에서 "점심"으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date('2024-01-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([events[0]]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toEqual([events[1], events[2]]);
});
