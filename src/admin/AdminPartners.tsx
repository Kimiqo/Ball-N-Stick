import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, AlertTriangle, Upload } from 'lucide-react';
import type { Partner } from './AdminContext';
import { api, uploadImage } from '../lib/api';

type Draft = Omit<Partner, 'id'>;

const EMPTY: Draft = { name: '', type: '', website: '', description: '', image_url: '' };

const TYPES = ['Technical Partner', 'Equipment Partner', 'Title Sponsor', 'Event Sponsor', 'Media Partner', 'Strategic Partner', 'Other'];

function PartnerForm({ data, onChange }: { data: Draft | Partner; onChange: (patch: Partial<Draft>) => void }) {
  const input = "w-full bg-white/[0.03] border border-white/[0.08] text-[#F5F7FA] placeholder-[#F5F7FA]/15 text-sm px-3 py-2.5 outline-none focus:border-[#D71920]/40 transition-colors";
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) onChange({ image_url: url });
    setUploading(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Partner Name</label>
        <input className={input} value={data.name} onChange={e => onChange({ name: e.target.value })} placeholder="Organisation name" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Partnership Type</label>
        <select
          className={`${input} cursor-pointer appearance-none`}
          style={{ backgroundColor: '#020B1C' }}
          value={data.type}
          onChange={e => onChange({ type: e.target.value })}
        >
          <option value="">Select type</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Website (optional)</label>
        <input type="url" className={input} value={data.website} onChange={e => onChange({ website: e.target.value })} placeholder="https://..." />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Description</label>
        <textarea
          className={`${input} resize-none`}
          rows={3}
          value={data.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Brief description of the partnership..."
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Partner Logo / Image</label>
        <div className="flex items-center gap-4">
          {data.image_url && <img src={data.image_url} alt="Preview" className="h-12 w-16 object-cover rounded border border-white/10 bg-white" />}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-xs text-[#F5F7FA]/60 transition-colors">
            {uploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={14} /> Upload Image</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.partners.list().then(setPartners).catch(console.error);
  }, []);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.partners.update(editing.id, editing);
      setPartners(partners.map(p => p.id === editing.id ? editing : p));
      setEditing(null);
      flash('Partner updated');
    } catch {
      flash('Error updating');
    }
  };

  const saveNew = async () => {
    if (!draft.name.trim()) return;
    try {
      const data = await api.partners.create(draft);
      setPartners([data, ...partners]);
      setCreating(false);
      setDraft(EMPTY);
      flash('Partner added');
    } catch {
      flash('Error creating');
    }
  };

  const deletePartner = async (id: string) => {
    try {
      await api.partners.delete(id);
      setPartners(partners.filter(p => p.id !== id));
      setDeleteId(null);
      flash('Partner removed');
    } catch {
      flash('Error deleting');
    }
  };

  const isFormOpen = editing !== null || creating;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">Partners</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">{partners.length} partners</p>
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
            onClick={() => { setCreating(true); setEditing(null); setDraft(EMPTY); }}
            className="flex items-center gap-2 font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
            style={{ fontSize: '0.65rem' }}
          >
            <Plus size={13} /> Add Partner
          </button>
        </div>
      </div>

      {/* Content rule reminder */}
      <div className="flex items-start gap-3 bg-[#D71920]/6 border border-[#D71920]/15 px-4 py-3 mb-5 text-xs">
        <AlertTriangle size={13} className="text-[#D71920]/60 shrink-0 mt-0.5" />
        <span className="text-[#F5F7FA]/35">
          Only add confirmed partners. Do not invent or guess partner organisations.
          Current confirmed partners: <strong className="text-[#F5F7FA]/60">Act Global</strong> and <strong className="text-[#F5F7FA]/60">Harrow Sports</strong>.
        </span>
      </div>

      {/* Form panel */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="bg-[#071A3D] border border-white/[0.08] p-6 mb-5"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="label text-[#D71920]" style={{ fontSize: '0.62rem' }}>
                {creating ? 'Add Partner' : `Editing: ${editing?.name}`}
              </div>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="text-[#F5F7FA]/30 hover:text-[#F5F7FA] transition-colors">
                <X size={15} />
              </button>
            </div>
            <PartnerForm
              data={editing ?? draft}
              onChange={patch => editing ? setEditing({ ...editing, ...patch }) : setDraft({ ...draft, ...patch })}
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={creating ? saveNew : saveEdit}
                className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
                style={{ fontSize: '0.65rem' }}
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(null); setCreating(false); }}
                className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 border border-white/10 text-[#F5F7FA]/40 hover:text-[#F5F7FA] transition-colors"
                style={{ fontSize: '0.65rem' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partner cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map(partner => (
          <motion.div
            key={partner.id}
            className="bg-[#071A3D] border border-white/[0.05] p-6 hover:border-white/10 transition-colors"
            layout
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-display font-black uppercase text-[#F5F7FA] text-lg leading-none mb-1">{partner.name}</h2>
                <div className="label text-[#D71920]" style={{ fontSize: '0.58rem' }}>{partner.type}</div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button onClick={() => { setEditing(partner); setCreating(false); }} className="text-[#F5F7FA]/25 hover:text-[#F5F7FA] transition-colors">
                  <Edit2 size={13} />
                </button>
                {deleteId === partner.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => deletePartner(partner.id)} className="text-[#D71920] text-[0.7rem] font-medium">Remove?</button>
                    <button onClick={() => setDeleteId(null)} className="text-[#F5F7FA]/25"><X size={11} /></button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(partner.id)} className="text-[#F5F7FA]/15 hover:text-[#D71920] transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-[#F5F7FA]/40 text-xs leading-relaxed mb-4">{partner.description}</p>

            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noreferrer"
                className="label text-[#F5F7FA]/20 hover:text-[#D71920] transition-colors"
                style={{ fontSize: '0.6rem' }}
              >
                {partner.website}
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
