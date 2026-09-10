import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const LINKS = {
  'What We Do': [
    { label: 'B&S Play', href: '/what-we-do' },
    { label: 'B&S Media', href: '/what-we-do' },
    { label: 'B&S Global', href: '/what-we-do' },
    { label: 'B&S Event', href: '/what-we-do' },
    { label: 'B&S Foundation', href: '/what-we-do' },
  ],
  'Organisation': [
    { label: 'About Us', href: '/about' },
    { label: 'Our People', href: '/people' },
    { label: 'Partners', href: '/partners' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Events', href: '/events' },
  ],
  'Connect': [
    { label: 'Get Involved', href: '/get-involved' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'www.ballandstick.com', href: '/contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#020B1C] border-t border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="pt-14 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5 group">
              <img src="/logo_transparent.png" alt="Ball & Stick Logo" className="h-[72px] w-auto mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="font-display font-black text-[1.6rem] uppercase tracking-[0.1em] text-[#F5F7FA] leading-none">
                Ball &amp; Stick
              </div>
              <div className="font-display font-bold text-[0.6rem] tracking-[0.35em] uppercase text-[#D71920] mt-0.5">
                Ghana
              </div>
            </Link>
            <p className="text-[#F5F7FA]/40 text-sm leading-relaxed max-w-[240px] mb-6">
              Action Imagined!! — Promoting Field Hockey across Ghana and Africa.
            </p>

            {/* Contact details */}
            <div className="flex flex-col gap-2.5">
              <a href="tel:+23303034934561" className="flex items-center gap-2 text-xs text-[#F5F7FA]/35 hover:text-[#F5F7FA]/60 transition-colors">
                <Phone size={11} className="text-[#D71920] shrink-0" /> 0303 934 561
              </a>
              <a href="mailto:info@ballandstick.com" className="flex items-center gap-2 text-xs text-[#F5F7FA]/35 hover:text-[#F5F7FA]/60 transition-colors">
                <Mail size={11} className="text-[#D71920] shrink-0" /> info@ballandstick.com
              </a>
              <span className="flex items-start gap-2 text-xs text-[#F5F7FA]/25">
                <MapPin size={11} className="text-[#D71920] shrink-0 mt-0.5" />
                No. 10 Hospital Street, Spintex Road, Accra
              </span>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <div className="label text-[#F5F7FA]/20 mb-5">{group}</div>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-[0.85rem] text-[#F5F7FA]/45 hover:text-[#F5F7FA] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="label text-[#F5F7FA]/18 text-[0.62rem]">
            © {new Date().getFullYear()} Ball &amp; Stick Ghana. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <p className="label text-[#F5F7FA]/18 text-[0.62rem]">
              P.O BOX KA 16379, Airport-Accra
            </p>
            <a href="/admin" className="label text-[#F5F7FA]/12 hover:text-[#F5F7FA]/35 transition-colors text-[0.58rem] tracking-widest uppercase">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
