import { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Images, FileText,
  Handshake, Users, Settings, LogOut, ChevronRight, ExternalLink, Menu, X
} from 'lucide-react';
import { useAdmin } from './AdminContext';

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Events', icon: Calendar, path: '/admin/events' },
  { label: 'Gallery', icon: Images, path: '/admin/gallery' },
  { label: 'Stories', icon: FileText, path: '/admin/stories' },
  { label: 'People', icon: Users, path: '/admin/people' },
  { label: 'Partners', icon: Handshake, path: '/admin/partners' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen bg-[#020B1C] flex items-center justify-center text-[#F5F7FA]">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const currentNav = NAV.find(n => location.pathname.startsWith(n.path));

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'A';

  return (
    <div className="min-h-screen bg-[#020B1C] flex text-[#F5F7FA]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-[220px] shrink-0 bg-[#071A3D] border-r border-white/[0.06] flex flex-col fixed top-0 left-0 h-full z-50 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="font-display font-black uppercase text-[#F5F7FA] text-[1.1rem] leading-none tracking-tight">
              Ball & Stick <span className="text-[#D71920]">GH</span>
            </div>
            <div className="label text-[#F5F7FA]/20 mt-1.5" style={{ fontSize: '0.54rem', letterSpacing: '0.18em' }}>
              Content Management
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/50 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 pl-4 pr-5 py-2.5 text-[0.8rem] font-medium transition-all border-l-2 ${
                  isActive
                    ? 'text-[#F5F7FA] bg-[#D71920]/12 border-[#D71920]'
                    : 'text-[#F5F7FA]/40 hover:text-[#F5F7FA]/70 hover:bg-white/[0.025] border-transparent'
                }`
              }
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User area */}
        <div className="border-t border-white/[0.06] p-4 flex flex-col gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[#F5F7FA]/25 hover:text-[#F5F7FA]/55 text-[0.72rem] transition-colors"
          >
            <ExternalLink size={11} /> View live site
          </a>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#D71920]/20 border border-[#D71920]/30 flex items-center justify-center shrink-0">
              <span className="text-[#D71920] font-bold" style={{ fontSize: '0.62rem' }}>{initials}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[#F5F7FA]/65 text-[0.73rem] font-medium truncate leading-tight">
                {user?.email.split('@')[0]}
              </div>
              <div className="text-[#F5F7FA]/25 truncate" style={{ fontSize: '0.58rem', letterSpacing: '0.12em' }}>
                {user?.role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#F5F7FA]/25 hover:text-[#D71920] text-[0.72rem] transition-colors"
          >
            <LogOut size={11} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-[220px] flex flex-col min-h-screen max-w-full">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#020B1C]/96 backdrop-blur-sm border-b border-white/[0.05] h-13 flex items-center justify-between px-4 md:px-8" style={{ height: '52px' }}>
          <div className="flex items-center gap-2 text-xs">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-2 text-white/50 hover:text-white p-1">
              <Menu size={16} />
            </button>
            <span className="text-[#F5F7FA]/20 hidden sm:inline">Admin</span>
            <ChevronRight size={10} className="text-[#F5F7FA]/15 hidden sm:inline" />
            <span className="text-[#F5F7FA]/55">{currentNav?.label ?? 'Dashboard'}</span>
          </div>
          <div className="label text-[#F5F7FA]/12 hidden sm:block" style={{ fontSize: '0.56rem' }}>
            Ball & Stick Ghana CMS &mdash; Prototype
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
