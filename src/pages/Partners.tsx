import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import type { Partner } from '../admin/AdminContext';

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

const PARTNERSHIP_TYPES = [
  { title: 'Event Sponsorship', desc: 'Associate your brand with Ball & Stick signature events: HITMALL, HYES, HOSS and more.' },
  { title: 'Programme Funding', desc: 'Directly fund youth development, officiating, schools, or media programmes.' },
  { title: 'Equipment & In-Kind', desc: 'Supply hockey equipment, facilities, expertise or services.' },
  { title: 'International Bodies', desc: 'Collaborate with B&S Global for international hockey promotion and player development.' },
];

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.partners.list()
      .then(data => {
        setPartners(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1597260390010-ba4dc841b04c?w=1920&h=700&fit=crop&auto=format" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.08]" />
          <div className="absolute inset-0 bg-[#020B1C]/90" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">Partners</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]" style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)' }}>
              Together
              <br /><span className="text-outline">We Grow</span>
            </h1>
            <p className="text-[#F5F7FA]/50 mt-6 max-w-lg text-sm leading-relaxed">
              Ball &amp; Stick Ghana works with leading organisations that share our commitment to growing field hockey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Official partners */}
      <section className="py-20 md:py-28 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-10">Official Partners</div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.map((p, i) => (
              <motion.div
                key={p.name}
                className="bg-[#0a1e50] border border-white/[0.06] p-8 md:p-10 hover:border-[#D71920]/25 transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
              >
                {p.image_url ? (
                  <div className="w-16 h-16 bg-white/[0.03] flex items-center justify-center mb-6 rounded-full overflow-hidden border border-white/[0.08] group-hover:border-[#D71920]/30 transition-colors">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 border border-white/[0.08] bg-white/[0.03] flex items-center justify-center mb-6 group-hover:border-[#D71920]/30 transition-colors">
                    <span className="font-display font-black text-[#D71920] text-2xl">{p.name ? p.name[0] : '?'}</span>
                  </div>
                )}
                <div className="label text-[#D71920] mb-2">{p.type}</div>
                <h3 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-4" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}>
                  {p.name}
                </h3>
                <p className="text-[#F5F7FA]/50 text-sm leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership opportunities */}
      <section className="py-20 md:py-24">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-4">Partnership Opportunities</div>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              How to Partner
              <br />With Us
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.05]">
            {PARTNERSHIP_TYPES.map((pt, i) => (
              <motion.div
                key={pt.title}
                className="bg-[#020B1C] p-8 md:p-10 group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
              >
                <h3 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-4" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)' }}>
                  {pt.title}
                </h3>
                <p className="text-[#F5F7FA]/45 text-sm leading-relaxed">{pt.desc}</p>
                <div className="mt-6 h-px w-0 group-hover:w-6 bg-[#D71920] transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <div className="label text-[#D71920] mb-4">Partner With Ball &amp; Stick</div>
              <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]" style={{ fontSize: 'clamp(2.5rem, 4.5vw, 5rem)' }}>
                Let&apos;s Build Ghanaian Hockey Together
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-[#F5F7FA]/50 text-sm leading-relaxed mb-8">
                Whether you&apos;re a corporation, a foundation, or an international hockey body — Ball &amp; Stick Ghana offers meaningful partnership opportunities. Contact us to explore how we can grow the game together.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-7 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors flex items-center gap-2">
                  Get in Touch <ArrowRight size={14} />
                </Link>
                <Link to="/get-involved" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-7 py-4 border border-[#F5F7FA]/20 text-[#F5F7FA] hover:border-[#F5F7FA]/50 transition-colors">
                  Partner With Us
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
