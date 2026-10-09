import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, Minus } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { promotionIsActive, safePromotionLink } from '../lib/promotion';
import type { EventPromotion } from '../lib/promotion';

const DELAY_MS = 15_000;

function Campaign({ promotion, visitedAt }: { promotion: EventPromotion; visitedAt: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [available, setAvailable] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef<string | null>(null);
  const desktopButton = useRef<HTMLButtonElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const buttonLabel = promotion.title.includes('NextGen') ? 'NextGen' : 'Event';
  const key = `bs-promotion:${promotion.title}:${promotion.image_url}:${promotion.starts_at}:${promotion.ends_at}`;

  const open = () => {
    if (!promotionIsActive(promotion) || !dialog.current || dialog.current.open) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = 'hidden';
  };

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    let presented = false;
    try { presented = sessionStorage.getItem(key) === 'seen'; } catch { /* Private browsing may disable storage. */ }
    const restore = () => {
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current;
        previousOverflow.current = null;
        const launcher = window.matchMedia('(min-width: 1024px)').matches ? desktopButton.current : mobileButton.current;
        (launcher || previousFocus.current)?.focus();
      }
    };
    element.addEventListener('close', restore);
    const tick = () => {
      const active = promotionIsActive(promotion);
      const ready = active && Date.now() - visitedAt >= DELAY_MS;
      setAvailable(ready);
      if (!active && element.open) element.close();
      if (!ready || presented || document.querySelector('[data-site-preloader]')) return;
      presented = true;
      try { sessionStorage.setItem(key, 'seen'); } catch { /* Keep the in-memory state. */ }
      // Mobile starts minimised. Resizing later must not unexpectedly open a modal.
      if (window.matchMedia('(min-width: 1024px)').matches) {
        previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        previousOverflow.current = document.body.style.overflow;
        element.showModal();
        document.body.style.overflow = 'hidden';
      }
    };
    const timer = window.setInterval(tick, 250);
    return () => { clearInterval(timer); element.close(); restore(); element.removeEventListener('close', restore); };
  }, [key, promotion, visitedAt]);

  return <>
    {available && <button ref={desktopButton} onClick={open} aria-haspopup="dialog" className="hidden lg:flex items-center gap-2 border border-white/25 bg-[#071A3D] text-white px-3 py-2 text-xs font-bold whitespace-nowrap" title={promotion.title}>
      <CalendarDays size={16} /> {buttonLabel} <span className="sr-only">— open event flyer</span>
    </button>}
    {createPortal(<>
      {available && <button ref={mobileButton} onClick={open} aria-label={`View ${promotion.title} flyer`} aria-haspopup="dialog" className="lg:hidden fixed right-4 z-[60] flex items-center gap-2 rounded-full bg-[#D71920] text-white px-4 py-3 shadow-xl border border-white/25 text-xs font-bold" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <CalendarDays size={18} /> {buttonLabel}
      </button>}
      <dialog ref={dialog} aria-labelledby="event-promotion-title" data-lenis-prevent className="event-popup m-auto w-[min(94vw,560px)] max-h-[94dvh] overflow-y-auto bg-[#071A3D] text-white p-3 sm:p-4 border border-white/20" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 id="event-promotion-title" className="font-display text-lg font-bold">{promotion.title}</h2>
          <button autoFocus aria-label="Minimise event flyer" onClick={() => dialog.current?.close()} className="p-2 border border-white/30 shrink-0"><Minus size={20} /></button>
        </div>
        <img src={promotion.image_url || undefined} alt={promotion.description || `Event flyer: ${promotion.title}`} className="w-full max-h-[72dvh] object-contain" />
        {promotion.description && <p className="text-xs text-white/80 mt-3 leading-relaxed">{promotion.description}</p>}
        {promotion.link && safePromotionLink(promotion.link) && <a href={promotion.link} className="block text-center bg-[#D71920] px-5 py-3 mt-3 font-bold">Event details</a>}
      </dialog>
    </>, document.body)}
  </>;
}

export default function EventPopup() {
  const { settings, loading } = useSettings();
  const [visitedAt] = useState(() => Date.now());
  const promotion = settings.event_promotion;
  if (loading || !promotion) return null;
  return <Campaign key={JSON.stringify(promotion)} promotion={promotion} visitedAt={visitedAt} />;
}
