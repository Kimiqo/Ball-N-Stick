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

const SERVICES = [
  { n: '01', title: 'Player Scouting & Management', desc: 'Identifying talented players across Ghana and managing their development pathways toward national and international opportunities.' },
  { n: '02', title: 'Hockey Magazine Production', desc: 'Producing dedicated hockey publications that document the sport, celebrate achievements, and grow hockey culture in Ghana.' },
  { n: '03', title: 'Hockey Match Video Production', desc: 'Professional match and event video production to broadcast Ghanaian hockey to wider audiences locally and internationally.' },
  { n: '04', title: 'Promotional Events Organizing', desc: 'Conceiving and executing high-impact hockey events that generate enthusiasm, participation, and visibility for the sport.' },
  { n: '05', title: 'Sponsorship Consultancy', desc: 'Connecting hockey programmes and events with corporate partners and sponsors who believe in the power of sport.' },
  { n: '06', title: 'Hockey Youth Empowerment', desc: 'Using field hockey as a vehicle for youth development, leadership, life skills, and community empowerment.' },
  { n: '07', title: 'Equipment Sales & Marketing', desc: 'Supplying and marketing quality hockey equipment to schools, clubs, and individuals across Ghana.' },
  { n: '08', title: 'Hockey Street Save (HOSS)', desc: 'Bringing hockey to street communities — using the sport as a tool to reach and positively impact young people at the grassroots level.' },
];

const ARMS = [
  {
    code: 'B&S Play',
    title: 'Training & Development',
    img: 'https://images.unsplash.com/photo-1624100767307-1952d316520a?w=800&h=600&fit=crop&auto=format',
    desc: 'The technical engine of Ball & Stick. B&S Play trains players, coaches, umpires and table officials, and delivers hockey-related development activities for individuals and institutions at all levels.',
    focus: ['Player training', 'Coach development', 'Umpire training', 'Table official certification', 'Development activities'],
  },
  {
    code: 'B&S Media',
    title: 'Hockey Media',
    img: 'https://images.unsplash.com/photo-1597260390010-ba4dc841b04c?w=800&h=600&fit=crop&auto=format',
    desc: 'B&S Media builds the media footprint of Ghanaian hockey. From printed magazines to television, radio, live match coverage, and online photo galleries, we ensure hockey has the visibility it deserves.',
    focus: ['Hockey magazines', 'TV & radio productions', 'Live match productions', 'Online hockey photo galleries'],
  },
  {
    code: 'B&S Global',
    title: 'International Reach',
    img: 'https://images.unsplash.com/photo-1780509459545-8618d4789bdb?w=800&h=600&fit=crop&auto=format',
    desc: "B&S Global takes Ghana's hockey talent and ambition to the world stage — promoting the sport internationally, linking Ghanaian players to foreign teams, building international partnerships, and securing global sponsorship.",
    focus: ['International hockey promotion', 'Player placement to foreign teams', 'International partnerships', 'National & international sponsorship'],
  },
  {
    code: 'B&S Event',
    title: 'Events & Programmes',
    img: 'https://images.unsplash.com/photo-1613425295457-ff05c1b63e23?w=800&h=600&fit=crop&auto=format',
    desc: 'B&S Event is where hockey comes alive in the community. From refresher courses and seminars to hockey camps, tournaments, festive games, Hockey for the Public, player scouting events, and the flagship 1M4H campaign.',
    focus: ['Refresher courses & seminars', 'Hockey camps', 'Tournaments', 'Festive hockey games', 'Hockey for the Public', 'Player scouting events', '1M4H — One Million For Hockey'],
  },
  {
    code: 'B&S Foundation',
    title: 'Foundation & Community',
    img: 'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=800&h=600&fit=crop&auto=format',
    desc: 'B&S Foundation uses hockey as a vehicle for social impact — providing sponsorship for brilliant hockey-playing students, linking players with hockey-playing schools outside Ghana, and running Save a Street Child With Hockey.',
    focus: ['Sponsorship for student-athletes', 'School-to-school linking (international)', 'Save a Street Child With Hockey'],
  },
];

export default function WhatWeDo() {
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
            <div className="label text-[#D71920] mb-4">What We Do</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] max-w-4xl" style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)' }}>
              Five Arms,
              <br /><span className="text-outline">Eight Services</span>
            </h1>
            <p className="text-[#F5F7FA]/50 mt-6 max-w-lg text-sm leading-relaxed">
              Ball &amp; Stick Ghana operates through five strategic arms, delivering eight core services to promote and develop field hockey across Ghana and Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Services grid */}
      <section className="pb-16 md:pb-20 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-10">Core Services</div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.n}
                className="bg-[#071A3D] p-7 group"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
              >
                <div className="font-display font-bold text-[#D71920] text-[0.7rem] tracking-[0.2em] mb-4">{s.n}</div>
                <h3 className="font-display font-black uppercase text-[#F5F7FA] text-lg md:text-xl leading-[0.9] mb-3">{s.title}</h3>
                <p className="text-[#F5F7FA]/40 text-[0.82rem] leading-relaxed">{s.desc}</p>
                <div className="mt-5 h-px w-0 group-hover:w-6 bg-[#D71920] transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Five arms — detailed */}
      {ARMS.map((arm, i) => (
        <section key={arm.code} className={`py-16 md:py-24 ${i % 2 === 0 ? '' : 'bg-[#071A3D]'}`}>
          <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 !== 0 ? 'lg:[direction:rtl]' : ''}`}>
              <Reveal>
                <div className={`relative aspect-[4/3] overflow-hidden bg-[#0a1e50] ${i % 2 !== 0 ? '[direction:ltr]' : ''}`}>
                  <img src={arm.img} alt={arm.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020B1C]/40 to-transparent" />
                  {/* Floating arm label */}
                  <motion.div
                    className="float-card absolute top-4 left-4 px-4 py-2"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="label text-[#D71920] text-[0.6rem]">{arm.code}</span>
                  </motion.div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className={i % 2 !== 0 ? '[direction:ltr]' : ''}>
                  <div className="label text-[#D71920] mb-3">{arm.code}</div>
                  <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-5" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
                    {arm.title}
                  </h2>
                  <p className="text-[#F5F7FA]/55 text-sm leading-relaxed mb-7">{arm.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {arm.focus.map(f => (
                      <span key={f} className="label text-[0.6rem] text-[#F5F7FA]/35 border border-white/[0.08] px-3 py-1.5">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-24 bg-[#071A3D] text-center border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <h2 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 7rem)' }}>
              Want to be part of this?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/get-involved" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors flex items-center gap-2">
                Get Involved <ArrowRight size={14} />
              </Link>
              <Link to="/contact" className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 border border-[#F5F7FA]/20 text-[#F5F7FA] hover:border-[#F5F7FA]/50 transition-colors">
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
