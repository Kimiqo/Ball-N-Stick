import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

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

// Demo schools — replace with CMS content
const SCHOOLS = Array.from({ length: 12 }, (_, i) => ({
  name: `Partner School ${String.fromCharCode(65 + i)}`,
  region: i < 6 ? 'Greater Accra' : i < 9 ? 'Ashanti' : 'Central',
  level: i % 3 === 0 ? 'Secondary' : i % 3 === 1 ? 'Primary' : 'International',
  since: `Year ${i + 1}`,
}));

const REGIONS = ['All', 'Greater Accra', 'Ashanti', 'Central'];

export default function Schools() {
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('All');

  const filtered = SCHOOLS.filter(s => {
    const matchQuery = s.name.toLowerCase().includes(query.toLowerCase());
    const matchRegion = region === 'All' || s.region === region;
    return matchQuery && matchRegion;
  });

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
          <img
            src="https://images.unsplash.com/photo-1613332738142-c79288f25e09?w=1920&h=700&fit=crop&auto=format"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020B1C] to-[#020B1C]" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">School Network</div>
            <h1
              className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] max-w-3xl"
              style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)' }}
            >
              Partner
              <br />
              <span className="text-outline">Schools</span>
            </h1>
            <p className="text-[#F5F7FA]/45 mt-6 max-w-md text-sm leading-relaxed">
              Demo content — the school directory is managed through the CMS. The schools below are placeholder entries only.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-8 bg-[#071A3D] border-y border-white/[0.05] sticky top-16 md:top-20 z-40">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F7FA]/30" />
            <input
              type="text"
              placeholder="Search schools..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] text-[#F5F7FA] placeholder-[#F5F7FA]/25 text-sm pl-9 pr-4 py-2.5 outline-none focus:border-[#D71920]/50 transition-colors"
            />
          </div>
          {/* Region filter */}
          <div className="flex gap-2 flex-wrap">
            {REGIONS.map(r => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`label text-[0.62rem] px-4 py-2 border transition-colors ${
                  region === r
                    ? 'bg-[#D71920] border-[#D71920] text-[#F5F7FA]'
                    : 'border-white/[0.08] text-[#F5F7FA]/40 hover:text-[#F5F7FA] hover:border-white/20'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schools grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="label text-[#F5F7FA]/25 mb-6 text-[0.62rem]">
            {filtered.length} school{filtered.length !== 1 ? 's' : ''} found
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((s, i) => (
              <motion.div
                key={s.name}
                className="bg-[#0a1e50] border border-white/[0.05] p-6 hover:border-[#D71920]/30 transition-colors group"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              >
                <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
                  <span className="font-display font-black text-[#D71920] text-xl">
                    {s.name[0]}
                  </span>
                </div>
                <h3 className="font-display font-black uppercase text-[#F5F7FA] text-lg leading-tight mb-2 group-hover:text-[#D71920] transition-colors">
                  {s.name}
                </h3>
                <div className="flex flex-col gap-1.5 mt-3">
                  <span className="label text-[#F5F7FA]/30 text-[0.6rem]">{s.region}</span>
                  <span className="label text-[#F5F7FA]/30 text-[0.6rem]">{s.level}</span>
                </div>
                <div className="mt-4 h-px w-0 group-hover:w-full bg-[#D71920]/20 transition-all duration-500" />
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#F5F7FA]/30 text-sm">
              No schools match your search.
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-20 bg-[#071A3D] border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div>
              <div className="label text-[#D71920] mb-3">Is your school not listed?</div>
              <h2
                className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
              >
                Join the Network
              </h2>
              <p className="text-[#F5F7FA]/45 text-sm leading-relaxed mt-4 mb-7">
                If you&apos;re a school interested in joining the Ball &amp; Stick Ghana network, we&apos;d love to hear from you.
              </p>
              <Link
                to="/get-involved"
                className="inline-flex items-center gap-2 font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
              >
                Register Your School <ArrowRight size={12} />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#0a1e50]">
              <img
                src="https://images.unsplash.com/photo-1632215865645-3efa9af21424?w=800&h=600&fit=crop&auto=format"
                alt="School students"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
