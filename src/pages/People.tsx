import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { isCeo } from '../lib/peoplePresentation';
import type { TeamMember } from '../admin/AdminContext';
import TeamProfileCard, { ProfileDetails, ProfilePhoto } from '../components/TeamProfileCard';

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

export default function People() {
  const [people, setPeople] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    api.people.list()
      .then(data => {
        setPeople(data);
        setLoading(false);
      })
      .catch(error => { console.error(error); setLoadError(true); setLoading(false); });
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-white">Loading...</div>;
  }

  if (loadError) return <div className="min-h-screen pt-32 px-5 text-center text-white"><h1 className="font-display text-3xl uppercase">Our People</h1><p className="mt-4">The team profiles could not load. Please try again shortly.</p></div>;

  const ceo = people.find(isCeo);

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

      {/* CEO leads the team */}
      {ceo && (
        <section id={`member-${ceo.id}`} className="py-12 md:py-16 bg-[#071A3D] scroll-mt-28">
          <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div className="aspect-[4/5] max-h-[600px] overflow-hidden bg-[#0a1e50]"><ProfilePhoto member={ceo} /></div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="label text-[#D71920] mb-4">{ceo.role}</div>
              <h2 className="font-display font-black uppercase text-white leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>{ceo.name?.trim() || 'Name to be confirmed'}</h2>
              <div className="divider mb-6" />
              <p className="text-[#F5F7FA]/50 text-sm leading-relaxed mb-6">
                Ball &amp; Stick Ghana was founded with a passion for excellence in the Field Hockey fraternity and an ambition to grow the sport across Africa.
              </p>
              <ProfileDetails member={ceo} />
            </Reveal>
          </div>
        </section>
      )}

      {/* Identifiable profiles for the full team */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal><div className="label text-[#D71920] mb-3">The Ball &amp; Stick Ghana Team</div><h2 className="font-display font-black uppercase text-white text-3xl md:text-5xl mb-10">Meet Our People</h2></Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {people.filter(member => member.id !== ceo?.id).map((member, index) => (
              <Reveal key={member.id} delay={Math.min(index * 0.05, 0.25)}><TeamProfileCard member={member} /></Reveal>
            ))}
          </div>
          {people.length === 0 && <p className="text-white/60">Team profiles will be added soon.</p>}
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
                key={pos.id}
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
            Contact <a href="mailto:kojo@ballandstick.com" className="label text-[#F5F7FA]/20 hover:text-[#D71920] transition-colors text-[0.6rem]">kojo@ballandstick.com</a> for enquiries.
          </p>
        </div>
      </section>

    </motion.div>
  );
}
