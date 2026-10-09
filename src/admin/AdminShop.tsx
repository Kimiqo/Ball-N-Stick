import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { api } from '../lib/api';
import { isPaystackStorefrontUrl } from '../lib/shop';

function ShopForm({ initialUrl }: { initialUrl: string }) {
  const { refreshSettings } = useSettings();
  const [url, setUrl] = useState(initialUrl);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  return <form className="max-w-2xl text-white" onSubmit={async e => {
    e.preventDefault();
    const shop_url = url.trim();
    if (shop_url && !isPaystackStorefrontUrl(shop_url)) { setMessage('Enter your HTTPS paystack.shop Storefront link.'); return; }
    setSaving(true); setMessage('');
    try {
      const current = await api.settings.get();
      await api.settings.update({ ...current, shop_url });
      await refreshSettings(); setMessage('Shop link saved.');
    } catch { setMessage('Could not save the shop link. Please try again.'); }
    finally { setSaving(false); }
  }}>
    <h1 className="font-display font-black uppercase text-3xl mb-4">B&S Shop</h1>
    <p className="text-white/70 mb-6 leading-relaxed">Create your B&S Storefront in Paystack, add products and delivery options, then paste its public link here. Products, stock, payments and orders are managed in Paystack.</p>
    <label className="block">Public Storefront URL
      <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://paystack.shop/your-store" className="block w-full mt-2 bg-[#071A3D] border border-white/20 p-3" />
    </label>
    <p className="text-sm text-white/50 mt-3">Leave blank to show “Coming soon”. No API keys are needed for this hosted shop link.</p>
    <div className="flex flex-wrap gap-3 mt-6">
      <button disabled={saving} className="bg-[#D71920] px-5 py-3 font-bold disabled:opacity-50">{saving ? 'Saving…' : 'Save shop link'}</button>
      <a href="https://dashboard.paystack.com/" target="_blank" rel="noreferrer" className="border border-white/30 px-5 py-3">Manage shop in Paystack ↗</a>
      <a href="/shop" target="_blank" rel="noreferrer" className="border border-white/30 px-5 py-3">Preview B&S Shop ↗</a>
    </div>
    <p role="status" className="mt-5">{message}</p>
  </form>;
}

export default function AdminShop() {
  const { settings, loading } = useSettings();
  if (loading) return <p role="status">Loading shop settings…</p>;
  return <ShopForm initialUrl={settings.shop_url || ''} />;
}
