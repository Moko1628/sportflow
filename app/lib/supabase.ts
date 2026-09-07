import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-') &&
    !supabaseAnonKey.includes('your-')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Article {
  id: string;
  titre: string;
  resume: string;
  contenu: string;
  source_url: string;
  source_nom: string;
  categorie: string;
  image_url: string | null;
  created_at: string;
  origine?: string;
}
