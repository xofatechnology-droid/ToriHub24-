import { createClient } from '@/lib/supabase/server';
import type { Post, Category, SiteSettings } from '@/lib/types';

const POST_SELECT = `
  *,
  category:categories(*),
  author:profiles(*),
  tags:post_tags(tag:tags(*))
`;

function flattenTags(post: any): Post {
  return { ...post, tags: (post.tags ?? []).map((t: any) => t.tag) };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
  return (
    data ?? {
      id: 1,
      site_name: 'The Wire Desk',
      tagline: 'Reporting, without the noise.',
      logo_url: null,
      favicon_url: null,
      adsense_client_id: null,
      adsense_header_slot: null,
      adsense_sidebar_slot: null,
      adsense_in_article_slot: null,
      social_twitter: null,
      social_facebook: null,
      social_instagram: null,
      social_youtube: null,
      footer_text: 'All rights reserved.',
    }
  );
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase.from('categories').select('*').order('name');
  return data ?? [];
}

export async function getFeaturedPosts(limit = 5): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(flattenTags);
}

export async function getLatestPosts(limit = 12, offset = 0): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return (data ?? []).map(flattenTags);
}

export async function getTrendingPosts(limit = 5): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(limit);
  return (data ?? []).map(flattenTags);
}

export async function getBreakingPosts(limit = 6): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(flattenTags);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('slug', slug)
    .single();
  return data ? flattenTags(data) : null;
}

export async function getPostsByCategory(slug: string, limit = 12, offset = 0): Promise<{ posts: Post[]; category: Category | null }> {
  const supabase = createClient();
  const { data: category } = await supabase.from('categories').select('*').eq('slug', slug).single();
  if (!category) return { posts: [], category: null };
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
  return { posts: (data ?? []).map(flattenTags), category };
}

export async function getRelatedPosts(post: Post, limit = 4): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .eq('category_id', post.category_id)
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data ?? []).map(flattenTags);
}

export async function searchPosts(query: string): Promise<Post[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(30);
  return (data ?? []).map(flattenTags);
}

export async function incrementViews(postId: string) {
  const supabase = createClient();
  await supabase.rpc('increment_post_views', { post_id: postId });
}
