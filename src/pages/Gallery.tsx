import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import type { GalleryCollection } from '../admin/AdminContext';

const CATS = ['All', 'HYES', 'HITMALL', 'HOSS', 'Events', 'Training', 'Schools', 'Community', 'Matches'];

export default function Gallery() {
  const [activeCat, setActiveCat] = useState('All');
  const [collections, setCollections] = useState<GalleryCollection[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox State
  const [activeCollection, setActiveCollection] = useState<GalleryCollection | null>(null);
  const [collectionImages, setCollectionImages] = useState<any[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    api.gallery.list()
      .then(data => {
        setCollections(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filtered = activeCat === 'All'
    ? collections
    : collections.filter(c => c.category === activeCat || (activeCat === 'Events' && ['HITMALL', 'HYES', 'HOSS', 'Engage ST', 'H Fair', 'Around 16', 'YCM', 'Engage CS', 'SBC', 'WOMA', 'M&M', 'YOU'].includes(c.category)));

  const openLightbox = async (col: GalleryCollection) => {
    setActiveCollection(col);
    setImageIndex(0);
    setCollectionImages([]);
    setLoadingImages(true);
    
    try {
      const imgs = await api.galleryImages.list(col.id);
      if (imgs.length === 0 && col.image_url) {
        setCollectionImages([{ id: 'cover', image_url: col.image_url }]);
      } else {
        setCollectionImages(imgs);
      }
    } catch (e) {
      console.error(e);
      if (col.image_url) setCollectionImages([{ id: 'cover', image_url: col.image_url }]);
    }
    setLoadingImages(false);
  };

  const prev = () => setImageIndex(i => (i - 1 + collectionImages.length) % collectionImages.length);
  const next = () => setImageIndex(i => (i + 1) % collectionImages.length);

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
      <section className="pt-32 md:pt-44 pb-12">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="label text-[#D71920] mb-4">Gallery</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]" style={{ fontSize: 'clamp(2.2rem, 7.5vw, 9rem)' }}>
              The Archive
              <br /><span className="text-outline">of Hockey</span>
            </h1>
            <p className="text-[#F5F7FA]/45 mt-5 max-w-lg text-sm leading-relaxed">
              A visual record of Ball &amp; Stick Ghana's events, programmes, and moments — from the streets to the summit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-4 border-y border-white/[0.05] bg-[#071A3D] sticky top-16 md:top-20 z-40">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`label text-[0.62rem] px-4 py-2 border transition-colors ${
                activeCat === c
                  ? 'bg-[#D71920] border-[#D71920] text-[#F5F7FA]'
                  : 'border-white/[0.08] text-[#F5F7FA]/40 hover:text-[#F5F7FA] hover:border-white/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* 3D Locker Room Grid */}
      <section className="py-6 pb-20 bg-[#071A3D]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((col) => (
                <motion.div
                  layout
                  key={col.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="relative aspect-[2/5] group cursor-pointer"
                  style={{ perspective: '1200px' }}
                  onClick={() => openLightbox(col)}
                >
                  {/* Inner Content (The Image inside the locker) */}
                  <div className="absolute inset-0 bg-[#020B1C] border border-[#0a1e50] shadow-inner p-2 md:p-3 overflow-hidden">
                    <img
                      src={col.image_url || 'https://images.unsplash.com/photo-1632215863153-0dae7657d0a9?w=900&h=600&fit=crop&auto=format'}
                      alt={col.name}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      loading="lazy"
                    />
                    {/* Inner locker details */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div className="label text-[#D71920] text-[0.6rem] bg-[#020B1C]/80 px-2 py-1 backdrop-blur-sm">{col.category}</div>
                      <div className="label text-[#F5F7FA] text-[0.6rem] bg-[#020B1C]/80 px-2 py-1 backdrop-blur-sm">{col.image_count} Photos</div>
                    </div>
                  </div>

                  {/* The Locker Door */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-[#1a2436] via-[#243147] to-[#121a26] border-2 border-[#3b4b66] origin-left transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-y-[105deg] flex flex-col items-center shadow-[inset_0_0_30px_rgba(0,0,0,0.6),5px_0_15px_rgba(0,0,0,0.3)] z-10"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Locker Vents / Slats */}
                    <div className="mt-8 flex flex-col gap-1.5 w-1/2">
                      {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="h-1 bg-black/60 rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.1)]" />
                      ))}
                    </div>

                    {/* Nameplate */}
                    <div className="mt-12 bg-gradient-to-b from-[#b8c2cc] to-[#8795a1] p-1 shadow-md border-t border-[#dae1e7] border-b border-[#606f7b] rounded-sm w-[70%]">
                      <div className="bg-[#f1f5f8] border border-[#606f7b] p-2 md:p-3 text-center shadow-inner">
                        <span className="font-display font-bold uppercase text-[#3d4852] text-[0.55rem] md:text-[0.65rem] block leading-tight tracking-[0.2em] truncate">{col.category}</span>
                      </div>
                    </div>

                    {/* Locker Content Title */}
                    <div className="mt-auto mb-16 px-4 text-center">
                      <h3 className="font-display font-black uppercase text-[#e2e8f0] text-xl md:text-2xl leading-[0.9] drop-shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                        {col.name}
                      </h3>
                    </div>
                    
                    {/* Locker Handle & Lock */}
                    <div className="absolute top-1/2 -mt-8 right-4 flex flex-col items-center gap-2">
                      <div className="w-3 h-16 bg-gradient-to-b from-[#e2e8f0] to-[#cbd5e1] rounded-sm shadow-md border border-[#f8fafc] flex items-center justify-center">
                        <div className="w-1 h-12 bg-[#94a3b8] rounded-full shadow-inner" />
                      </div>
                      <div className="w-4 h-6 bg-[#475569] rounded-sm shadow-md border-t border-[#94a3b8] flex items-center justify-center">
                        <div className="w-1.5 h-2 bg-black/80 rounded-full" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Featured collections list */}
      <section className="py-12 md:py-16 border-t border-white/[0.05]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="label text-[#F5F7FA]/20 mb-8">All Collections</div>
          <div className="flex flex-col border-t border-white/[0.05]">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-white/[0.05] gap-2 group cursor-pointer"
                onClick={() => openLightbox(col)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
              >
                <div className="flex items-center gap-5">
                  <span className="label text-[#D71920]/40 text-[0.6rem] w-14 shrink-0">{col.category}</span>
                  <span className="font-display font-bold uppercase text-[#F5F7FA]/60 group-hover:text-[#F5F7FA] transition-colors text-lg">
                    {col.name}
                  </span>
                </div>
                <span className="label text-[#F5F7FA]/20 text-[0.6rem]">{col.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {activeCollection && (
          <motion.div
            className="fixed inset-0 z-[100] bg-[#020B1C]/98 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveCollection(null)}
          >
            <button className="absolute top-5 right-5 text-[#F5F7FA]/50 hover:text-[#F5F7FA] transition-colors z-50" onClick={() => setActiveCollection(null)} aria-label="Close">
              <X size={24} />
            </button>

            {loadingImages ? (
              <div className="flex flex-col items-center text-[#F5F7FA]/50 gap-3">
                <Loader2 size={24} className="animate-spin" />
                <span className="label text-xs">Loading photos...</span>
              </div>
            ) : (
              <>
                {collectionImages.length > 1 && (
                  <button className="absolute left-4 md:left-8 text-[#F5F7FA]/40 hover:text-[#F5F7FA] transition-colors p-2 z-50" onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous">
                    <ChevronLeft size={28} />
                  </button>
                )}

                {collectionImages.length > 0 && (
                  <motion.div
                    key={imageIndex}
                    className="flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    onClick={e => e.stopPropagation()}
                  >
                    <img
                      src={collectionImages[imageIndex]?.image_url}
                      alt={activeCollection.name}
                      className="max-w-[88vw] max-h-[75vh] object-contain"
                    />
                    <div className="mt-4 text-center">
                      <div className="label text-[#D71920] mb-1">{activeCollection.category}</div>
                      <div className="font-display font-black uppercase text-[#F5F7FA] text-lg">{activeCollection.name}</div>
                      <p className="text-[#F5F7FA]/40 text-xs mt-1">{activeCollection.description}</p>
                    </div>
                  </motion.div>
                )}

                {collectionImages.length > 1 && (
                  <button className="absolute right-4 md:right-8 text-[#F5F7FA]/40 hover:text-[#F5F7FA] transition-colors p-2 z-50" onClick={e => { e.stopPropagation(); next(); }} aria-label="Next">
                    <ChevronRight size={28} />
                  </button>
                )}
                
                {collectionImages.length > 0 && (
                  <div className="absolute bottom-5 label text-[#F5F7FA]/25 text-[0.6rem]">
                    {imageIndex + 1} / {collectionImages.length}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
