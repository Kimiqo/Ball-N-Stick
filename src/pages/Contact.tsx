import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { AnimatePresence } from 'framer-motion';

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

type FormState = { name: string; email: string; subject: string; message: string };
const SUBJECTS = ['General Enquiry', 'Schools Partnership', 'Sponsorship & Partnership', 'Media & Press', 'Player Enquiry', 'Equipment', 'Other'];

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);

  const showToast = (message: string, type: 'error' | 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.subject) e.subject = 'Please select a subject';
    if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_placeholder';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'oE5aY_2jmhM062Wan';
      
      const payload = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: form.name,
          reply_to: form.email,
          subject: form.subject,
          message: form.message
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        showToast("Oops! There was a problem sending your message.", "error");
      }
    } catch (error) {
      showToast("Oops! There was a network error.", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FormState) =>
    `w-full bg-white/[0.04] border text-[#F5F7FA] placeholder-[#F5F7FA]/20 text-sm px-4 py-3 outline-none transition-colors ${
      errors[field] ? 'border-[#D71920]/50 focus:border-[#D71920]/70' : 'border-white/[0.08] focus:border-[#D71920]/40'
    }`;

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
            <div className="label text-[#D71920] mb-4">Contact</div>
            <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-[0.86]" style={{ fontSize: 'clamp(2.2rem, 7.5vw, 9rem)' }}>
              Get in
              <br /><span className="text-outline">Touch</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact layout */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Info */}
          <Reveal>
            <div className="lg:col-span-2">
              <p className="text-[#F5F7FA]/70 text-sm leading-relaxed mb-10">
                Whether you&apos;re a school, a potential partner, a player, or just someone interested in field hockey in Ghana — we&apos;d love to hear from you.
              </p>

              <div className="flex flex-col gap-6 mb-10">
                <div>
                  <div className="label text-[#F5F7FA]/20 mb-2">General</div>
                  <a href={`tel:${settings.phone1.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm text-[#F5F7FA]/55 hover:text-[#F5F7FA] transition-colors mb-1.5">
                    <Phone size={12} className="text-[#D71920] shrink-0" /> {settings.phone1}
                  </a>
                  {settings.phone2 && (
                    <a href={`tel:${settings.phone2.replace(/\s+/g, '')}`} className="flex items-center gap-2 text-sm text-[#F5F7FA]/55 hover:text-[#F5F7FA] transition-colors mb-1.5">
                      <Phone size={12} className="text-[#D71920] shrink-0" /> {settings.phone2}
                    </a>
                  )}
                  <a href={`mailto:${settings.emailGeneral}`} className="flex items-center gap-2 text-sm text-[#F5F7FA]/55 hover:text-[#F5F7FA] transition-colors">
                    <Mail size={12} className="text-[#D71920] shrink-0" /> {settings.emailGeneral}
                  </a>
                </div>
                <div>
                  <div className="label text-[#F5F7FA]/20 mb-2">CEO — {settings.ceoName}</div>
                  <a href={`mailto:${settings.emailCeo}`} className="flex items-center gap-2 text-sm text-[#F5F7FA]/55 hover:text-[#F5F7FA] transition-colors">
                    <Mail size={12} className="text-[#D71920] shrink-0" /> {settings.emailCeo}
                  </a>
                </div>
                <div>
                  <div className="label text-[#F5F7FA]/20 mb-2">Physical Address</div>
                  <p className="flex items-start gap-2 text-sm text-[#F5F7FA]/70 leading-relaxed">
                    <MapPin size={12} className="text-[#D71920] shrink-0 mt-0.5" />
                    {settings.addressStreet},<br />{settings.addressCity}
                  </p>
                </div>
                <div>
                  <div className="label text-[#F5F7FA]/20 mb-2">Postal Address</div>
                  <p className="text-sm text-[#F5F7FA]/70">{settings.addressPostal}</p>
                </div>
              </div>

              <div className="divider mb-6" />
              <div className="label text-[#F5F7FA]/20 mb-4">{settings.website}</div>
            </div>
          </Reveal>

          {/* Form */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              {submitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-20 text-center gap-5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-[#D71920]/15 border border-[#D71920]/30 flex items-center justify-center">
                    <Check size={22} className="text-[#D71920]" />
                  </div>
                  <h2 className="font-display font-black uppercase text-[#F5F7FA] text-3xl">Message sent.</h2>
                  <p className="text-[#F5F7FA]/40 text-sm max-w-xs leading-relaxed">
                    Thank you for reaching out. The Ball &amp; Stick Ghana team will respond within 3 business days.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label text-[#F5F7FA]/30 text-[0.6rem] block mb-2">Full Name *</label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass('name')} />
                      {errors.name && <p className="text-[#D71920]/70 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="label text-[#F5F7FA]/30 text-[0.6rem] block mb-2">Email Address *</label>
                      <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass('email')} />
                      {errors.email && <p className="text-[#D71920]/70 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="label text-[#F5F7FA]/30 text-[0.6rem] block mb-2">Subject *</label>
                    <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className={`${inputClass('subject')} appearance-none cursor-pointer`}>
                      <option value="" disabled>Select a subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="text-[#D71920]/70 text-xs mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="label text-[#F5F7FA]/30 text-[0.6rem] block mb-2">Message *</label>
                    <textarea rows={6} placeholder="How can we help?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={`${inputClass('message')} resize-none`} />
                    {errors.message && <p className="text-[#D71920]/70 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <div className="flex items-center gap-4 mt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-8 py-4 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {loading ? 'Sending...' : <><span>Send Message</span> <ArrowRight size={14} /></>}
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl border ${
              toast.type === 'error' ? 'bg-[#0f0404] border-[#D71920]/30 text-[#D71920]' : 'bg-[#040f06] border-green-500/30 text-green-500'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
            <span className="font-display font-bold uppercase tracking-wider text-xs">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
