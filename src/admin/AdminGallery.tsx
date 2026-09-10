import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Star, ImageIcon, Upload, Loader2 } from 'lucide-react';
import type { GalleryCollection } from './AdminContext';
import { api, uploadImage } from '../lib/api';

type Draft = Omit<GalleryCollection, 'id'>;

const EMPTY: Draft = { name: '', category: '', description: '', image_count: 0, featured: false, image_url: '' };
const CATEGORIES = ['Youth', 'Events', 'Community', 'Training', 'Schools', 'Matches', 'Media', 'Other'];

function ImageManager({ collectionId, onUpdate }: { collectionId: string, onUpdate: () => void }) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await api.galleryImages.list(collectionId);
      setImages(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [collectionId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    setUploading(true);
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) {
        await api.galleryImages.create(collectionId, url);
      }
    }
    await fetchImages();
    onUpdate();
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.galleryImages.delete(id);
      setImages(images.filter(img => img.id !== id));
      onUpdate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="sm:col-span-2 mt-4 pt-4 border-t border-white/[0.05]">
      <div className="flex items-center justify-between mb-3">
        <label className="label text-[#F5F7FA]/50" style={{ fontSize: '0.62rem' }}>Collection Photos ({images.length})</label>
        <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-[#F5F7FA] transition-colors rounded-sm border border-white/10">
          {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
          {uploading ? 'Uploading...' : 'Add Photos'}
          <input type="file" multiple className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-xs text-[#F5F7FA]/30 py-4">Loading photos...</div>
      ) : images.length === 0 ? (
        <div className="text-xs text-[#F5F7FA]/30 py-4 bg-white/[0.02] border border-white/[0.04] text-center italic">No photos uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {images.map(img => (
            <div key={img.id} className="relative aspect-square group bg-[#020B1C] border border-white/10">
              <img src={img.image_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionForm({ data, onChange, isEditing, onUpdate }: { data: Draft | GalleryCollection; onChange: (patch: Partial<Draft>) => void; isEditing: boolean; onUpdate: () => void; }) {
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
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Collection Name</label>
        <input className={input} value={data.name} onChange={e => onChange({ name: e.target.value })} placeholder="e.g. HITMALL 2025" />
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
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Description</label>
        <textarea
          className={`${input} resize-none`}
          rows={2}
          value={data.description}
          onChange={e => onChange({ description: e.target.value })}
          placeholder="Brief description of this collection..."
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label text-[#F5F7FA]/25 block mb-1.5" style={{ fontSize: '0.58rem' }}>Cover Image</label>
        <div className="flex items-center gap-4">
          {data.image_url && <img src={data.image_url} alt="Preview" className="h-12 w-16 object-cover rounded border border-white/10" />}
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-xs text-[#F5F7FA]/60 transition-colors">
            {uploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={14} /> Upload Cover</>}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <input
          type="checkbox"
          id="gcfeatured"
          checked={data.featured}
          onChange={e => onChange({ featured: e.target.checked })}
          className="accent-[#D71920]"
        />
        <label htmlFor="gcfeatured" className="text-[#F5F7FA]/50 text-sm cursor-pointer">Show on homepage</label>
      </div>
      
      {isEditing && 'id' in data && (
        <ImageManager collectionId={(data as GalleryCollection).id} onUpdate={onUpdate} />
      )}
      {!isEditing && (
        <div className="sm:col-span-2 mt-4 text-xs text-[#F5F7FA]/30 italic border-t border-white/[0.05] pt-4">
          * You can upload multiple photos to this collection after creating and saving it first.
        </div>
      )}
    </div>
  );
}

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryCollection[]>([]);
  const [editing, setEditing] = useState<GalleryCollection | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  // Fetch gallery list periodically in case image count updates
  const fetchGallery = () => {
    api.gallery.list().then(setGallery).catch(console.error);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Refresh collection list when editing closes so image counts update
  useEffect(() => {
    if (!editing && !creating) fetchGallery();
  }, [editing, creating]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const { id, created_at, ...updateData } = editing as any;
      await api.gallery.update(editing.id, updateData);
      setGallery(gallery.map(g => g.id === editing.id ? { ...g, ...updateData } as GalleryCollection : g));
      setEditing(null);
      setCreating(false);
      flash('Collection updated');
    } catch {
      flash('Error updating');
    }
  };

  const saveNew = async () => {
    if (!draft.name.trim()) return;
    try {
      const data = await api.gallery.create(draft);
      setGallery([data, ...gallery]);
      setCreating(false);
      // Automatically jump to editing so they can upload photos
      setEditing(data);
      setDraft(EMPTY);
      flash('Collection created. Now add photos.');
    } catch {
      flash('Error creating');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.gallery.delete(id);
      setGallery(gallery.filter(g => g.id !== id));
      setDeleteId(null);
      flash('Collection deleted');
    } catch {
      flash('Error deleting');
    }
  };

  const toggleFeatured = async (id: string) => {
    const col = gallery.find(g => g.id === id);
    if (!col) return;
    setGallery(gallery.map(g => g.id === id ? { ...g, featured: !g.featured } : g));
    try {
      await api.gallery.update(id, { featured: !col.featured });
    } catch {
      flash('Update failed');
    }
  };

  const isFormOpen = editing !== null || creating;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none">Gallery</h1>
          <p className="text-[#F5F7FA]/25 text-xs mt-1">{gallery.length} collections &middot; {gallery.filter(g => g.featured).length} featured</p>
        </div>
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {toast && (
              <motion.span
                className="flex items-center gap-1.5 text-green-400 text-xs"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
            <Plus size={13} /> New Collection
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
                {creating ? 'New Collection' : `Editing: ${editing?.name}`}
              </div>
              <button onClick={() => { setEditing(null); setCreating(false); }} className="text-[#F5F7FA]/30 hover:text-[#F5F7FA] transition-colors">
                <X size={15} />
              </button>
            </div>
            <CollectionForm
              data={editing ?? draft}
              isEditing={!!editing}
              onChange={patch => editing ? setEditing({ ...editing, ...patch }) : setDraft({ ...draft, ...patch })}
              onUpdate={fetchGallery}
            />
            <div className="flex gap-3 mt-5 pt-5 border-t border-white/[0.05]">
              <button
                onClick={creating ? saveNew : saveEdit}
                className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors"
                style={{ fontSize: '0.65rem' }}
              >
                {creating ? 'Create Collection' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(null); setCreating(false); }}
                className="font-display font-bold tracking-[0.18em] uppercase px-5 py-2.5 border border-white/10 text-[#F5F7FA]/40 hover:text-[#F5F7FA] transition-colors"
                style={{ fontSize: '0.65rem' }}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {gallery.map(col => (
          <motion.div
            key={col.id}
            className="bg-[#071A3D] border border-white/[0.05] p-5 group hover:border-white/10 transition-colors"
            layout
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display font-black uppercase text-[#F5F7FA] text-base leading-none mb-1">{col.name}</div>
                <div className="label text-[#D71920]" style={{ fontSize: '0.58rem' }}>{col.category}</div>
              </div>
              <button onClick={() => toggleFeatured(col.id)} className="transition-opacity hover:opacity-70 mt-0.5">
                <Star size={13} className={col.featured ? 'text-[#D71920] fill-[#D71920]' : 'text-[#F5F7FA]/15'} />
              </button>
            </div>

            <p className="text-[#F5F7FA]/35 text-xs leading-relaxed mb-5 line-clamp-2">{col.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#F5F7FA]/20 text-xs">
                <ImageIcon size={11} />
                <span>{col.image_count} photos</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setEditing(col); setCreating(false); }}
                  className="text-[#F5F7FA]/25 hover:text-[#F5F7FA] transition-colors"
                >
                  <Edit2 size={12} />
                </button>
                {deleteId === col.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => deleteItem(col.id)} className="text-[#D71920] text-[0.7rem] font-medium">Confirm?</button>
                    <button onClick={() => setDeleteId(null)} className="text-[#F5F7FA]/25"><X size={11} /></button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(col.id)} className="text-[#F5F7FA]/15 hover:text-[#D71920] transition-colors">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
