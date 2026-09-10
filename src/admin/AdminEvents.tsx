import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Star, ChevronDown, Upload } from 'lucide-react';
import type { BSEvent } from './AdminContext';
import { api, uploadImage } from '../lib/api';

type Draft = Omit<BSEvent, 'id'>;

const EMPTY: Draft = { title: '', abbr: '', description: '', date: '', status: 'upcoming', featured: false, image_url: '' };

function StatusBadge({ status, onClick }: { status: string; onClick?: () => void }) {
  const map: Record<string, { cls: string; label: string }> = {
    upcoming: { cls: 'border-blue-400/30 text-blue-400', label: 'Upcoming' },
    active:   { cls: 'border-green-500/30 text-green-400', label: 'Active' },
    past:     { cls: 'border-white/[0.08] text-[#F5F7FA]/25', label: 'Past' },
  };
  const s = map[status] ?? map.past;
  return (
    <button
      onClick={onClick}
      title="Click to cycle status"
      className={`label px-2 py-0.5 border transition-opacity hover:opacity-70 flex items-center gap-1 ${s.cls}`}
      style={{ fontSize: '0.56rem' }}
    >
      {s.label} {onClick && <ChevronDown size={8} />}
    </button>
  );
}

function EventForm({ data, onChange }: { data: Draft | BSEvent; onChange: (patch: Partial<Draft>) => void }) {
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
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Title</label>
        <input className={input} value={data.title} onChange={e => onChange({ title: e.target.value })} placeholder="Event title" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Abbreviation</label>
        <input className={input} value={data.abbr} onChange={e => onChange({ abbr: e.target.value })} placeholder="HITMALL" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Date / Period</label>
        <input className={input} value={data.date} onChange={e => onChange({ date: e.target.value })} placeholder="e.g. March 2025" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Status</label>
        <select
          className={`${input} cursor-pointer appearance-none`}
          style={{ backgroundColor: '#020B1C' }}
          value={data.status}
          onChange={e => onChange({ status: e.target.value as BSEvent['status'] })}
        >
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="past">Past</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Description</label>
        <textarea
          className={`${input} resize-none`}
          rows={3}
          value={data.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Event description..."
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Event Image</label>
        <div className="flex items-center gap-4">
          {data.image_url && <img src={data.image_url} alt="Preview" className="h-12 w-16 object-cover rounded border border-white/10" />}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-xs text-[#F5F7FA]/60 transition-colors">
            {uploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={14} /> Upload Image</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>
      <div className="sm:col-span-2 flex items-center gap-3 mt-2">
        <input
          type="checkbox"
          id="featured"
          checked={data.featured}
          onChange={e => onChange({ featured: e.target.checked })}
          className="accent-[#D71920]"
        />
        <label htmlFor="featured" className="text-[#F5F7FA]/50 text-sm cursor-pointer">Mark as featured</label>
      </div>
    </div>
  );
}

export default function AdminEvents() {
  const [events, setEvents] = useState<BSEvent[]>([]);
  const [editing, setEditing] = useState<BSEvent | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.events.list().then(setEvents).catch(console.error);
  }, []);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const cycleStatus = async (id: string) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const cycle: Record<string, BSEvent['status']> = { upcoming: 'active', active: 'past', past: 'upcoming' };
    const next = cycle[ev.status];
    setEvents(events.map(e => e.id === id ? { ...e, status: next } : e));
    try {
      await api.events.update(id, { status: next });
    } catch {
      flash('Update failed');
    }
  };

  const toggleFeatured = async (id: string) => {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    setEvents(events.map(e => e.id === id ? { ...e, featured: !e.featured } : e));
    try {
      await api.events.update(id, { featured: !ev.featured });
    } catch {
      flash('Update failed');
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.events.update(editing.id, editing);
      setEvents(events.map(e => e.id === editing.id ? editing : e));
      setEditing(null);
      flash('Event updated');
    } catch (e) {
      flash('Error updating');
    }
  };

  const saveNew = async () => {
    if (!draft.title.trim()) return;
    try {
      const data = await api.events.create(draft);
      setEvents([data, ...events]);
      setCreating(false);
      setDraft(EMPTY);
      flash('Event created');
    } catch (e) {
      flash('Error creating');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await api.events.delete(id);
      setEvents(events.filter(e => e.id !== id));
      setDeleteId(null);
      flash('Event deleted');
    } catch (e) {
      flash('Error deleting');
    }
  };

  const isFormOpen = editing !== null || creating;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">Events</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">{events.length} events &middot; {events.filter(e => e.featured).length} featured</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {toast && (
              <motion.span
                className="flex items-center gap-1.5 text-green-400 text-xs"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <Check size={12} /> {toast}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={() => { setCreating(true); setEditing(null); setDraft(EMPTY); }}
            className="flex items-center gap-2 font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
            style={{ fontSize: '0.65rem' }}
          >
            <Plus size={13} /> New Event
          </button>
        </div>
      </div>

      {/* Form panel */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="bg-[#071A3D] border border-white/[0.08] p-6 mb-5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="label text-[#D71920]" style={{ fontSize: '0.62rem' }}>
                {creating ? 'New Event' : `Editing: ${editing?.title || editing?.abbr}`}
              </div>
              <button
                onClick={() => { setEditing(null); setCreating(false); }}
                className="text-[#F5F7FA]/30 hover:text-[#F5F7FA] transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            <EventForm
              data={editing ?? draft}
              onChange={patch => editing
                ? setEditing({ ...editing, ...patch })
                : setDraft({ ...draft, ...patch })
              }
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

      {/* Table */}
      <div className="bg-[#071A3D] border border-white/[0.05] overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Abbr', 'Title', 'Date', 'Status', 'Featured', ''].map(h => (
                <th key={h} className="label text-[#F5F7FA]/20 text-left px-5 py-3" style={{ fontSize: '0.58rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.map((ev, i) => (
              <tr
                key={ev.id}
                className={`hover:bg-white/[0.015] transition-colors ${i < events.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <td className="px-5 py-3.5">
                  <span className="font-display font-bold text-[#D71920] text-xs">{ev.abbr || '—'}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[#F5F7FA]/70 text-xs">{ev.title}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-[#F5F7FA]/35 text-xs">{ev.date || '—'}</span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={ev.status} onClick={() => cycleStatus(ev.id)} />
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleFeatured(ev.id)} className="transition-opacity hover:opacity-70">
                    <Star
                      size={13}
                      className={ev.featured ? 'text-[#D71920] fill-[#D71920]' : 'text-[#F5F7FA]/15'}
                    />
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => { setEditing(ev); setCreating(false); }}
                      className="text-[#F5F7FA]/25 hover:text-[#F5F7FA] transition-colors"
                    >
                      <Edit2 size={12} />
                    </button>
                    {deleteId === ev.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="text-[#D71920] text-[0.7rem] font-medium hover:text-red-300 transition-colors"
                        >
                          Confirm?
                        </button>
                        <button onClick={() => setDeleteId(null)} className="text-[#F5F7FA]/25 hover:text-[#F5F7FA] transition-colors">
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(ev.id)}
                        className="text-[#F5F7FA]/15 hover:text-[#D71920] transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
