import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { formatDate } from '../../utils/dateUtils.ts';
import { createNotificationMessage } from '../../utils/notificationUtils.ts';
import { parseHM } from '../utils.ts';

const events: Event[] = [
  {
    id: '1',
    title: '점심 미팅',
    date: '2025-02-21',
    startTime: '12:30',
    endTime: '13:30',
    description: '점심 미팅 알림',
    location: '회의실',
    category: '미팅',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '오전 회의',
    date: '2025-02-21',
    startTime: '10:00',
    endTime: '11:00',
    description: '오전 회의 알림',
    location: '회의실',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
];

it('useNotifications 훅은 초기에 빈 알림 목록을 반환해야 한다', () => {
  const { result } = renderHook(() => useNotifications([]));
  expect(result.current.notifications).toEqual([]);
});

it('시간이 12:30일 떄 start time이 12:30인 이벤트에 대한 알림이 새롭게 생성되어 추가된다', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-02-21T12:29:00'));

  const { result } = renderHook(() => useNotifications(events));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  const expectedNotification = {
    id: events[0].id,
    message: createNotificationMessage(events[0]),
  };

  expect(result.current.notifications).toEqual([expectedNotification]);
});

it('알림 목록에서 index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const { result } = renderHook(() => useNotifications(events));
  const notifications = [
    {
      id: '1',
      message: '알림 메시지1',
    },
    {
      id: '2',
      message: '알림 메시지2',
    },
    {
      id: '3',
      message: '알림 메시지3',
    },
  ];

  act(() => {
    result.current.setNotifications(notifications);
  });

  act(() => {
    result.current.removeNotification(1);
  });

  expect(result.current.notifications).toEqual([
    {
      id: '1',
      message: '알림 메시지1',
    },
    {
      id: '3',
      message: '알림 메시지3',
    },
  ]);
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-02-21T12:29:00'));

  const { result } = renderHook(() => useNotifications(events));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications.length).toBe(1);
});
