import type { BSEvent } from '../admin/AdminContext';

export function isNextGenEvent(event: Pick<BSEvent, 'title'>) {
  return /\bnext\s*gen\s+hockey\s+festival\b/i.test(event.title);
}

export function orderEvents(events: BSEvent[]) {
  return [...events.filter(isNextGenEvent), ...events.filter(event => !isNextGenEvent(event))];
}
