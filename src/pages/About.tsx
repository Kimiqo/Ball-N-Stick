import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function FloatCard({
  children, delay = 0, rotate = 0, className = '',
}: { children: React.ReactNode; delay?: number; rotate?: number; className?: string }) {
  return (
    <motion.div
      className={`float-card p-5 md:p-6 ${className}`}
      initial={{ opacity: 0, y: 16, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      whileHover={{ y: -5, rotate: rotate * 0.3 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const VALUES = [
  { title: 'Innovation', desc: 'Pioneering new ways to promote and grow field hockey across Ghana and Africa.' },
  { title: 'Integrity', desc: 'Operating with transparency and genuine commitment to the sport and our communities.' },
  { title: 'Efficiency', desc: 'Delivering maximum impact through focused, well-executed programmes and events.' },
];

const ORG_STRUCTURE = [
  { role: 'Chief Executive Officer', note: '' },
  { role: 'B&S Foundation Manager', note: '' },
  { role: 'B&S Event Manager', note: '' },
  { role: 'B&S Global Manager', note: '' },
  { role: 'B&S Media Manager', note: '' },
  { role: 'B&S Play Manager', note: '' },
  { role: 'Personal Assistant', note: '' },
];

const STRATEGY = [
  { title: 'Market Penetration', desc: "Expanding hockey's footprint through schools, communities, and public events." },
  { title: 'Talent Development', desc: 'Identifying and nurturing Ghanaian talent for national and international competition.' },
  { title: 'Media & Visibility', desc: "Building hockey's profile through magazines, broadcast, and digital content." },
  { title: 'Partnership Growth', desc: 'Strengthening relationships with Act Global, Harrow Sports, and future partners.' },
];

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero with floating cards */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden min-h-[75vh] flex flex-col justify-end">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1613425295457-ff05c1b63e23?w=1920&h=900&fit=crop&auto=format"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020B1C] via-[#020B1C]/60 to-[#020B1C]" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">About</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] max-w-3xl" style={{ fontSize: 'clamp(3.5rem, 7vw, 8rem)' }}>
              Who We
              <br /><span className="text-outline">Are</span>
            </h1>
          </motion.div>

          {/* Floating mission / vision / values cards */}
          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FloatCard delay={0.3} rotate={-1}>
              <div className="label text-[#D71920] mb-2">Mission</div>
              <p className="font-display font-bold uppercase text-[#F5F7FA] text-base leading-tight">
                To promote Field Hockey across Ghana and Africa.
              </p>
            </FloatCard>
            <FloatCard delay={0.4} rotate={1.2}>
              <div className="label text-[#D71920] mb-2">Vision</div>
              <p className="font-display font-bold uppercase text-[#F5F7FA] text-base leading-tight">
                To be a globally recognized Field Hockey promotion company.
              </p>
            </FloatCard>
            <FloatCard delay={0.5} rotate={-0.8}>
              <div className="label text-[#D71920] mb-2">Tagline</div>
              <p className="font-display font-black uppercase text-[#F5F7FA] text-xl leading-tight">
                Action Imagined!!
              </p>
            </FloatCard>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <Reveal>
            <div>
              <div className="label text-[#D71920] mb-4">Our Story</div>
              <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
                Built on a Passion for Excellence
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <p className="text-[#F5F7FA]/60 leading-relaxed mb-5 text-sm">
                Ball &amp; Stick grew from a passion for excellence in the Field Hockey fraternity, with an ambition to grow the sport across Africa and develop talent in Ghana for the world stage.
              </p>
              <p className="text-[#F5F7FA]/45 leading-relaxed text-sm">
                The organisation has experienced personnel within Field Hockey, including FIH-status umpires and technical officials, as well as media and marketing expertise. Through five distinct arms — B&amp;S Play, B&amp;S Media, B&amp;S Global, B&amp;S Event, and B&amp;S Foundation — Ball &amp; Stick delivers a comprehensive approach to hockey development, promotion, and community impact.
              </p>
              <div className="divider mt-6" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-4">Core Values</div>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              What Drives Us
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                className="bg-[#020B1C] p-8 md:p-10 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
              >
                <div className="font-display font-bold text-[#D71920] text-[0.7rem] tracking-[0.2em] mb-4">0{i + 1}</div>
                <h3 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-4" style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)' }}>
                  {v.title}
                </h3>
                <p className="text-[#F5F7FA]/45 text-sm leading-relaxed">{v.desc}</p>
                <div className="mt-6 h-px w-0 group-hover:w-8 bg-[#D71920] transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section className="py-20 md:py-24 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-4">Strategy</div>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              Key Strengths
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.05]">
            {STRATEGY.map((s, i) => (
              <motion.div
                key={s.title}
                className="bg-[#071A3D] p-7 md:p-9"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
              >
                <h3 className="font-display font-black uppercase text-[#F5F7FA] text-xl md:text-2xl leading-tight mb-3">
                  {s.title}
                </h3>
                <p className="text-[#F5F7FA]/45 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Org structure */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-4">Organisation</div>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}>
              Org Structure
            </h2>
          </Reveal>
          <div className="flex flex-col border-t border-white/[0.05]">
            {ORG_STRUCTURE.map((pos, i) => (
              <motion.div
                key={pos.role}
                className="flex items-center justify-between py-5 border-b border-white/[0.05] group"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <div className="flex items-center gap-6">
                  <span className="font-display font-bold text-[#D71920]/40 text-[0.65rem] tracking-widest w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display font-black uppercase text-[#F5F7FA]/70 group-hover:text-[#F5F7FA] transition-colors text-lg md:text-xl">
                    {pos.role}
                  </span>
                </div>
                <span className="label text-[#F5F7FA]/15 text-[0.6rem]">Position</span>
              </motion.div>
            ))}
          </div>
          <p className="text-[#F5F7FA]/20 text-xs mt-6">
            Full team profiles managed through CMS. Contact info@ballandstick.com for enquiries.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#071A3D] border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Reveal>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Want to know more?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-4">
              <Link to="/people" className="font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors flex items-center gap-2">
                Our People <ArrowRight size={12} />
              </Link>
              <Link to="/contact" className="font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3 border border-[#F5F7FA]/20 text-[#F5F7FA] hover:border-[#F5F7FA]/50 transition-colors">
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
