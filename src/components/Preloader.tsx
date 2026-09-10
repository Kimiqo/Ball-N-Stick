import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function Preloader({ onComplete }: { onComplete?: () => void }) {
  const location = useLocation();
  const [hasPlayed] = useState(() => sessionStorage.getItem('preloaderPlayed') === 'true');
  const isHome = location.pathname === '/';
  
  const [loading, setLoading] = useState(!hasPlayed && isHome);

  const handleVideoEnd = () => {
    setLoading(false);
    sessionStorage.setItem('preloaderPlayed', 'true');
    setTimeout(() => onComplete && onComplete(), 800); // Wait for exit animation
  };

  useEffect(() => {
    if (!loading) {
      if (onComplete) onComplete();
      return;
    }
    // Safety fallback in case video fails to play or load
    const timer = setTimeout(() => {
      if (loading) {
        handleVideoEnd();
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [loading, onComplete]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <video
            src="/logo_animation.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
