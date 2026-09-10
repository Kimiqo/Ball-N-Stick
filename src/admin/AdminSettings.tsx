import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Server, Globe, Mail, Phone, MapPin } from 'lucide-react';

type SiteSettings = {
  tagline: string;
  mission: string;
  phone1: string;
  phone2: string;
  emailGeneral: string;
  emailCeo: string;
  addressStreet: string;
  addressCity: string;
  addressPostal: string;
  website: string;
  ceoName: string;
};

const DEFAULTS: SiteSettings = {
  tagline: 'Action Imagined!!',
  mission: 'To promote Field Hockey across Ghana and Africa.',
  phone1: '0303 934 561',
  phone2: '0244 241 809',
  emailGeneral: 'info@ballandstick.com',
  emailCeo: 'kojo@ballandstick.com',
  addressStreet: 'No. 10 Hospital Street, Spintex Road, Accra',
  addressCity: 'Accra, Ghana',
  addressPostal: 'P.O BOX KA 16379, Airport-Accra',
  website: 'www.ballandstick.com',
  ceoName: 'Kojo Lumour Ameye',
};

function load(): SiteSettings {
  try {
    const stored = localStorage.getItem('bs_settings');
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(load);
  const [toast, setToast] = useState('');

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const update = (patch: Partial<SiteSettings>) => setSettings(s => ({ ...s, ...patch }));

  const save = () => {
    localStorage.setItem('bs_settings', JSON.stringify(settings));
    flash('Settings saved');
  };

  const input = "w-full bg-white/[0.03] border border-white/[0.08] text-[#F5F7FA] placeholder-[#F5F7FA]/15 text-sm px-3 py-2.5 outline-none focus:border-[#D71920]/40 transition-colors";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">Settings</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">Site configuration and contact information</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {toast && (
              <motion.span className="flex items-center gap-1.5 text-green-400 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Check size={12} /> {toast}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={save}
            className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
            style={{ fontSize: '0.65rem' }}
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* CMS integration status */}
      <div className="bg-[#071A3D] border border-white/[0.06] p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Server size={13} className="text-[#F5F7FA]/30" />
          <span className="label text-[#F5F7FA]/30" style={{ fontSize: '0.6rem' }}>CMS Integration Status</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Payload CMS', status: 'Not connected', note: 'Recommended backend' },
            { label: 'Cloudinary', status: 'Not connected', note: 'Media storage' },
            { label: 'Live API', status: 'Prototype mode', note: 'Using localStorage' },
          ].map(item => (
            <div key={item.label} className="bg-white/[0.02] border border-white/[0.05] px-4 py-3">
              <div className="font-medium text-[#F5F7FA]/55 text-xs mb-1">{item.label}</div>
              <div className="label text-[#F5F7FA]/25" style={{ fontSize: '0.58rem' }}>{item.status}</div>
              <div className="label text-[#F5F7FA]/15 mt-1" style={{ fontSize: '0.55rem' }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Globe size={13} className="text-[#D71920]" />
            <div className="label text-[#F5F7FA]/40" style={{ fontSize: '0.62rem' }}>Brand & Mission</div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Tagline</label>
              <input className={input} value={settings.tagline} onChange={e => update({ tagline: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Mission Statement</label>
              <textarea className={`${input} resize-none`} rows={3} value={settings.mission} onChange={e => update({ mission: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>CEO / Founder Name</label>
              <input className={input} value={settings.ceoName} onChange={e => update({ ceoName: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Website</label>
              <input className={input} value={settings.website} onChange={e => update({ website: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Mail size={13} className="text-[#D71920]" />
            <div className="label text-[#F5F7FA]/40" style={{ fontSize: '0.62rem' }}>Contact Information</div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <Phone size={11} className="text-[#F5F7FA]/20" />
              <span className="label text-[#F5F7FA]/20" style={{ fontSize: '0.58rem' }}>Phone Numbers</span>
            </div>
            <div>
              <label className="label text-[#F5F7FA]/20 block mb-1.5" style={{ fontSize: '0.56rem' }}>Office</label>
              <input className={input} value={settings.phone1} onChange={e => update({ phone1: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/20 block mb-1.5" style={{ fontSize: '0.56rem' }}>Mobile</label>
              <input className={input} value={settings.phone2} onChange={e => update({ phone2: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 mt-2 mb-1">
              <Mail size={11} className="text-[#F5F7FA]/20" />
              <span className="label text-[#F5F7FA]/20" style={{ fontSize: '0.58rem' }}>Email Addresses</span>
            </div>
            <div>
              <label className="label text-[#F5F7FA]/20 block mb-1.5" style={{ fontSize: '0.56rem' }}>General</label>
              <input type="email" className={input} value={settings.emailGeneral} onChange={e => update({ emailGeneral: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/20 block mb-1.5" style={{ fontSize: '0.56rem' }}>CEO</label>
              <input type="email" className={input} value={settings.emailCeo} onChange={e => update({ emailCeo: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Address */}
        <section className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={13} className="text-[#D71920]" />
            <div className="label text-[#F5F7FA]/40" style={{ fontSize: '0.62rem' }}>Physical Address</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Street Address</label>
              <input className={input} value={settings.addressStreet} onChange={e => update({ addressStreet: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>City</label>
              <input className={input} value={settings.addressCity} onChange={e => update({ addressCity: e.target.value })} />
            </div>
            <div>
              <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Postal Address</label>
              <input className={input} value={settings.addressPostal} onChange={e => update({ addressPostal: e.target.value })} />
            </div>
          </div>
        </section>
      </div>

      {/* Save at bottom */}
      <div className="mt-8 pt-6 border-t border-white/[0.05] flex justify-end">
        <button
          onClick={save}
          className="font-display font-bold tracking-[0.18em] uppercase px-8 py-3 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
          style={{ fontSize: '0.65rem' }}
        >
          Save Settings
        </button>
      </div>
    </motion.div>
  );
}
