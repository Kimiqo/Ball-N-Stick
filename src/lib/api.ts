import { compressImage } from './compressImage';
import { supabase } from './supabase';

export async function uploadImage(file: File): Promise<string | null> {
  try {
    const compressed = await compressImage(file);
    const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };
    const fileName = `${crypto.randomUUID()}.${extensions[compressed.type]}`;
    const { error } = await supabase.storage.from('bs-images').upload(fileName, compressed, { contentType: compressed.type });
    if (error) throw error;
    const { data } = supabase.storage.from('bs-images').getPublicUrl(fileName);
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    const message = error instanceof Error ? error.message : 'Image upload failed. Check your storage permissions and quota, then try again.';
    window.dispatchEvent(new CustomEvent('bs-upload-error', { detail: message }));
    return null;
  }
}

export const api = {
  events: {
    async list() {
      const { data, error } = await supabase.from('bs_events').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(event: any) {
      const { data, error } = await supabase.from('bs_events').insert([event]).select().single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: any) {
      const { data, error } = await supabase.from('bs_events').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_events').delete().eq('id', id);
      if (error) throw error;
    }
  },
  gallery: {
    async list() {
      const { data, error } = await supabase.from('bs_gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(item: any) {
      const { data, error } = await supabase.from('bs_gallery').insert([item]).select().single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: any) {
      const { data, error } = await supabase.from('bs_gallery').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_gallery').delete().eq('id', id);
      if (error) throw error;
    }
  },
  galleryImages: {
    async list(collectionId: string) {
      const { data, error } = await supabase.from('bs_gallery_images').select('*').eq('collection_id', collectionId).order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    async create(collectionId: string, imageUrl: string) {
      const { data, error } = await supabase.from('bs_gallery_images').insert([{ collection_id: collectionId, image_url: imageUrl }]).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_gallery_images').delete().eq('id', id);
      if (error) throw error;
    }
  },
  stories: {
    async list() {
      const { data, error } = await supabase.from('bs_stories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(item: any) {
      const { data, error } = await supabase.from('bs_stories').insert([item]).select().single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: any) {
      const { data, error } = await supabase.from('bs_stories').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_stories').delete().eq('id', id);
      if (error) throw error;
    }
  },
  partners: {
    async list() {
      const { data, error } = await supabase.from('bs_partners').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(item: any) {
      const { data, error } = await supabase.from('bs_partners').insert([item]).select().single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: any) {
      const { data, error } = await supabase.from('bs_partners').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_partners').delete().eq('id', id);
      if (error) throw error;
    }
  },
  people: {
    async list() {
      const { data, error } = await supabase.from('bs_people').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(item: any) {
      const { data, error } = await supabase.from('bs_people').insert([item]).select().single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: any) {
      const { data, error } = await supabase.from('bs_people').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_people').delete().eq('id', id);
      if (error) throw error;
    }
  },
  projects: {
    async list() {
      const { data, error } = await supabase.from('bs_projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    async create(item: any) {
      const { data, error } = await supabase.from('bs_projects').insert([item]).select().single();
      if (error) throw error;
      return data;
    },
    async update(id: string, updates: any) {
      const { data, error } = await supabase.from('bs_projects').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    async delete(id: string) {
      const { error } = await supabase.from('bs_projects').delete().eq('id', id);
      if (error) throw error;
    }
  },
  settings: {
    async get() {
      const { data, error } = await supabase.from('bs_settings').select('data').eq('id', 'global').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data?.data || null;
    },
    async update(settingsData: any) {
      const { data, error } = await supabase.from('bs_settings')
        .upsert({ id: 'global', data: settingsData })
        .select().single();
      if (error) throw error;
      return data?.data || settingsData;
    }
  }
};
