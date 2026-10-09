export type EventPromotion = {
  description?: string;
  enabled: boolean;
  title: string;
  image_url: string;
  link: string;
  starts_at: string;
  ends_at: string;
};
export const EMPTY_PROMOTION: EventPromotion = { enabled: false, title: '', image_url: '', link: '/events', starts_at: '', ends_at: '' };
export function safePromotionLink(link: string) {
  return /^\/(?!\/)/.test(link) || /^https:\/\//i.test(link);
}
export function promotionIsActive(p: EventPromotion, now = Date.now()) {
  const start = p.starts_at ? Date.parse(p.starts_at) : -Infinity;
  const end = Date.parse(p.ends_at);
  return p.enabled && Boolean(p.title.trim() && p.image_url) && start <= now && now < end;
}

export const NEXTGEN_PROMOTION: EventPromotion = {
  enabled: true,
  title: 'NextGen Hockey Festival',
  description: 'Saturday 24 October 2026 · Tema International School · Attendance strictly by invitation.',
  image_url: '/events/nextgen-hockey-festival-2026.jpeg',
  link: '',
  starts_at: '',
  ends_at: '2026-10-25T00:00:00Z',
};
