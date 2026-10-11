import { useId, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Mail, Phone, UserRound } from 'lucide-react';
import type { TeamMember } from '../admin/AdminContext';
import { professionalProfileUrl } from '../lib/peoplePresentation';

export function ProfilePhoto({ member }: { member: TeamMember }) {
  return member.image_url ? (
    <img src={member.image_url} alt={member.name || member.role} className="w-full h-full object-cover" loading="lazy" />
  ) : (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0a1e50] to-[#071A3D]" aria-label="Photo not yet available">
      <UserRound size={72} strokeWidth={1} className="text-white/20" aria-hidden="true" />
    </div>
  );
}

export function ProfileDetails({ member }: { member: TeamMember }) {
  const profileUrl = professionalProfileUrl(member.linkedin_url);
  const telephone = member.phone?.replace(/[^\d+]/g, '');
  const hasDetails = member.bio?.trim() || member.email?.trim() || telephone || profileUrl;
  return (
    <div className="space-y-4 text-sm">
      {member.bio?.trim() && <p className="whitespace-pre-line leading-relaxed text-white/75">{member.bio}</p>}
      <div className="space-y-3">
        {member.email?.trim() && <a href={`mailto:${member.email.trim()}`} className="flex items-start gap-2 text-white/85 hover:text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><Mail size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><span className="break-all">{member.email}</span></a>}
        {telephone && <a href={`tel:${telephone}`} className="flex items-center gap-2 text-white/85 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><Phone size={16} aria-hidden="true" />{member.phone}</a>}
        {profileUrl && <a href={profileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/85 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"><ExternalLink size={16} aria-hidden="true" />Professional profile<span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
      {!hasDetails && <p className="text-white/60">Profile details will be added soon.</p>}
    </div>
  );
}

export default function TeamProfileCard({ member }: { member: TeamMember }) {
  const detailsId = useId();
  const button = useRef<HTMLButtonElement>(null);
  const restoringFocus = useRef(false);
  const [preview, setPreview] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const open = preview || expanded;
  const close = () => { setPreview(false); setExpanded(false); };

  return (
    <article id={`member-${member.id}`} className="overflow-hidden border border-white/10 bg-[#071A3D] scroll-mt-28"
      onMouseEnter={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setPreview(true); }}
      onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setPreview(false); }}
      onFocusCapture={event => { if (!restoringFocus.current && event.target.matches(':focus-visible')) setPreview(true); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPreview(false); }}
      onKeyDown={event => {
        if (event.key === 'Escape' && open) {
          event.preventDefault(); close(); restoringFocus.current = true; button.current?.focus(); restoringFocus.current = false;
        }
      }}>
      <div className="relative aspect-[3/4] overflow-hidden bg-[#0a1e50]">
        <ProfilePhoto member={member} />
        <div id={detailsId} aria-hidden={!open} inert={!open}
          className={`absolute inset-x-0 bottom-0 max-h-[80%] overflow-y-auto border-t border-white/15 bg-[#020B1C]/95 p-5 backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none ${open ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}>
          <p className="label text-[#D71920] text-[0.6rem] mb-3">Profile &amp; Contact</p>
          <ProfileDetails member={member} />
        </div>
      </div>
      <div className="p-5">
        <p className="label text-[#D71920] text-[0.6rem] leading-relaxed mb-2">{member.role}</p>
        <h3 className="font-display font-black uppercase text-white text-2xl leading-tight">{member.name?.trim() || 'Name to be confirmed'}</h3>
        <button ref={button} type="button" aria-expanded={open} aria-controls={detailsId}
          aria-label={`${expanded ? 'Close' : 'View'} profile for ${member.name || member.role}`}
          onClick={() => { if (expanded) close(); else setExpanded(true); }}
          className="mt-4 flex min-h-11 items-center gap-2 text-sm text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D71920] focus-visible:outline-offset-4">
          {expanded ? 'Close profile' : 'View profile'}{expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        </button>
      </div>
    </article>
  );
}
