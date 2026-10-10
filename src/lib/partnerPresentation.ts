import type { Partner } from '../admin/AdminContext';

export const OFFICIAL_PARTNER_BRANDS = [
  { name: 'Act Global', image_url: '/partners/act-global.png', dark: false },
  { name: 'Harrow Sports', image_url: '/partners/harrow-sports.png', dark: true },
  { name: 'Field Hockey Canada', image_url: '/partners/field-hockey-canada.webp', dark: false },
];

const SUPPLIED_LOGOS: Record<string, string> = {
  'top choco': '/partners/top-choco.svg',
  'flora tissues': '/partners/flora-tissues.webp',
  'verna': '/partners/verna.webp',
  'akosombo international school': '/partners/akosombo-international.webp',
  'gimpa': '/partners/gimpa.webp',
};

export function partnerLogo(partner: Pick<Partner, 'name' | 'image_url'>) {
  const brand = OFFICIAL_PARTNER_BRANDS.find(b => b.name.toLowerCase() === partner.name.trim().toLowerCase());
  return {
    src: partner.image_url || brand?.image_url || SUPPLIED_LOGOS[partner.name.trim().toLowerCase()] || '',
    dark: Boolean(brand?.dark && (!partner.image_url || partner.image_url === brand.image_url)),
  };
}

export function alphabetisePartners(partners: Partner[]) {
  return [...partners].sort((a, b) => a.name.trim().localeCompare(b.name.trim(), 'en', { sensitivity: 'base' }));
}
