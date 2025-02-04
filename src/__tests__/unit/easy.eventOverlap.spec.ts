import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const result = parseDateTime('2024-07-01', '14:30');
    expect(result).toEqual(new Date(2024, 6, 1, 14, 30));
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('Invalid Date', '14:30');
    expect(result).toBeInstanceOf(Date);
    expect(result.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', 'Invalid Time');
    expect(result).toBeInstanceOf(Date);
    expect(result.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30');
    expect(result).toBeInstanceOf(Date);
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Event 1',
      date: '2024-07-01',
      startTime: '09:00',
      endTime: '10:00',
      description: '첫 번째 이벤트',
      location: '서울',
      category: '회의',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 30,
    },
    {
      id: '2',
      title: 'Event 2',
      date: '2024-07-02',
      startTime: '14:00',
      endTime: '15:00',
      description: '두 번째 이벤트',
      location: '부산',
      category: '미팅',
      repeat: {
        type: 'none',
        interval: 0,
      },
      notificationTime: 15,
    },
  ];

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const result = convertEventToDateRange(events[0]);
    expect(result).toEqual({
      start: new Date('2024-07-01T09:00:00'),
      end: new Date('2024-07-01T10:00:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const result = convertEventToDateRange({
      ...events[0],
      date: 'Invalid Date',
    });

    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const result = convertEventToDateRange({
      ...events[0],
      startTime: 'Invalid Time',
      endTime: 'Invalid Time',
    });

    expect(result.start.toString()).toBe('Invalid Date');
    expect(result.end.toString()).toBe('Invalid Date');
  });
});

const events: Event[] = [
  {
    id: '1',
    title: 'Event 1',
    date: '2024-07-01',
    startTime: '09:00',
    endTime: '11:00',
    description: '겹치는 첫 번째 이벤트',
    location: '서울',
    category: '회의',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 30,
  },
  {
    id: '2',
    title: 'Event 2',
    date: '2024-07-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '겹치는 두 번째 이벤트',
    location: '부산',
    category: '미팅',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 15,
  },
  {
    id: '3',
    title: 'Event 3',
    date: '2024-07-02',
    startTime: '10:00',
    endTime: '11:00',
    description: '겹치지 않는 이벤트',
    location: '부산',
    category: '미팅',
    repeat: {
      type: 'none',
      interval: 0,
    },
    notificationTime: 15,
  },
];

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const result = isOverlapping(events[0], events[1]);
    expect(result).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const result = isOverlapping(events[0], events[2]);
    expect(result).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const newEvent: Event = {
    id: '4',
    title: 'Event 4',
    date: '2024-07-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '겹치는 네 번째 이벤트',
    location: '부산',
    category: '미팅',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 15,
  };
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const result = findOverlappingEvents(newEvent, events);
    expect(result).toEqual([events[0], events[1]]);
  });

  const newEvent2: Event = {
    id: '5',
    title: 'Event 5',
    date: '2024-07-03',
    startTime: '10:00',
    endTime: '11:00',
    description: '겹치지 않는 다섯 번째 이벤트',
    location: '부산',
    category: '미팅',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 15,
  };

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const result = findOverlappingEvents(newEvent2, events);
    expect(result).toEqual([]);
  });
});
