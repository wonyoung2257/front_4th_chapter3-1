import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const events: Event[] = [
  {
    id: '1',
    title: '이벤트 2',
    date: '2024-07-01',
    startTime: '09:00',
    endTime: '10:00',
    description: 'first event',
    location: '서울',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '2',
    title: '이벤트 3',
    date: '2024-07-12',
    startTime: '09:00',
    endTime: '10:00',
    description: 'second Event',
    location: '서울',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '3',
    title: '일정 4',
    date: '2024-07-13',
    startTime: '09:00',
    endTime: '10:00',
    description: '첫번째 일정',
    location: '서울',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
  {
    id: '5',
    title: '이벤트 6',
    date: '2024-07-31',
    startTime: '09:00',
    endTime: '10:00',
    description: '월말 이벤트',
    location: '서울',
    category: '회의',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  },
];

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '이벤트 2', currentDate, 'month');
    expect(result).toEqual([events[0]]);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '', currentDate, 'week');
    expect(result).toEqual([events[0]]);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '', currentDate, 'month');

    expect(result).toEqual(events);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '이벤트', currentDate, 'week');
    expect(result).toEqual([events[0]]);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '', currentDate, 'month');
    expect(result).toEqual(events);
  });

  it('검색어가 없고 월간 뷰 필터링을 적용했을 때 해당 월의 모든 이벤트를 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '', currentDate, 'month');
    expect(result).toEqual(events);
  });

  it('검색어가 없고 주간 뷰 필터링을 적용했을 때 해당 주의 모든 이벤트를 반환한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, '', currentDate, 'week');
    expect(result).toEqual([events[0]]);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const currentDate = new Date('2024-07-01');
    const result = getFilteredEvents(events, 'event', currentDate, 'month');
    expect(result).toEqual([events[0], events[1]]);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const currentDate = new Date('2024-08-01');
    const result = getFilteredEvents(events, '', currentDate, 'week');
    expect(result).toEqual([events[3]]);
  });

  it('월말에 주간 필터링 시 다음달 이벤트도 포함하여 반환한다', () => {
    const currentDate = new Date('2024-06-30');
    const result = getFilteredEvents(events, '', currentDate, 'week');
    expect(result).toEqual([events[0]]);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const currentDate = new Date('2024-08-01');
    const result = getFilteredEvents([], '', currentDate, 'week');
    expect(result).toEqual([]);
  });
});
