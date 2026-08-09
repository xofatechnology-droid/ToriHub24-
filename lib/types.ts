export type PostStatus = 'draft' | 'published';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'editor';
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  youtube_url: string | null;
  audio_url: string | null;
  category_id: string | null;
  author_id: string | null;
  status: PostStatus;
  is_featured: boolean;
  is_breaking: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image: string | null;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // joined relations (optional, populated by select queries)
  category?: Category | null;
  author?: Profile | null;
  tags?: Tag[];
}

export interface SiteSettings {
  id: number;
  site_name: string;
  tagline: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  adsense_client_id: string | null;
  adsense_header_slot: string | null;
  adsense_sidebar_slot: string | null;
  adsense_in_article_slot: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  footer_text: string | null;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// Minimal Database generic so the Supabase client stays typed without
// generating full codegen types. Extend with `supabase gen types` later if desired.
export type Database = any;
