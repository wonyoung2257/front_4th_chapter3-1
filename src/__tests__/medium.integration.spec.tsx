import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import App from '../App';
import { server } from '../setupTests';
import { Event } from '../types';

describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    const user = userEvent.setup();

    // 고정된 ID를 반환하도록 MSW 핸들러 재정의
    server.use(
      http.post('/api/events', async ({ request }) => {
        const newEvent = (await request.json()) as Event;
        return HttpResponse.json({ ...newEvent, id: 'test-id-1' }, { status: 201 });
      })
    );

    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    // 새 일정 추가 버튼 클릭
    const addButton = screen.getByRole('button', { name: /새 일정 추가/i });
    await user.click(addButton);

    // 일정 정보 입력
    const testEvent = {
      title: '새로운 회의',
      date: '2024-12-25',
      startTime: '14:00',
      endTime: '15:00',
      description: '크리스마스 회의',
      location: '회의실 A',
      category: '미팅',
      notificationTime: 30,
    };

    // 각 필드 입력
    await user.type(screen.getByLabelText(/제목/i), testEvent.title);
    await user.type(screen.getByLabelText(/날짜/i), testEvent.date);
    await user.type(screen.getByLabelText(/시작 시간/i), testEvent.startTime);
    await user.type(screen.getByLabelText(/종료 시간/i), testEvent.endTime);
    await user.type(screen.getByLabelText(/설명/i), testEvent.description);
    await user.type(screen.getByLabelText(/장소/i), testEvent.location);
    await user.type(screen.getByLabelText(/카테고리/i), testEvent.category);
    await user.type(screen.getByLabelText(/알림 시간/i), testEvent.notificationTime.toString());

    // 저장 버튼 클릭
    const saveButton = screen.getByRole('button', { name: /저장/i });
    await user.click(saveButton);

    // 저장된 일정 확인
    const savedEvent = await screen.findByText(testEvent.title);
    expect(savedEvent).toBeInTheDocument();

    // 상세 정보 확인
    await user.click(savedEvent);

    expect(screen.getByText(testEvent.description)).toBeInTheDocument();
    expect(screen.getByText(testEvent.location)).toBeInTheDocument();
    expect(screen.getByText(testEvent.category)).toBeInTheDocument();
    expect(screen.getByText(`${testEvent.notificationTime}분 전`)).toBeInTheDocument();
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {});

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
