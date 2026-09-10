import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Eye, EyeOff, Star, Upload } from 'lucide-react';
import type { Story } from './AdminContext';
import { api, uploadImage } from '../lib/api';

type Draft = Omit<Story, 'id'>;

const EMPTY: Draft = { title: '', category: '', excerpt: '', date: '', published: false, featured: false, image_url: '' };

const CATEGORIES = ['Development', 'Events', 'Officiating', 'Community', 'Partnership', 'Media', 'Schools', 'Other'];

function StoryForm({ data, onChange }: { data: Draft | Story; onChange: (patch: Partial<Draft>) => void }) {
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
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Title</label>
        <input className={input} value={data.title} onChange={e => onChange({ title: e.target.value })} placeholder="Story headline" />
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Category</label>
        <select
          className={`${input} cursor-pointer appearance-none`}
          style={{ backgroundColor: '#020B1C' }}
          value={data.category}
          onChange={e => onChange({ category: e.target.value })}
        >
          <option value="">Select category</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Date</label>
        <input className={input} value={data.date} onChange={e => onChange({ date: e.target.value })} placeholder="e.g. January 2025" />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Excerpt / Summary</label>
        <textarea
          className={`${input} resize-none`}
          rows={3}
          value={data.excerpt}
          onChange={e => onChange({ excerpt: e.target.value })}
          placeholder="Brief excerpt shown in listings..."
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Cover Image</label>
        <div className="flex items-center gap-4">
          {data.image_url && <img src={data.image_url} alt="Preview" className="h-12 w-16 object-cover rounded border border-white/10" />}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-xs text-[#F5F7FA]/60 transition-colors">
            {uploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={14} /> Upload Image</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="spublished" checked={data.published} onChange={e => onChange({ published: e.target.checked })} className="accent-[#D71920]" />
        <label htmlFor="spublished" className="text-[#F5F7FA]/50 text-sm cursor-pointer">Publish (live on site)</label>
      </div>
      <div className="flex items-center gap-3">
        <input type="checkbox" id="sfeatured" checked={data.featured} onChange={e => onChange({ featured: e.target.checked })} className="accent-[#D71920]" />
        <label htmlFor="sfeatured" className="text-[#F5F7FA]/50 text-sm cursor-pointer">Featured story</label>
      </div>
    </div>
  );
}

export default function AdminStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [editing, setEditing] = useState<Story | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.stories.list().then(setStories).catch(console.error);
  }, []);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const togglePublished = async (id: string) => {
    const s = stories.find(x => x.id === id);
    if (!s) return;
    setStories(stories.map(x => x.id === id ? { ...x, published: !x.published } : x));
    try {
      await api.stories.update(id, { published: !s.published });
    } catch {
      flash('Update failed');
    }
  };

  const toggleFeatured = async (id: string) => {
    const s = stories.find(x => x.id === id);
    if (!s) return;
    setStories(stories.map(x => x.id === id ? { ...x, featured: !x.featured } : x));
    try {
      await api.stories.update(id, { featured: !s.featured });
    } catch {
      flash('Update failed');
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.stories.update(editing.id, editing);
      setStories(stories.map(s => s.id === editing.id ? editing : s));
      setEditing(null);
      flash('Story updated');
    } catch {
      flash('Error updating');
    }
  };

  const saveNew = async () => {
    if (!draft.title.trim()) return;
    try {
      const data = await api.stories.create(draft);
      setStories([data, ...stories]);
      setCreating(false);
      setDraft(EMPTY);
      flash('Story created');
    } catch {
      flash('Error creating');
    }
  };

  const deleteStory = async (id: string) => {
    try {
      await api.stories.delete(id);
      setStories(stories.filter(s => s.id !== id));
      setDeleteId(null);
      flash('Story deleted');
    } catch {
      flash('Error deleting');
    }
  };

  const isFormOpen = editing !== null || creating;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">Stories</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">
            {stories.filter(s => s.published).length} published &middot; {stories.filter(s => !s.published).length} draft
          </p>
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
            <Plus size={13} /> New Story
          </button>
        </div>
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
                {creating ? 'New Story' : `Editing: ${editing?.title}`}
              </div>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="text-[#F5F7FA]/30 hover:text-[#F5F7FA] transition-colors">
                <X size={15} />
              </button>
            </div>
            <StoryForm
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

      {/* List */}
      <div className="flex flex-col gap-2">
        {stories.map(story => (
          <motion.div
            key={story.id}
            className="bg-[#071A3D] border border-white/[0.05] px-5 py-4 flex items-center gap-4 hover:border-white/10 transition-colors"
            layout
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="label text-[#D71920]" style={{ fontSize: '0.58rem' }}>{story.category}</span>
                {story.featured && <Star size={10} className="text-[#D71920] fill-[#D71920]" />}
              </div>
              <div className="font-medium text-[#F5F7FA]/75 text-sm truncate">{story.title}</div>
              <div className="text-[#F5F7FA]/30 text-xs mt-0.5 truncate">{story.excerpt}</div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`label px-2 py-0.5 border ${
                  story.published ? 'border-green-500/30 text-green-400' : 'border-white/[0.08] text-[#F5F7FA]/25'
                }`}
                style={{ fontSize: '0.56rem' }}
              >
                {story.published ? 'Live' : 'Draft'}
              </span>

              <button onClick={() => togglePublished(story.id)} className="text-[#F5F7FA]/25 hover:text-[#F5F7FA] transition-colors" title={story.published ? 'Unpublish' : 'Publish'}>
                {story.published ? <EyeOff size={12} /> : <Eye size={12} />}
              </button>

              <button onClick={() => toggleFeatured(story.id)} className="text-[#F5F7FA]/15 hover:text-[#D71920] transition-colors" title="Toggle featured">
                <Star size={12} className={story.featured ? 'text-[#D71920] fill-[#D71920]' : ''} />
              </button>

              <button onClick={() => { setEditing(story); setCreating(false); }} className="text-[#F5F7FA]/25 hover:text-[#F5F7FA] transition-colors">
                <Edit2 size={12} />
              </button>

              {deleteId === story.id ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteStory(story.id)} className="text-[#D71920] text-[0.7rem] font-medium">Delete?</button>
                  <button onClick={() => setDeleteId(null)} className="text-[#F5F7FA]/25"><X size={11} /></button>
                </div>
              ) : (
                <button onClick={() => setDeleteId(story.id)} className="text-[#F5F7FA]/15 hover:text-[#D71920] transition-colors">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
