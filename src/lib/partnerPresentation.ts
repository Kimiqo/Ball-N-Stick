import type { Partner } from '../admin/AdminContext';

export const OFFICIAL_PARTNER_BRANDS = [
  { name: 'Act Global', image_url: '/partners/act-global.png', dark: false },
  { name: 'Harrow Sports', image_url: '/partners/harrow-sports.png', dark: true },
];

export function partnerLogo(partner: Pick<Partner, 'name' | 'image_url'>) {
  const brand = OFFICIAL_PARTNER_BRANDS.find(b => b.name.toLowerCase() === partner.name.trim().toLowerCase());
  return {
    src: partner.image_url || brand?.image_url || (partner.name.trim().toLowerCase() === 'top choco' ? '/partners/top-choco.svg' : ''),
    dark: Boolean(brand?.dark && (!partner.image_url || partner.image_url === brand.image_url)),
  };
}

export function alphabetisePartners(partners: Partner[]) {
  return [...partners].sort((a, b) => a.name.trim().localeCompare(b.name.trim(), 'en', { sensitivity: 'base' }));
}
