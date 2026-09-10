import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { School, Users, Handshake, Heart, ArrowRight } from 'lucide-react';

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

const PATHWAYS = [
  {
    Icon: School,
    title: 'For Schools',
    tagline: 'Bring hockey to your students.',
    desc: "Partner with Ball & Stick Ghana to introduce hockey into your school's PE curriculum or after-school programme. We provide coaching support, equipment, and access to inter-school competition.",
    cta: 'Register Your School',
    items: ['Equipment and materials provided', 'Qualified coaching support', 'Inter-school competition', 'Curriculum integration guidance'],
  },
  {
    Icon: Users,
    title: 'For Players',
    tagline: 'Start your hockey journey.',
    desc: 'Whether you\'re picking up a stick for the first time or looking to develop your game further, Ball & Stick Ghana connects young players with coaching, training, and competition opportunities.',
    cta: 'Sign Up as a Player',
    items: ['Access to school coaching sessions', 'Development clinics', 'Competition pathways', 'National team exposure'],
  },
  {
    Icon: Handshake,
    title: 'For Partners',
    tagline: 'Invest in the game.',
    desc: 'Align your organisation with the growth of hockey in Ghana. Partnership opportunities range from event sponsorship to programme funding to long-term strategic partnerships.',
    cta: 'Explore Partnership',
    items: ['Event and programme sponsorship', 'Brand association', 'Employee engagement', 'CSR reporting support'],
  },
  {
    Icon: Heart,
    title: 'Volunteer',
    tagline: 'Give your time to the game.',
    desc: 'From coaching and officiating to event management and administration, there are many ways to contribute your skills and passion to growing hockey in Ghana.',
    cta: 'Volunteer With Us',
    items: ['Coaching support roles', 'Event volunteering', 'Administrative support', 'Technical officiating'],
  },
];

export default function GetInvolved() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="relative pt-32 md:pt-44 pb-20 md:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1613332738142-c79288f25e09?w=1920&h=900&fit=crop&auto=format"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-12"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020B1C] via-[#020B1C]/80 to-[#020B1C]" />
        </div>
        <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">Join the Movement</div>
            <h1
              className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] max-w-4xl"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 10rem)' }}
            >
              Get
              <br />
              <span className="text-outline">Involved</span>
            </h1>
            <p className="text-[#F5F7FA]/50 mt-7 max-w-md text-sm leading-relaxed">
              There&apos;s a place for everyone in Ghana&apos;s hockey story. Find your pathway below and help us grow the game.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pathways */}
      <section className="py-4 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 gap-3">
            {PATHWAYS.map((path, i) => (
              <motion.div
                key={path.title}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#0a1e50] border border-white/[0.05] overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.08, duration: 0.55 }}
              >
                {/* Left: content */}
                <div className="p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <path.Icon size={18} className="text-[#D71920]" />
                    <span className="font-display font-bold text-[#D71920] text-sm tracking-widest uppercase">
                      {path.title}
                    </span>
                  </div>
                  <h2
                    className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-4"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)' }}
                  >
                    {path.tagline}
                  </h2>
                  <p className="text-[#F5F7FA]/50 text-sm leading-relaxed mb-7">{path.desc}</p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-6 py-3 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
                  >
                    {path.cta} <ArrowRight size={12} />
                  </Link>
                </div>

                {/* Right: feature list */}
                <div className="border-t lg:border-t-0 lg:border-l border-white/[0.05] p-8 md:p-12 flex flex-col justify-center">
                  <div className="label text-[#F5F7FA]/25 mb-6">What&apos;s included</div>
                  <ul className="flex flex-col gap-4">
                    {path.items.map(item => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1 h-1 rounded-full bg-[#D71920] mt-2 shrink-0" />
                        <span className="text-sm text-[#F5F7FA]/55 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <Reveal>
            <div className="label text-[#D71920] mb-4">Questions?</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)' }}
            >
              We&apos;d love to hear from you.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[#F5F7FA]/45 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Not sure which pathway is right for you? Get in touch and we&apos;ll help you find your place in Ghana&apos;s hockey community.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
            >
              Contact Us <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>
      </section>
    </motion.div>
  );
}
