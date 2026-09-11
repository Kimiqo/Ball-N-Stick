import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import type { BSEvent } from '../admin/AdminContext';

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

function FloatCard({ children, delay = 0, rotate = 0, className = '' }: { children: React.ReactNode; delay?: number; rotate?: number; className?: string }) {
  return (
    <motion.div
      className={`float-card p-4 ${className}`}
      initial={{ opacity: 0, y: 14, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      whileHover={{ y: -4, rotate: rotate * 0.3 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export default function Events() {
  const [events, setEvents] = useState<BSEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.events.list()
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-white">Loading...</div>;
  }

  if (events.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
        <section className="pt-32 md:pt-44 pb-16 min-h-[60vh] flex items-center justify-center text-center">
          <div className="max-w-md mx-auto px-5">
            <div className="label text-[#D71920] mb-4">Events</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] text-4xl mb-4">Coming Soon</h1>
            <p className="text-[#F5F7FA]/45 text-sm">We are currently planning our next exciting events. Check back later!</p>
          </div>
        </section>
      </motion.div>
    );
  }

  const featured = events.find(e => e.featured) || events[0];
  const rest = events.filter(e => e !== featured);

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
            <div className="label text-[#D71920] mb-4">Events</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]" style={{ fontSize: 'clamp(2.2rem, 7.5vw, 9rem)' }}>
              On the
              <br /><span className="text-outline">Calendar</span>
            </h1>
            <p className="text-[#F5F7FA]/45 mt-5 max-w-md text-sm leading-relaxed">
              Ball &amp; Stick Ghana delivers a portfolio of signature events that bring hockey to communities, malls, schools, and streets across the country.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured event */}
      <section className="pb-3 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="relative overflow-hidden group h-[55vh] md:h-[65vh] bg-[#0a1e50]">
              <img
                src={featured.image_url || 'https://images.unsplash.com/photo-1613425295457-ff05c1b63e23?w=900&h=600&fit=crop&auto=format'}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C] via-[#020B1C]/30 to-transparent" />

              {/* Floating event badge */}
              <FloatCard delay={0.3} rotate={-2} className="absolute top-6 right-6 min-w-[140px]">
                <div className="label text-[#D71920] mb-1 text-[0.58rem]">Signature Event</div>
                <div className="font-display font-black uppercase text-[#F5F7FA] text-base">{featured.abbr}</div>
              </FloatCard>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div>
                  <div className="label text-[#D71920] mb-3">B&S Event — Signature Programme</div>
                  <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.88]" style={{ fontSize: 'clamp(1.6rem, 4.5vw, 5rem)' }}>
                    {featured.title}
                  </h2>
                </div>
                <div>
                  <p className="text-[#F5F7FA]/50 text-sm leading-relaxed mb-5">{featured.description}</p>
                  <Link to="/get-involved" className="inline-flex items-center gap-2 font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors">
                    Register Interest <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Events list */}
      <section className="py-4 pb-20 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rest.map((e, i) => (
              <motion.div
                key={e.abbr}
                className="relative overflow-hidden bg-[#0a1e50] aspect-[4/3] group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
              >
                <img
                  src={e.image_url || 'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=700&h=500&fit=crop&auto=format'}
                  alt={e.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/95 via-[#020B1C]/20 to-transparent" />

                {/* Floating abbr badge */}
                <motion.div
                  className="float-card absolute top-3 right-3 px-3 py-1.5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i % 3) * 0.07 }}
                >
                  <span className="label text-[#D71920] text-[0.58rem]">{e.abbr}</span>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display font-black uppercase text-[#F5F7FA] text-lg md:text-xl leading-[0.9] mb-2">
                    {e.title}
                  </h3>
                  <p className="text-[#F5F7FA]/35 text-xs leading-relaxed line-clamp-2">{e.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery link */}
      <section className="py-14 border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <Reveal>
            <div>
              <div className="label text-[#D71920] mb-2">Event Archive</div>
              <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]" style={{ fontSize: 'clamp(1.3rem, 3.5vw, 3.5rem)' }}>
                See the Gallery for event photo collections.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/gallery" className="font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3 border border-[#D71920]/40 text-[#D71920] hover:bg-[#D71920]/10 transition-colors flex items-center gap-2 whitespace-nowrap">
              Browse Gallery <ArrowRight size={12} />
            </Link>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
