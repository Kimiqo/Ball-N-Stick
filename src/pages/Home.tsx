import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';

/* ── Animated counter ── */
function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const tick = () => {
      frame++;
      setCount(Math.round((frame / total) * value));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);
  return (
    <div ref={ref}>
      <div className="font-display font-black text-[#F5F7FA] leading-none" style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}>
        {count}{suffix}
      </div>
      <div className="label text-[#F5F7FA]/35 mt-2">{label}</div>
    </div>
  );
}

/* ── Text Animations ── */
import { TypeAnimation } from 'react-type-animation';
import { BlurText } from '../components/ReactBits/BlurText';

/* ── Magnetic Button ── */
function MagneticButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Section reveal ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── Floating card ── */
function FloatCard({
  children, delay = 0, rotate = 0, className = '',
}: { children: React.ReactNode; delay?: number; rotate?: number; className?: string }) {
  return (
    <motion.div
      className={`float-card p-4 md:p-5 ${className}`}
      initial={{ opacity: 0, y: 18, rotate }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      whileHover={{ y: -5, rotate: rotate * 0.3 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const BS_ARMS = [
  { code: 'B&S Play', title: 'Training &\nDevelopment', desc: 'Training players, coaches, umpires and table officials. Hockey-related development activities.' },
  { code: 'B&S Media', title: 'Hockey\nMedia', desc: 'Magazines, TV & radio productions, live match coverage, online photo galleries.' },
  { code: 'B&S Global', title: 'International\nReach', desc: 'Player placement, international hockey promotion, national and international sponsorship.' },
  { code: 'B&S Event', title: 'Events &\nCamps', desc: 'Tournaments, hockey camps, refresher courses, festive games, and the 1M4H initiative.' },
  { code: 'B&S Foundation', title: 'Foundation\n& Community', desc: 'Sponsorship for student athletes, school linking programmes, and Street Child hockey.' },
];

import { api } from '../lib/api';
import type { GalleryCollection, BSEvent } from '../admin/AdminContext';

export default function Home() {
  const [gallery, setGallery] = useState<GalleryCollection[]>([]);
  const [events, setEvents] = useState<BSEvent[]>([]);
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1613425295457-ff05c1b63e23?w=1920&h=1080&fit=crop&auto=format');

  // Parallax setups
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const bgY = useTransform(scrollY, [0, 2000], [0, 300]);

  useEffect(() => {
    api.gallery.list().then(setGallery).catch(console.error);
    api.events.list().then(setEvents).catch(console.error);
    api.settings.get().then(s => {
      if (s?.hero_image_url) setHeroImage(s.hero_image_url);
    }).catch(console.error);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── 1. HERO ── */}
      <section className="relative h-screen min-h-[620px] flex flex-col justify-end overflow-hidden">
        <motion.img
          src={heroImage}
          alt="Field hockey in action"
          className="absolute inset-0 w-full h-[120%] object-cover object-center top-[-10%]"
          style={{ y: heroY }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C] via-[#020B1C]/55 to-[#020B1C]/15" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 pb-16 md:pb-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
          </motion.div>

          <div className="flex flex-col gap-0 min-h-[160px] md:min-h-[220px]" style={{ maxWidth: 'min(90vw, 850px)' }}>
            <TypeAnimation
              sequence={[
                'GROWING THE GAME.\nBUILDING THE NEXT GENERATION.',
                5000,
                'GROWING THE GAME.\nINSPIRING THE FUTURE.',
                5000,
              ]}
              wrapper="h1"
              speed={50}
              repeat={Infinity}
              className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]"
              style={{ fontSize: 'clamp(2.2rem, 8vw, 8.5rem)', whiteSpace: 'pre-line' }}
            />
          </div>

          <motion.div
            className="flex flex-wrap gap-4 mt-10 md:mt-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <MagneticButton>
              <Link to="/gallery" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-7 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors duration-200 flex items-center gap-2">
                Explore Our Work <ArrowRight size={14} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link to="/get-involved" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-7 py-4 border border-[#F5F7FA]/25 text-[#F5F7FA] hover:border-[#F5F7FA]/60 transition-colors duration-200">
                Get Involved
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Floating promo card */}
        <FloatCard
          delay={0.9}
          rotate={-2}
          className="absolute bottom-20 right-6 md:bottom-28 md:right-16 min-w-[180px] md:min-w-[210px]"
        >
          <div className="label text-[#D71920] mb-1.5">Promoting Field Hockey</div>
          <div className="font-display font-black uppercase text-[#F5F7FA] text-lg md:text-xl leading-[0.95]">
            Ghana → Africa
          </div>
        </FloatCard>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-6 md:left-12 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
            <ChevronDown size={14} className="text-[#F5F7FA]/30" />
          </motion.div>
          <span className="label text-[#F5F7FA]/25 text-[0.55rem]">Scroll</span>
        </motion.div>
      </section>

      {/* ── 2. IMPACT STATS ── */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-[#071A3D]">
        <motion.div className="absolute inset-0 opacity-[0.07] top-[-20%] h-[140%]" style={{ y: bgY }}>
          <img src="https://images.unsplash.com/photo-1780509459545-8618d4789bdb?w=1920&h=600&fit=crop&auto=format" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </motion.div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-10 md:mb-14">Growing the Game</div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Stats as floating cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 5, suffix: '', label: 'Active Programmes' },
                { value: 12, suffix: '+', label: 'Event Types' },
                { value: 3, suffix: '', label: 'FIH-Status Officials' },
                { value: 1, suffix: '', label: 'Nation, Many Visions' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="float-card p-6 md:p-7"
                  style={{ rotate: `${i % 2 === 0 ? 1 : -1.2}deg` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.55 }}
                >
                  <Stat value={s.value} suffix={s.suffix} label={s.label} />
                </motion.div>
              ))}
            </div>
            {/* Descriptor */}
            <Reveal delay={0.15}>
              <div>
                <BlurText
                  text="Promoting Field Hockey Across Ghana & Africa"
                  className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-5"
                  delay={0.15}
                />
                <p className="text-[#F5F7FA]/50 text-sm leading-relaxed mb-6">
                  Ball &amp; Stick grew from a passion for excellence in the Field Hockey fraternity, with an ambition to grow the sport across Africa and develop talent in Ghana for the world stage. We have experienced personnel including FIH-status umpires, technical officials, and media and marketing expertise.
                </p>
                <Link to="/about" className="inline-flex items-center gap-1.5 label text-[#D71920] hover:text-[#F5F7FA] transition-colors">
                  Our Story <ArrowRight size={11} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE DO — B&S ARMS ── */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <Reveal>
              <div>
                <div className="label text-[#D71920] mb-3">What We Do</div>
                <BlurText
                  text="Five Arms, One Vision"
                  className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]"
                  delay={0.2}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/what-we-do" className="label text-[#F5F7FA]/40 hover:text-[#D71920] transition-colors flex items-center gap-1.5 shrink-0">
                See all services <ArrowUpRight size={12} />
              </Link>
            </Reveal>
          </div>

          {/* Central image with overlapping arm cards */}
          <div className="relative">
            <div className="relative aspect-[16/7] md:aspect-[21/8] overflow-hidden bg-[#071A3D]">
              <img
                src="https://images.unsplash.com/photo-1613332738142-c79288f25e09?w=1600&h=700&fit=crop&auto=format"
                alt="Ball & Stick Ghana in action"
                className="w-full h-full object-cover opacity-40"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020B1C]/80 via-transparent to-[#020B1C]/80" />
            </div>

            {/* Floating arm cards — desktop: spread across image; mobile: grid below */}
            <div className="hidden md:grid grid-cols-5 gap-3 mt-3">
              {BS_ARMS.map((arm, i) => (
                <FloatCard key={arm.code} delay={i * 0.07} rotate={i % 2 === 0 ? 0.8 : -0.8}>
                  <div className="label text-[#D71920] mb-2">{arm.code}</div>
                  <div className="font-display font-black uppercase text-[#F5F7FA] text-lg leading-[0.9] mb-2" style={{ whiteSpace: 'pre-line' }}>
                    {arm.title}
                  </div>
                  <p className="text-[#F5F7FA]/40 text-[0.78rem] leading-relaxed">{arm.desc}</p>
                </FloatCard>
              ))}
            </div>

            {/* Mobile: stacked grid */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              {BS_ARMS.map((arm, i) => (
                <motion.div
                  key={arm.code}
                  className="float-card p-5"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="label text-[#D71920] mb-2">{arm.code}</div>
                  <div className="font-display font-black uppercase text-[#F5F7FA] text-lg leading-[0.9] mb-2">{arm.title.replace('\n', ' ')}</div>
                  <p className="text-[#F5F7FA]/40 text-[0.78rem] leading-relaxed">{arm.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. GALLERY COLLECTIONS PREVIEW ── */}
      <section className="py-20 md:py-28 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <Reveal>
              <div>
                <div className="label text-[#D71920] mb-3">Gallery</div>
                <BlurText
                  text="The Archive"
                  className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]"
                  delay={0.2}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/gallery" className="label text-[#F5F7FA]/40 hover:text-[#D71920] transition-colors flex items-center gap-1.5 shrink-0">
                Full gallery <ArrowUpRight size={12} />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Large featured collection */}
            {gallery.length > 0 && (
              <Reveal>
                <Link to="/gallery" className="block relative overflow-hidden group lg:col-span-3 aspect-[4/3] lg:h-[440px] bg-[#0a1e50]">
                  <img src={gallery[0].image_url || 'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=800&h=600&fit=crop&auto=format'} alt={gallery[0].name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/90 via-transparent to-transparent" />
                  {/* Floating category card */}
                  <FloatCard delay={0.3} rotate={-1.5} className="absolute top-4 right-4">
                    <div className="label text-[#D71920] text-[0.58rem]">{gallery[0].category}</div>
                  </FloatCard>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]" style={{ fontSize: 'clamp(1.3rem, 3vw, 2.8rem)', whiteSpace: 'pre-line' }}>
                      {gallery[0].name}
                    </h3>
                    <div className="mt-3 label text-[#D71920] flex items-center gap-1.5">Browse <ArrowRight size={11} /></div>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* Right column */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              {gallery.slice(1, 3).map((col, i) => (
                <Reveal key={col.category + i} delay={0.1 + i * 0.1}>
                  <Link to="/gallery" className="block relative overflow-hidden group aspect-[4/3] lg:flex-1 bg-[#0a1e50]">
                    <img src={col.image_url || 'https://images.unsplash.com/photo-1613332738142-c79288f25e09?w=800&h=600&fit=crop&auto=format'} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/90 to-transparent" />
                    <FloatCard delay={0.3 + i * 0.1} rotate={1.2} className="absolute top-3 right-3">
                      <div className="label text-[#D71920] text-[0.58rem]">{col.category}</div>
                    </FloatCard>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="font-display font-black uppercase text-[#F5F7FA] text-xl leading-[0.9]" style={{ whiteSpace: 'pre-line' }}>
                        {col.name}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. EVENTS ── */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <Reveal>
              <div>
                <div className="label text-[#D71920] mb-3">Events</div>
                <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]" style={{ fontSize: 'clamp(1.8rem, 5vw, 5.5rem)' }}>
                  On the<br /><span className="text-outline">Calendar</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Link to="/events" className="label text-[#F5F7FA]/40 hover:text-[#D71920] transition-colors flex items-center gap-1.5 shrink-0">
                All events <ArrowUpRight size={12} />
              </Link>
            </Reveal>
          </div>

          {/* Featured event with floating card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Reveal>
              <div className="relative overflow-hidden aspect-[4/3] bg-[#071A3D] group">
                <img
                  src="https://images.unsplash.com/photo-1613425295457-ff05c1b63e23?w=800&h=600&fit=crop&auto=format"
                  alt="Hockey event"
                  className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/80 to-transparent" />
                {/* Floating event card */}
                <FloatCard delay={0.3} rotate={2} className="absolute top-5 right-5 min-w-[140px]">
                  <div className="label text-[#D71920] mb-1 text-[0.58rem]">Signature Event</div>
                  <div className="font-display font-bold uppercase text-[#F5F7FA] text-sm">HITMALL</div>
                </FloatCard>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="label text-[#D71920] mb-2">Hockey in the Mall</div>
                  <h3 className="font-display font-black uppercase text-[#F5F7FA] text-2xl md:text-3xl leading-[0.9]">
                    Taking Hockey to the City
                  </h3>
                </div>
              </div>
            </Reveal>
            <div className="flex flex-col gap-2">
              {events.slice(0, 3).map((e, i) => (
                <motion.div
                  key={e.abbr}
                  className="flex items-center gap-5 p-5 bg-[#071A3D]/60 border border-white/[0.05] hover:border-[#D71920]/25 transition-colors group"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="font-display font-black text-[#D71920]/30 group-hover:text-[#D71920]/60 transition-colors text-xs tracking-widest min-w-[50px]">
                    {e.abbr}
                  </div>
                  <div>
                    <div className="font-display font-bold uppercase text-[#F5F7FA] text-base leading-tight">{e.title}</div>
                    <div className="text-[#F5F7FA]/35 text-xs mt-0.5">{e.description}</div>
                  </div>
                </motion.div>
              ))}
              <Reveal delay={0.2}>
                <Link to="/events" className="flex items-center justify-center gap-2 p-4 border border-[#D71920]/25 hover:bg-[#D71920]/10 transition-colors label text-[#D71920]">
                  View all events <ArrowRight size={11} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PARTNERS PREVIEW ── */}
      <section className="py-14 md:py-16 border-y border-white/[0.05] bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#F5F7FA]/20 mb-8 text-center">Trusted Partners</div>
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {['Act Global', 'Harrow Sports'].map((partner, i) => (
              <motion.div
                key={partner}
                className="float-card px-8 py-4 hover:border-[#D71920]/30 transition-colors"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -3 }}
              >
                <span className="font-display font-black uppercase text-[#F5F7FA]/50 tracking-wider text-sm">{partner}</span>
              </motion.div>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="text-center mt-8">
              <Link to="/partners" className="label text-[#F5F7FA]/25 hover:text-[#D71920] transition-colors text-[0.62rem]">
                Partner with Ball &amp; Stick →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 7. FINAL CTA ── */}
      <section className="py-28 md:py-40 relative overflow-hidden bg-[#020B1C]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1597260390010-ba4dc841b04c?w=1920&h=800&fit=crop&auto=format" alt="" aria-hidden="true" className="w-full h-full object-cover opacity-[0.07]" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 text-center">
          <Reveal>
            <div className="label text-[#D71920] mb-5">Join the Movement</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] mx-auto" style={{ fontSize: 'clamp(2.2rem, 8vw, 9.5rem)' }}>
              Get Involved.
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[#F5F7FA]/45 mt-6 mb-10 max-w-md mx-auto text-sm leading-relaxed">
              Whether you&apos;re a player, a school, a sponsor, a partner, or a hockey enthusiast — there&apos;s a place for you in Ghana&apos;s hockey story.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton>
                <Link to="/get-involved" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors">
                  Get Involved
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/contact" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 border border-[#F5F7FA]/20 text-[#F5F7FA] hover:border-[#F5F7FA]/50 transition-colors">
                  Contact Us
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
