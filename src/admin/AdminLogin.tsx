import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creds.username || !creds.password) {
      setError('Please enter your credentials.');
      return;
    }
    setLoading(true);
    setError('');
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: creds.username,
      password: creds.password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const inputBase =
    'w-full bg-white/[0.04] border text-[#F5F7FA] placeholder-[#F5F7FA]/20 text-sm px-4 py-3 outline-none transition-colors';

  return (
    <div className="min-h-screen bg-[#020B1C] flex">
      {/* Grain */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Left panel — brand */}
      <div className="hidden lg:flex w-1/2 bg-[#071A3D] border-r border-white/[0.05] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D71920]/5 blur-[120px]" />
        </div>
        <div className="relative">
          <div className="font-display font-black uppercase text-[#F5F7FA] text-3xl leading-none mb-1">
            Ball & Stick
          </div>
          <div className="font-display font-black uppercase text-[#D71920] text-3xl leading-none">Ghana</div>
        </div>
        <div className="relative">
          <div
            className="font-display font-black uppercase text-[#F5F7FA]/8 leading-[0.82]"
            style={{ fontSize: 'clamp(4rem, 9vw, 9rem)' }}
          >
            Action
            <br />
            Imagined
          </div>
          <div className="divider mt-8 mb-4" />
          <p className="text-[#F5F7FA]/25 text-xs leading-relaxed max-w-xs">
            Content Management System — Ball & Stick Ghana. Manage events, gallery, stories, partners, and team content.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-10">
            <div className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none mb-0.5">
              Ball & Stick <span className="text-[#D71920]">Ghana</span>
            </div>
            <div className="label text-[#F5F7FA]/25 text-[0.6rem]">Content Management System</div>
          </div>

          <div className="mb-8">
            <h1 className="font-display font-black uppercase text-[#F5F7FA] text-2xl leading-none mb-2">Sign In</h1>
            <p className="text-[#F5F7FA]/30 text-sm">Admin access only.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label className="label text-[#F5F7FA]/30 text-[0.6rem] block mb-2">Username</label>
              <input
                type="text"
                autoComplete="username"
                value={creds.username}
                onChange={e => setCreds({ ...creds, username: e.target.value })}
                className={`${inputBase} border-white/[0.08] focus:border-[#D71920]/40`}
                placeholder="admin"
              />
            </div>

            <div>
              <label className="label text-[#F5F7FA]/30 text-[0.6rem] block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={creds.password}
                  onChange={e => setCreds({ ...creds, password: e.target.value })}
                  className={`${inputBase} border-white/[0.08] focus:border-[#D71920]/40 pr-10`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F7FA]/25 hover:text-[#F5F7FA]/60 transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                className="text-[#D71920]/80 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 font-display font-bold text-[0.7rem] tracking-[0.2em] uppercase px-6 py-3.5 bg-[#D71920] text-[#F5F7FA] hover:bg-[#e02028] transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight size={13} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/[0.05]">
            <Link to="/" className="label text-[#F5F7FA]/20 text-[0.6rem] hover:text-[#F5F7FA]/50 transition-colors">
              ← Back to website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
