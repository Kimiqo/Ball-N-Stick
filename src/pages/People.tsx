import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import type { TeamMember } from '../admin/AdminContext';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const IMGS = [
  'https://images.unsplash.com/photo-1534597422092-8a84f1b45a9c?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=400&h=500&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1627423895015-4db87342a410?w=400&h=500&fit=crop&auto=format',
];

export default function People() {
  const [people, setPeople] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.people.list()
      .then(data => {
        setPeople(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-white">Loading...</div>;
  }

  const ceo = people.find(p => p.role.includes('Chief Executive Officer') || p.role.includes('CEO'));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">Our People</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]" style={{ fontSize: 'clamp(2.2rem, 7.5vw, 9rem)' }}>
              The Team
              <br /><span className="text-outline">Behind the Mission</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* CEO highlight */}
      <section className="py-16 md:py-20 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="relative aspect-[3/4] overflow-hidden bg-[#0a1e50] max-w-sm">
              <img
                src={ceo?.image_url || IMGS[0]}
                alt={ceo?.name || "Kojo Lumour Ameye"}
                className="w-full h-full object-cover grayscale"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/60 to-transparent" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <div className="label text-[#D71920] mb-3">{ceo?.role || "Founder & CEO"}</div>
              <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 4rem)' }}>
                {ceo?.name || "Kojo Lumour Ameye"}
              </h2>
              {ceo?.email && (
                <a href={`mailto:${ceo.email}`} className="label text-[#F5F7FA]/35 hover:text-[#D71920] transition-colors">
                  {ceo.email}
                </a>
              )}
              <div className="divider my-6" />
              <p className="text-[#F5F7FA]/50 text-sm leading-relaxed">
                Ball &amp; Stick Ghana was founded with a passion for excellence in the Field Hockey fraternity and an ambition to grow the sport across Africa. Full team profiles are managed through the CMS.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Org structure list */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-8">Organisational Structure</div>
          </Reveal>
          <div className="flex flex-col border-t border-white/[0.05]">
            {people.map((pos, i) => (
              <motion.div
                key={pos.role}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-white/[0.05] gap-2 group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="flex items-center gap-5">
                  <span className="font-display font-bold text-[#D71920]/35 text-[0.65rem] tracking-widest w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div className="font-display font-black uppercase text-[#F5F7FA]/65 group-hover:text-[#F5F7FA] transition-colors text-lg md:text-xl">
                      {pos.role}
                    </div>
                    {pos.name ? (
                      <div className="label text-[#D71920] text-[0.6rem] mt-0.5">{pos.name}</div>
                    ) : (
                      <div className="label text-[#F5F7FA]/20 text-[0.6rem] mt-0.5">Name TBC</div>
                    )}
                  </div>
                </div>
                {pos.email && (
                  <a href={`mailto:${pos.email}`} className="label text-[#F5F7FA]/20 hover:text-[#D71920] transition-colors text-[0.6rem]">
                    {pos.email}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
          <p className="text-[#F5F7FA]/20 text-xs mt-6">
            Full team profiles managed through CMS. Contact info@ballandstick.com for enquiries.
          </p>
        </div>
      </section>

      {/* Team photos */}
      <section className="py-12 pb-20 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#F5F7FA]/20 mb-8">The Ball &amp; Stick Ghana Team</div>
          </Reveal>
          <div className="grid grid-cols-3 gap-2">
            {(people.filter(p => p.image_url && p.id !== ceo?.id).map(p => p.image_url as string).length > 0 
              ? people.filter(p => p.image_url && p.id !== ceo?.id).map(p => p.image_url as string).slice(0, 3) 
              : IMGS).map((src, i) => (
              <motion.div
                key={i}
                className="aspect-[3/4] overflow-hidden bg-[#0a1e50]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <img src={src} alt="Team member" className="w-full h-full object-cover grayscale opacity-60" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
