import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { isPaystackStorefrontUrl } from '../lib/shop';

export default function Shop() {
  const { settings, loading } = useSettings();
  const url = settings.shop_url?.trim() || '';
  const ready = isPaystackStorefrontUrl(url);
  return <main className="min-h-[80vh] pt-36 md:pt-44 pb-24 px-5 md:px-10 bg-[#020B1C] text-white">
    <div className="max-w-4xl mx-auto">
      <p className="label text-[#D71920] mb-5">B&S Shop</p>
      <h1 className="font-display font-black uppercase text-5xl md:text-7xl leading-none">Gear up.<br /><span className="text-outline">Get playing.</span></h1>
      <p className="text-white/70 max-w-xl mt-6 leading-relaxed">Hockey equipment for your next training session and match day.</p>
      <div className="mt-12 border border-white/15 bg-[#071A3D] p-7 md:p-10">
        <ShoppingBag size={32} className="text-[#D71920] mb-5" />
        {loading ? <p role="status">Loading shop…</p> : ready ? <>
          <h2 className="font-display text-3xl font-bold">Explore the B&S collection</h2>
          <p className="text-white/70 mt-3 mb-7">Browse available equipment, prices and delivery options in our Paystack store.</p>
          <a href={url} className="inline-flex gap-3 items-center bg-[#D71920] px-6 py-4 font-bold">Visit B&S Shop <ArrowUpRight size={18} /></a>
          <p className="text-white/50 text-sm mt-4">You’ll continue to our shop on Paystack to browse and check out.</p>
        </> : <>
          <h2 className="font-display text-3xl font-bold">Our shop is coming soon</h2>
          <p className="text-white/70 mt-3 mb-6">We’re preparing our equipment collection. Contact us for equipment enquiries in the meantime.</p>
          <Link to="/contact" className="inline-block bg-[#D71920] px-6 py-3 font-bold">Enquire about equipment</Link>
        </>}
      </div>
    </div>
  </main>;
}
