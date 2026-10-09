import { useState } from 'react';
import { uploadImage } from '../lib/api';
import { EMPTY_PROMOTION } from '../lib/promotion';
import type { EventPromotion } from '../lib/promotion';

export default function PromotionSettings({ value = EMPTY_PROMOTION, onChange }: { value?: EventPromotion; onChange: (value: EventPromotion) => void }) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const field = 'block w-full border border-white/20 bg-[#020B1C] p-3 mt-2 text-white';
  const update = (patch: Partial<EventPromotion>) => onChange({ ...value, ...patch });
  return <section className="border border-white/15 p-6 mb-8 text-white">
    <h2 className="font-display font-bold text-2xl mb-3">Event flyer popup</h2>
    <p className="text-sm text-white/60 mb-5">Desktop: opens after 15 seconds, once per session, then minimises into the header. Mobile: a floating button appears after 15 seconds; tap to open. Upload a flyer and set an expiry before enabling. Times use UTC (Ghana time). Save Settings to publish changes.</p>
    <label className="flex gap-3 mb-5"><input type="checkbox" checked={value.enabled} onChange={e => update({ enabled: e.target.checked })} /> Enable event popup</label>
    <div className="grid sm:grid-cols-2 gap-5">
      <label>Event title<input className={field} value={value.title} onChange={e => update({ title: e.target.value })} /></label>
      <label>Event link (optional)<input className={field} value={value.link} onChange={e => update({ link: e.target.value })} placeholder="/events or https://…" /></label>
      <label className="sm:col-span-2">Event details / accessible flyer text<textarea className={field} value={value.description || ''} onChange={e => update({ description: e.target.value })} /></label>
      <label>Starts at (optional, UTC)<input type="datetime-local" className={field} value={value.starts_at.replace(/Z$/, '')} onChange={e => update({ starts_at: e.target.value ? `${e.target.value}Z` : '' })} /></label>
      <label>Expires at (required, UTC)<input type="datetime-local" className={field} value={value.ends_at.replace(/Z$/, '')} onChange={e => update({ ends_at: e.target.value ? `${e.target.value}Z` : '' })} /></label>
      <label>Flyer<input type="file" accept="image/*" disabled={uploading} className={field} onChange={async e => {
        const file = e.target.files?.[0]; if (!file) return;
        setUploading(true); setMessage('Uploading…');
        try { const url = await uploadImage(file); if (!url) throw new Error('Upload failed'); update({ image_url: url }); setMessage('Flyer uploaded. Save Settings to apply.'); }
        catch { setMessage('Upload failed. Please try again.'); }
        finally { setUploading(false); }
      }} /></label>
      {value.image_url && <img src={value.image_url} alt="Event flyer preview" className="max-h-64 object-contain" />}
    </div>
    <p role="status" className="mt-3 text-sm">{message}</p>
  </section>;
}
