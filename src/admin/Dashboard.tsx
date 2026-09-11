import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Images, FileText, Users, Handshake, ArrowRight, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdmin } from './AdminContext';
import { api } from '../lib/api';
import type { BSEvent, Story, GalleryCollection, Partner, TeamMember } from './AdminContext';

function StatCard({
  label, value, icon: Icon, to, accent = false,
}: {
  label: string; value: number; icon: React.ElementType; to: string; accent?: boolean;
}) {
  return (
    <Link
      to={to}
      className="group block bg-[#071A3D] border border-white/[0.05] p-5 hover:border-white/[0.1] transition-all"
    >
      <div className="flex items-start justify-between mb-8">
        <Icon size={15} className={accent ? 'text-[#D71920]' : 'text-[#F5F7FA]/25'} />
        <ArrowRight
          size={11}
          className="text-[#F5F7FA]/15 group-hover:text-[#F5F7FA]/45 group-hover:translate-x-0.5 transition-all"
        />
      </div>
      <div className="font-display font-black text-[#F5F7FA] text-4xl leading-none mb-1.5">{value}</div>
      <div className="label text-[#F5F7FA]/25" style={{ fontSize: '0.6rem' }}>{label}</div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    upcoming: { cls: 'border-blue-400/30 text-blue-400', label: 'Upcoming' },
    active:   { cls: 'border-green-500/30 text-green-400', label: 'Active' },
    past:     { cls: 'border-white/[0.08] text-[#F5F7FA]/25', label: 'Past' },
  };
  const s = map[status] ?? map.past;
  return (
    <span className={`label px-2 py-0.5 border ${s.cls}`} style={{ fontSize: '0.56rem' }}>
      {s.label}
    </span>
  );
}

export default function Dashboard() {
  const { user } = useAdmin();
  const [events, setEvents] = useState<BSEvent[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [gallery, setGallery] = useState<GalleryCollection[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [people, setPeople] = useState<TeamMember[]>([]);

  useEffect(() => {
    Promise.all([
      api.events.list().then(setEvents),
      api.stories.list().then(setStories),
      api.gallery.list().then(setGallery),
      api.partners.list().then(setPartners),
      api.people.list().then(setPeople)
    ]).catch(console.error);
  }, []);

  const unpublished = stories.filter((s: Story) => !s.published).length;
  const activeEvents = events.filter((e: BSEvent) => e.status === 'active').length;
  const firstName = user?.email.split('@')[0] ?? 'Admin';

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="mb-10">
        <div className="label text-[#D71920] mb-2" style={{ fontSize: '0.62rem' }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
        <h1 className="font-display font-black uppercase text-[#F5F7FA] leading-none" style={{ fontSize: 'clamp(1.3rem, 3vw, 2.5rem)' }}>
          Welcome back, {firstName}
        </h1>
      </div>

      {/* Alerts */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-3 bg-[#071A3D] border border-white/[0.06] px-4 py-3 text-xs">
          <Database size={13} className="text-[#F5F7FA]/30 shrink-0" />
          <span className="text-[#F5F7FA]/40">
            Running in prototype mode — changes persist in browser storage.
            Connect{' '}
            <span className="text-[#F5F7FA]/65">Payload CMS</span>{' '}
            to sync content with the live site.
          </span>
        </div>

        {unpublished > 0 && (
          <div className="flex items-center gap-3 bg-[#D71920]/8 border border-[#D71920]/20 px-4 py-3 text-xs">
            <AlertCircle size={13} className="text-[#D71920] shrink-0" />
            <span className="text-[#F5F7FA]/55">
              <strong className="text-[#F5F7FA]">{unpublished} {unpublished === 1 ? 'story' : 'stories'}</strong> unpublished &mdash;{' '}
              <Link to="/admin/stories" className="text-[#D71920] hover:underline">review now</Link>
            </span>
          </div>
        )}

        {activeEvents > 0 && (
          <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/15 px-4 py-3 text-xs">
            <CheckCircle size={13} className="text-green-400 shrink-0" />
            <span className="text-[#F5F7FA]/40">
              <strong className="text-[#F5F7FA]/65">{activeEvents} {activeEvents === 1 ? 'event' : 'events'}</strong> currently active
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        <StatCard label="Events" value={events.length} icon={Calendar} to="/admin/events" accent />
        <StatCard label="Gallery Collections" value={gallery.length} icon={Images} to="/admin/gallery" />
        <StatCard label="Stories" value={stories.length} icon={FileText} to="/admin/stories" />
        <StatCard label="Team Members" value={people.length} icon={Users} to="/admin/people" />
        <StatCard label="Partners" value={partners.length} icon={Handshake} to="/admin/partners" />
      </div>

      {/* Detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Events */}
        <div className="bg-[#071A3D] border border-white/[0.05] p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="label text-[#F5F7FA]/30" style={{ fontSize: '0.6rem' }}>Events Overview</span>
            <Link to="/admin/events" className="label text-[#D71920] hover:text-[#F5F7FA] transition-colors" style={{ fontSize: '0.6rem' }}>
              Manage →
            </Link>
          </div>
          <div className="flex flex-col">
            {events.slice(0, 6).map((ev: BSEvent, i: number) => (
              <div
                key={ev.id}
                className={`flex items-center justify-between py-2.5 ${i < Math.min(events.length, 6) - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-display font-bold text-[#D71920] text-xs w-16 shrink-0">{ev.abbr}</span>
                  <span className="text-[#F5F7FA]/50 text-xs truncate">{ev.title}</span>
                </div>
                <StatusBadge status={ev.status} />
              </div>
            ))}
            {events.length > 6 && (
              <div className="pt-3 text-[#F5F7FA]/20 text-xs">+{events.length - 6} more events</div>
            )}
          </div>
        </div>

        {/* Stories */}
        <div className="bg-[#071A3D] border border-white/[0.05] p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="label text-[#F5F7FA]/30" style={{ fontSize: '0.6rem' }}>Stories</span>
            <Link to="/admin/stories" className="label text-[#D71920] hover:text-[#F5F7FA] transition-colors" style={{ fontSize: '0.6rem' }}>
              Manage →
            </Link>
          </div>
          <div className="flex flex-col">
            {stories.map((s: Story, i: number) => (
              <div
                key={s.id}
                className={`flex items-center justify-between py-2.5 gap-4 ${i < stories.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              >
                <span className="text-[#F5F7FA]/60 text-xs truncate">{s.title}</span>
                <span
                  className={`label px-2 py-0.5 border shrink-0 ${
                    s.published ? 'border-green-500/30 text-green-400' : 'border-white/[0.08] text-[#F5F7FA]/25'
                  }`}
                  style={{ fontSize: '0.56rem' }}
                >
                  {s.published ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-white/[0.05]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#F5F7FA]/25">
                {stories.filter((s: Story) => s.published).length} published &middot; {unpublished} draft{unpublished !== 1 ? 's' : ''}
              </span>
              <Link to="/admin/stories" className="text-[#D71920] hover:underline text-[0.72rem]">
                + New story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
