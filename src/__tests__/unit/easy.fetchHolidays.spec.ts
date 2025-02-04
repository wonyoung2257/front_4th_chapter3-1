import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const currentDate = new Date('2024-01-02');
    const result = fetchHolidays(currentDate);
    expect(result).toEqual({ '2024-01-01': '신정' });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const currentDate = new Date('2024-07-02');
    const result = fetchHolidays(currentDate);
    expect(result).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const currentDate = new Date('2024-02-12');
    const result = fetchHolidays(currentDate);
    expect(result).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });
  });

  it('연도가 다른 같은 월의 공휴일은 포함하지 않는다', () => {
    const currentDate = new Date('2023-01-01');
    const result = fetchHolidays(currentDate);
    expect(result).toEqual({});
  });
});
