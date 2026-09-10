import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, X, Check, Mail, Upload } from 'lucide-react';
import type { TeamMember } from './AdminContext';
import { api, uploadImage } from '../lib/api';

type Draft = Omit<TeamMember, 'id'>;

function MemberForm({ data, onChange }: { data: Draft | TeamMember; onChange: (patch: Partial<Draft>) => void }) {
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
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Full Name</label>
        <input className={input} value={data.name} onChange={e => onChange({ name: e.target.value })} placeholder="Name (leave blank if TBC)" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Role / Title</label>
        <input className={input} value={data.role} onChange={e => onChange({ role: e.target.value })} placeholder="e.g. B&S Event Manager" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Email Address</label>
        <input type="email" className={input} value={data.email} onChange={e => onChange({ email: e.target.value })} placeholder="name@ballandstick.com" />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Profile Image</label>
        <div className="flex items-center gap-4">
          {data.image_url && <img src={data.image_url} alt="Preview" className="h-12 w-12 object-cover rounded-full border border-white/10" />}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-xs text-[#F5F7FA]/60 transition-colors">
            {uploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={14} /> Upload Image</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function AdminPeople() {
  const [people, setPeople] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.people.list().then(setPeople).catch(console.error);
  }, []);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.people.update(editing.id, editing);
      setPeople(people.map(p => p.id === editing.id ? editing : p));
      setEditing(null);
      flash('Team member updated');
    } catch {
      flash('Error updating');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">People</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">
            {people.filter(p => p.name).length} named &middot; {people.filter(p => !p.name).length} TBC
          </p>
        </div>
        <AnimatePresence>
          {toast && (
            <motion.span className="flex items-center gap-1.5 text-green-400 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Check size={12} /> {toast}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Note */}
      <div className="bg-[#071A3D] border border-white/[0.05] px-4 py-3 mb-5 text-xs text-[#F5F7FA]/30">
        Organisational structure from the Ball & Stick Ghana corporate profile. Edit to add names as positions are filled. Do not fabricate biographies — full profiles are managed through the CMS when connected.
      </div>

      {/* Edit form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            className="bg-[#071A3D] border border-white/[0.08] p-6 mb-5"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="label text-[#D71920]" style={{ fontSize: '0.62rem' }}>Editing: {editing.role}</div>
              <button onClick={() => setEditing(null)} className="text-[#F5F7FA]/30 hover:text-[#F5F7FA] transition-colors">
                <X size={15} />
              </button>
            </div>
            <MemberForm
              data={editing}
              onChange={patch => setEditing({ ...editing, ...patch })}
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={saveEdit}
                className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
                style={{ fontSize: '0.65rem' }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 border border-white/10 text-[#F5F7FA]/40 hover:text-[#F5F7FA] transition-colors"
                style={{ fontSize: '0.65rem' }}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Org list */}
      <div className="bg-[#071A3D] border border-white/[0.05]">
        {people.map((member, i) => (
          <div
            key={member.id}
            className={`flex items-center justify-between px-5 py-4 ${i < people.length - 1 ? 'border-b border-white/[0.04]' : ''} group hover:bg-white/[0.015] transition-colors`}
          >
            <div className="flex items-center gap-5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.07] flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-[#D71920] text-xs">
                  {member.name ? member.name[0] : '?'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="font-medium text-[#F5F7FA]/70 text-sm group-hover:text-[#F5F7FA] transition-colors">
                  {member.role}
                </div>
                {member.name ? (
                  <div className="label text-[#D71920] mt-0.5" style={{ fontSize: '0.6rem' }}>{member.name}</div>
                ) : (
                  <div className="label text-[#F5F7FA]/20 mt-0.5" style={{ fontSize: '0.6rem' }}>Name TBC</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              {member.email && (
                <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 text-[#F5F7FA]/20 hover:text-[#D71920] transition-colors text-xs">
                  <Mail size={11} />
                  <span className="hidden sm:inline">{member.email}</span>
                </a>
              )}
              <button
                onClick={() => setEditing(member)}
                className="text-[#F5F7FA]/20 hover:text-[#F5F7FA] transition-colors"
              >
                <Edit2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
