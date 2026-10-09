// Run with: node --experimental-strip-types scripts/test-promotion.mjs
import assert from 'node:assert/strict';
import { promotionIsActive, safePromotionLink } from '../src/lib/promotion.ts';

const campaign = {
  enabled: true, title: 'Hockey event', image_url: '/flyer.png', link: '/events',
  starts_at: '2026-10-09T00:00:00Z', ends_at: '2026-10-11T00:00:00Z',
};
const during = Date.parse('2026-10-10T00:00:00Z');
assert.equal(promotionIsActive(campaign, during), true);
assert.equal(promotionIsActive(campaign, Date.parse(campaign.starts_at)), true);
for (const date of ['2026-10-08', campaign.ends_at, '2026-10-12']) {
  assert.equal(promotionIsActive(campaign, Date.parse(date)), false);
}
for (const patch of [{ enabled: false }, { title: ' ' }, { image_url: '' }, { ends_at: '' }, { ends_at: 'bad' }, { starts_at: 'bad' }]) {
  assert.equal(promotionIsActive({ ...campaign, ...patch }, during), false);
}
assert.equal(promotionIsActive({ ...campaign, starts_at: '' }, during), true);
for (const url of ['javascript:alert(1)', '//example.com', 'data:text/html,hello', 'http://example.com']) {
  assert.equal(safePromotionLink(url), false);
}
for (const url of ['/events', 'https://example.com/register']) assert.equal(safePromotionLink(url), true);
console.log('Promotion schedule and link checks passed.');

const { isPaystackStorefrontUrl } = await import('../src/lib/shop.ts');
assert.equal(isPaystackStorefrontUrl('https://paystack.shop/ball-and-stick'), true);
for (const url of ['', 'http://paystack.shop/test', 'https://paystack.shop/', 'https://paystack.shop.evil.test/test', 'https://user:password@paystack.shop/test', 'javascript:alert(1)']) {
  assert.equal(isPaystackStorefrontUrl(url), false);
}
console.log('Storefront URL checks passed.');
