import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import type { Story } from '../admin/AdminContext';

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

const CATS = ['All', 'Development', 'Events', 'Officiating', 'Community', 'Partnership'];

export default function Stories() {
  const [cat, setCat] = useState('All');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stories.list()
      .then(data => {
        // Only show published stories on the public page
        setStories(data.filter(s => s.published));
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-white">Loading...</div>;
  }

  const filtered = cat === 'All' ? stories : stories.filter(s => s.category === cat);
  const featured = filtered.find(s => s.featured) || filtered[0];
  const rest = filtered.filter(s => s !== featured);

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
            <div className="label text-[#D71920] mb-4">Stories</div>
            <h1
              className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]"
              style={{ fontSize: 'clamp(3.5rem, 7.5vw, 9rem)' }}
            >
              From the
              <br />
              <span className="text-outline">Field</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-5 border-y border-white/[0.05] bg-[#071A3D] sticky top-16 md:top-20 z-40">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`label text-[0.62rem] px-4 py-2 border transition-colors ${
                cat === c
                  ? 'bg-[#D71920] border-[#D71920] text-[#F5F7FA]'
                  : 'border-white/[0.08] text-[#F5F7FA]/40 hover:text-[#F5F7FA] hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Featured story */}
      {featured && (
        <section className="py-6 bg-[#071A3D]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="relative overflow-hidden aspect-[4/3] bg-[#0a1e50]">
                  <img
                    src={featured.image_url || 'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=800&h=500&fit=crop&auto=format'}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className="label text-[#D71920] mb-3">{featured.category}</div>
                  <h2
                    className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-5"
                    style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-[#F5F7FA]/50 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="label text-[#F5F7FA]/25 text-[0.6rem] mb-4">{featured.date}</div>
                  <button className="inline-flex items-center gap-2 font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase text-[#D71920] hover:text-[#F5F7FA] transition-colors">
                    Read Story <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Story grid */}
      <section className="py-8 pb-20 md:pb-28 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featured ? rest : filtered).map((s, i) => (
              <motion.article
                key={s.title}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
              >
                <div className="relative overflow-hidden aspect-[4/3] bg-[#0a1e50] mb-5">
                  <img
                    src={s.image_url || 'https://images.unsplash.com/photo-1613332738142-c79288f25e09?w=800&h=500&fit=crop&auto=format'}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#020B1C]/20" />
                </div>
                <div className="label text-[#D71920] mb-2">{s.category}</div>
                <h3
                  className="font-display font-black uppercase text-[#F5F7FA] leading-[0.9] mb-3 group-hover:text-[#D71920] transition-colors"
                  style={{ fontSize: 'clamp(1.3rem, 2vw, 1.8rem)' }}
                >
                  {s.title}
                </h3>
                <p className="text-[0.82rem] text-[#F5F7FA]/40 leading-relaxed">{s.excerpt}</p>
                <div className="mt-3 label text-[#F5F7FA]/20 text-[0.6rem]">{s.date}</div>
              </motion.article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-[#F5F7FA]/30 text-sm">
              No stories in this category yet.
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
