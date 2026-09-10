import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
};

// Types exported for use in components
export type BSEvent = {
  id: string;
  title: string;
  abbr: string;
  description: string;
  date: string;
  status: 'upcoming' | 'active' | 'past';
  featured: boolean;
  image_url?: string;
};

export type GalleryCollection = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_count: number;
  featured: boolean;
  image_url?: string;
};

export type Story = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  published: boolean;
  featured: boolean;
  image_url?: string;
};

export type Partner = {
  id: string;
  name: string;
  type: string;
  website: string;
  description: string;
  image_url?: string;
};

export type TeamMember = {
  id: string;
  role: string;
  name: string;
  email: string;
  image_url?: string;
};

type AdminContextType = {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '', role: 'SUPER_ADMIN' });
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '', role: 'SUPER_ADMIN' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AdminContext.Provider value={{
      user, isAuthenticated: !!user, isLoading, logout
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}

