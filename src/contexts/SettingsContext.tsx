import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

// Define the type to match AdminSettings.tsx SiteSettings
export type SiteSettings = {
  tagline: string;
  mission: string;
  phone1: string;
  phone2: string;
  emailGeneral: string;
  emailCeo: string;
  addressStreet: string;
  addressCity: string;
  addressPostal: string;
  website: string;
  ceoName: string;
  hero_image_url?: string;
  hero_carousel_images?: string[];
  home_whatwedo_image_url?: string;
  about_image_url?: string;
  whatwedo_play_image_url?: string;
  whatwedo_media_image_url?: string;
  whatwedo_global_image_url?: string;
  whatwedo_event_image_url?: string;
  whatwedo_foundation_image_url?: string;
  partners_bg_image_url?: string;
  schools_hero_image_url?: string;
  schools_mid_image_url?: string;
  getinvolved_bg_image_url?: string;
};

// We will use the same defaults from AdminSettings as fallback
export const DEFAULTS: SiteSettings = {
  tagline: 'Action Imagined!!',
  mission: 'To promote Field Hockey across Ghana and Africa.',
  phone1: '0303 934 561',
  phone2: '0244 241 809',
  emailGeneral: 'kojo@ballandstick.com',
  emailCeo: 'kojo@ballandstick.com',
  addressStreet: 'No. 10 Hospital Street, Spintex Road, Accra',
  addressCity: 'Accra, Ghana',
  addressPostal: 'P.O BOX KA 16379, Airport-Accra',
  website: 'www.ballandstick.com',
  ceoName: 'Kojo Lumour Ameye',
};

type SettingsContextType = {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULTS,
  loading: true,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.settings.get();
      if (data) {
        setSettings({ ...DEFAULTS, ...data });
      }
    } catch (error) {
      console.error('Failed to fetch global settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
