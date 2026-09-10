import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'People', href: '/people' },
  { label: 'Partners', href: '/partners' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'bg-[#020B1C]/96 backdrop-blur-md border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none group">
          <img src="/logo_transparent.png" alt="Ball & Stick Logo" className="h-14 md:h-16 w-auto drop-shadow-md" />
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-[1.15rem] md:text-[1.3rem] tracking-[0.12em] uppercase text-[#F5F7FA] transition-colors group-hover:text-white">
              Ball &amp; Stick
            </span>
            <span className="font-display font-bold text-[0.6rem] tracking-[0.35em] uppercase text-[#D71920] mt-[1px]">
              Ghana
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `label transition-colors duration-200 ${
                  isActive ? 'text-[#D71920]' : 'text-[#F5F7FA]/50 hover:text-[#F5F7FA]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/get-involved"
            className="hidden md:block font-display font-bold text-[0.65rem] tracking-[0.2em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors duration-200"
          >
            Get Involved
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-[#F5F7FA]/70 hover:text-[#F5F7FA] transition-colors p-1"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden border-t border-white/[0.06]"
          >
            <nav className="px-5 py-7 flex flex-col gap-6 bg-[#020B1C]">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045, duration: 0.25 }}
                >
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `font-display font-black text-[1.9rem] uppercase tracking-wide ${
                        isActive ? 'text-[#D71920]' : 'text-[#F5F7FA]/80'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link
                to="/get-involved"
                className="mt-1 inline-block font-display font-bold text-sm tracking-[0.2em] uppercase px-6 py-3 bg-[#D71920] text-[#F5F7FA] text-center hover:bg-[#e02028] transition-colors"
              >
                Get Involved
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
