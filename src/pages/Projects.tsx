import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

// Demo project data — replace with CMS content
const PROJECTS = [
  {
    title: 'Hockey in Schools',
    cat: 'Schools Programme',
    desc: 'Integrating structured hockey coaching into school curricula and after-school programmes across Ghana, giving students access to equipment, qualified coaching, and inter-school competition.',
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1613332738142-c79288f25e09?w=900&h=600&fit=crop&auto=format',
    tall: true,
  },
  {
    title: 'Next Generation Development Programme',
    cat: 'Youth Development',
    desc: 'A structured pathway for talented young athletes, combining technical hockey training with leadership development, mentorship, and character-building activities.',
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=700&h=500&fit=crop&auto=format',
    tall: false,
  },
  {
    title: 'Umpire Training Initiative',
    cat: 'Officiating',
    desc: "Building Ghana's pipeline of trained, certified hockey umpires and technical officials — essential infrastructure for the sport's long-term growth.",
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1780509459545-8618d4789bdb?w=700&h=500&fit=crop&auto=format',
    tall: false,
  },
  {
    title: 'Schools Hockey Festival',
    cat: 'Events',
    desc: 'An annual celebration of school hockey bringing together partner schools for competition, skill showcases, and community building around the sport.',
    status: 'Annual',
    img: 'https://images.unsplash.com/photo-1613425295457-ff05c1b63e23?w=900&h=600&fit=crop&auto=format',
    tall: false,
  },
  {
    title: 'Community Outreach Programme',
    cat: 'Partnerships',
    desc: 'Working with community organisations, local government, and development partners to expand access to hockey beyond the school gate.',
    status: 'Active',
    img: 'https://images.unsplash.com/photo-1627423895015-4db87342a410?w=700&h=500&fit=crop&auto=format',
    tall: false,
  },
];

export default function Projects() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">Our Work</div>
            <h1
              className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]"
              style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)' }}
            >
              Projects &amp;
              <br />
              <span className="text-outline">Initiatives</span>
            </h1>
            <p className="text-[#F5F7FA]/50 mt-6 max-w-lg text-sm leading-relaxed">
              Demo content — these projects will be managed through the CMS and updated by the Ball &amp; Stick team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured project — large */}
      <section className="pb-4 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="relative overflow-hidden group h-[50vh] md:h-[65vh] bg-[#0a1e50]">
              <img
                src={PROJECTS[0].img}
                alt={PROJECTS[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/90 via-[#020B1C]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="label text-[#D71920]">{PROJECTS[0].cat}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D71920]/50" />
                  <span className="label text-[#D71920]">{PROJECTS[0].status}</span>
                </div>
                <h2
                  className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] max-w-2xl"
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)' }}
                >
                  {PROJECTS[0].title}
                </h2>
                <p className="text-[#F5F7FA]/55 mt-4 max-w-lg text-sm leading-relaxed">
                  {PROJECTS[0].desc}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-4 pb-20 md:pb-28 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PROJECTS.slice(1).map((p, i) => (
              <motion.article
                key={p.title}
                className="group relative overflow-hidden bg-[#0a1e50] aspect-[4/3]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/90 via-[#020B1C]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="label text-[#D71920] text-[0.58rem]">{p.cat}</span>
                    <span className="label text-[#D71920] text-[0.58rem]">{p.status}</span>
                  </div>
                  <h3
                    className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]"
                    style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)' }}
                  >
                    {p.title}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <Reveal>
            <div>
              <div className="label text-[#D71920] mb-3">Get Involved</div>
              <h2
                className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9]"
                style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
              >
                Want to support our work?
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/get-involved"
              className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Get Involved <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
