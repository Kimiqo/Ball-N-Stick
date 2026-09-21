import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, Mail, Phone, MapPin, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { api, uploadImage } from '../lib/api';
import { DEFAULTS, useSettings } from '../contexts/SettingsContext';
import type { SiteSettings } from '../contexts/SettingsContext';

function ImageUploader({
  label,
  description,
  url,
  onUpload
}: {
  label: string;
  description: string;
  url?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    await onUpload(e);
    setUploading(false);
  }
  return (
    <div>
      <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative aspect-video w-40 bg-[#071A3D] border border-white/10 shrink-0 overflow-hidden">
          {url ? (
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#F5F7FA]/20 text-xs text-center p-2">No image uploaded</div>
          )}
        </div>
        <div>
          <p className="text-xs text-[#F5F7FA]/40 mb-3 leading-relaxed">{description}</p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#F5F7FA] transition-colors rounded-sm border border-white/10">
            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            {uploading ? 'Uploading...' : 'Upload New Image'}
            <input type="file" className="hidden" accept="image/*" onChange={handle} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    api.settings.get().then(data => {
      if (data) setSettings({ ...DEFAULTS, ...data });
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const update = (patch: Partial<SiteSettings>) => setSettings(s => ({ ...s, ...patch }));

  const save = async () => {
    try {
      await api.settings.update(settings);
      flash('Settings saved');
      await refreshSettings();
    } catch (e) {
      flash('Error saving settings');
    }
  };

  const createUploadHandler = (key: keyof SiteSettings) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      update({ [key]: url });
      flash('Image uploaded');
    }
  };

  const createCarouselUploadHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) {
      const current = settings.hero_carousel_images || [];
      update({ hero_carousel_images: [...current, url] });
      flash('Carousel image added');
    }
  };

  const removeCarouselImage = (index: number) => {
    const current = settings.hero_carousel_images || [];
    update({ hero_carousel_images: current.filter((_, i) => i !== index) });
  };



  const input = "w-full bg-white/[0.03] border border-white/[0.08] text-[#F5F7FA] placeholder-[#F5F7FA]/15 text-sm px-3 py-2.5 outline-none focus:border-[#D71920]/40 transition-colors";

  if (loading) return <div className="text-white">Loading settings...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">Settings</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">Site configuration and global variables</p>
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

        {/* Global Media */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <ImageIcon size={13} className="text-[#D71920]" />
            <div className="label text-[#F5F7FA]/40" style={{ fontSize: '0.62rem' }}>Page Images</div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="border border-white/[0.05] p-5 bg-white/[0.02]">
              <label className="label text-[#F5F7FA]/40 block mb-3 text-xs">Homepage Hero Carousel</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {(settings.hero_carousel_images || []).map((img, i) => (
                  <div key={i} className="relative aspect-video bg-[#071A3D] overflow-hidden group">
                    <img src={img} className="w-full h-full object-cover" />
                    <button onClick={() => removeCarouselImage(i)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-red-400 font-bold">
                      Remove
                    </button>
                  </div>
                ))}
                <label className="relative aspect-video bg-white/[0.03] border border-dashed border-white/20 hover:border-white/40 cursor-pointer flex flex-col items-center justify-center text-[#F5F7FA]/40 transition-colors">
                  <Upload size={14} className="mb-2" />
                  <span className="text-[0.65rem] uppercase font-bold tracking-wider">Add Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={createCarouselUploadHandler} />
                </label>
              </div>
            </div>
            
            <ImageUploader 
              label="Homepage Static Hero (Fallback)" 
              description="Used if carousel is empty." 
              url={settings.hero_image_url} 
              onUpload={createUploadHandler('hero_image_url')} 
            />
            <ImageUploader 
              label="Homepage 'Five Arms' Section Image" 
              description="Displayed in the 'What We Do' section on the homepage." 
              url={settings.home_whatwedo_image_url} 
              onUpload={createUploadHandler('home_whatwedo_image_url')} 
            />
            <ImageUploader 
              label="About Page Hero Image" 
              description="Displayed at the top of the About page." 
              url={settings.about_image_url} 
              onUpload={createUploadHandler('about_image_url')} 
            />
            <ImageUploader 
              label="What We Do - B&S Play" 
              description="Image for the Training & Development section." 
              url={settings.whatwedo_play_image_url} 
              onUpload={createUploadHandler('whatwedo_play_image_url')} 
            />
            <ImageUploader 
              label="What We Do - B&S Media" 
              description="Image for the Hockey Media section." 
              url={settings.whatwedo_media_image_url} 
              onUpload={createUploadHandler('whatwedo_media_image_url')} 
            />
            <ImageUploader 
              label="What We Do - B&S Global" 
              description="Image for the International Reach section." 
              url={settings.whatwedo_global_image_url} 
              onUpload={createUploadHandler('whatwedo_global_image_url')} 
            />
            <ImageUploader 
              label="What We Do - B&S Event" 
              description="Image for the Events & Programmes section." 
              url={settings.whatwedo_event_image_url} 
              onUpload={createUploadHandler('whatwedo_event_image_url')} 
            />
            <ImageUploader 
              label="What We Do - B&S Foundation" 
              description="Image for the Foundation & Community section." 
              url={settings.whatwedo_foundation_image_url} 
              onUpload={createUploadHandler('whatwedo_foundation_image_url')} 
            />
            <ImageUploader 
              label="Partners Page Background" 
              description="Background image for the Partners page." 
              url={settings.partners_bg_image_url} 
              onUpload={createUploadHandler('partners_bg_image_url')} 
            />
            <ImageUploader 
              label="Schools Hero Background" 
              description="Background image for the top of the Schools page." 
              url={settings.schools_hero_image_url} 
              onUpload={createUploadHandler('schools_hero_image_url')} 
            />
            <ImageUploader 
              label="Schools Middle Section Image" 
              description="Image for the middle section of the Schools page." 
              url={settings.schools_mid_image_url} 
              onUpload={createUploadHandler('schools_mid_image_url')} 
            />
            <ImageUploader 
              label="Get Involved Background" 
              description="Background image for the Get Involved page." 
              url={settings.getinvolved_bg_image_url} 
              onUpload={createUploadHandler('getinvolved_bg_image_url')} 
            />
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
        <section>
          <div className="flex items-center gap-2 mb-5">
            <MapPin size={13} className="text-[#D71920]" />
            <div className="label text-[#F5F7FA]/40" style={{ fontSize: '0.62rem' }}>Physical Address</div>
          </div>
          <div className="grid grid-cols-1 gap-4">
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
