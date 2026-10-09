import { useState } from 'react';
import { alphabetisePartners, partnerLogo } from '../lib/partnerPresentation';
import type { Partner } from '../admin/AdminContext';

function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);
  const logo = partnerLogo(partner);
  return <div className={`h-32 ${logo.dark ? 'bg-[#020B1C]' : 'bg-white'} flex items-center justify-center p-5 mb-5`}>
    {logo.src && !failed
      ? <img src={logo.src} alt={`${partner.name} logo`} loading="lazy" className="max-h-full max-w-full object-contain" onError={() => setFailed(true)} />
      : <span aria-hidden="true" className="font-display text-3xl font-bold text-[#071A3D]">{partner.name.split(' ').map(word => word[0]).slice(0, 4).join('')}</span>}
  </div>;
}

export default function PartnerSection({ title, description, partners }: { title: string; description?: string; partners: Partner[] }) {
  return <section className="py-16 bg-[#071A3D] border-b border-white/10">
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
      <h2 className="font-display font-black uppercase text-white text-3xl mb-3">{title}</h2>
      {description && <p className="text-white/70 text-sm mb-8">{description}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        {alphabetisePartners(partners).map(partner => <article key={partner.id} className="bg-[#0a1e50] border border-white/10 p-5">
          <PartnerLogo key={partner.image_url} partner={partner} />
          <h3 className="font-display font-bold text-white text-xl">{partner.name}</h3>
          {partner.description && <p className="text-white/70 text-sm mt-3">{partner.description}</p>}
          {/^https?:\/\//i.test(partner.website) && <a href={partner.website} target="_blank" rel="noreferrer" className="inline-block text-sm text-white underline mt-4">Visit website<span className="sr-only">: {partner.name}</span></a>}
        </article>)}
      </div>
    </div>
  </section>;
}
