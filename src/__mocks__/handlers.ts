import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };
// 데이터를 전역으로 관리면 CUD에 대한 변화를 감지 할 수 있음
// 단 걸리는 것은 테스트에서 전역으로 관리하는 데이터가 독립적인 테스트 결과에 영향을 주지 않을까 싶음

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get('/api/events', () => {
    return HttpResponse.json({ events });
  }),

  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    newEvent.id = crypto.randomUUID();

    return HttpResponse.json(newEvent, {
      status: 201,
    });
  }),

  http.put('/api/events/:id', async ({ request, params }) => {
    const { id } = params;
    const eventIndex = events.findIndex((event) => event.id === id);

    if (eventIndex > -1) {
      const newEvent = (await request.json()) as Event;
      const newEvents = [...events];
      newEvents[eventIndex] = { ...events[eventIndex], ...newEvent };

      return HttpResponse.json(newEvents[eventIndex], {
        status: 204,
      });
    }

    return HttpResponse.json('Event not found', {
      status: 404,
    });
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const { id } = params;
    const newEvents = events.filter((event) => event.id !== id);

    if (newEvents) {
      return HttpResponse.json(null, {
        status: 204,
      });
    }

    return HttpResponse.json(null, {
      status: 404,
    });
  }),
];
