import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const events: Event[] = [
  {
    id: '1',
    title: 'Event 1',
    date: '2024-07-01',
    startTime: '10:00',
    notificationTime: 10,
    endTime: '11:00',
    description: 'Event 1 description',
    location: 'Event 1 location',
    category: 'Event 1 category',
    repeat: { type: 'none', interval: 0 },
  },
  {
    id: '2',
    title: 'Event 2',
    date: '2024-07-02',
    startTime: '11:00',
    notificationTime: 10,
    endTime: '12:00',
    description: 'Event 2 description',
    location: 'Event 2 location',
    category: 'Event 2 category',
    repeat: { type: 'none', interval: 0 },
  },
  {
    id: '3',
    title: 'Event 3',
    date: '2024-07-03',
    startTime: '12:00',
    notificationTime: 10,
    endTime: '13:00',
    description: 'Event 3 description',
    location: 'Event 3 location',
    category: 'Event 3 category',
    repeat: { type: 'none', interval: 0 },
  },
];

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-07-01T10:00');
    const result = getUpcomingEvents(events, now, []);
    expect(result).toEqual([events[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-07-01T10:00');
    const result = getUpcomingEvents(events, now, ['1']);
    expect(result).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T10:59');
    const result = getUpcomingEvents(events, now, []);
    expect(result).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T11:00');
    const result = getUpcomingEvents(events, now, []);
    expect(result).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event = events[0];
    const result = createNotificationMessage(event);
    expect(result).toBe(`${event.notificationTime}분 후 ${event.title} 일정이 시작됩니다.`);
  });
});
