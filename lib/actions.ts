'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { toSlug, excerptFromMarkdown } from '@/lib/utils';

// ---------- AUTH ----------

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect('/admin');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// ---------- POSTS ----------

export interface PostFormInput {
  id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  youtube_url?: string;
  audio_url?: string;
  category_id?: string;
  status: 'draft' | 'published';
  is_featured?: boolean;
  is_breaking?: boolean;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  tag_names?: string[];
}

export async function savePost(input: PostFormInput) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const slug = input.slug?.trim() ? toSlug(input.slug) : toSlug(input.title);
  const excerpt = input.excerpt?.trim() || excerptFromMarkdown(input.content);

  const payload: any = {
    title: input.title,
    slug,
    excerpt,
    content: input.content,
    cover_image_url: input.cover_image_url || null,
    youtube_url: input.youtube_url || null,
    audio_url: input.audio_url || null,
    category_id: input.category_id || null,
    status: input.status,
    is_featured: !!input.is_featured,
    is_breaking: !!input.is_breaking,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
    og_image: input.og_image || null,
    author_id: user.id,
  };
  if (input.status === 'published') {
    payload.published_at = new Date().toISOString();
  }

  let postId = input.id;
  if (postId) {
    const { error } = await supabase.from('posts').update(payload).eq('id', postId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
    if (error) return { error: error.message };
    postId = data.id;
  }

  // sync tags
  if (postId && input.tag_names) {
    await syncTags(postId, input.tag_names);
  }

  revalidatePath('/');
  revalidatePath(`/post/${slug}`);
  revalidatePath('/admin/posts');
  return { success: true, id: postId, slug };
}

async function syncTags(postId: string, tagNames: string[]) {
  const supabase = createClient();
  const clean = tagNames.map((t) => t.trim()).filter(Boolean);

  const tagIds: string[] = [];
  for (const name of clean) {
    const slug = toSlug(name);
    const { data: existing } = await supabase.from('tags').select('id').eq('slug', slug).single();
    if (existing) {
      tagIds.push(existing.id);
    } else {
      const { data: created } = await supabase.from('tags').insert({ name, slug }).select('id').single();
      if (created) tagIds.push(created.id);
    }
  }

  await supabase.from('post_tags').delete().eq('post_id', postId);
  if (tagIds.length) {
    await supabase.from('post_tags').insert(tagIds.map((tag_id) => ({ post_id: postId, tag_id })));
  }
}

export async function deletePost(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  revalidatePath('/admin/posts');
  revalidatePath('/');
  return { error: error?.message };
}

// ---------- CATEGORIES ----------

export async function saveCategory(input: { id?: string; name: string; description?: string }) {
  const supabase = createClient();
  const slug = toSlug(input.name);
  if (input.id) {
    const { error } = await supabase
      .from('categories')
      .update({ name: input.name, slug, description: input.description || null })
      .eq('id', input.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from('categories')
      .insert({ name: input.name, slug, description: input.description || null });
    if (error) return { error: error.message };
  }
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  revalidatePath('/admin/categories');
  return { error: error?.message };
}

// ---------- SITE SETTINGS ----------

export async function saveSiteSettings(input: Record<string, any>) {
  const supabase = createClient();
  const { error } = await supabase.from('site_settings').update(input).eq('id', 1);
  if (error) return { error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}

// ---------- MEDIA ----------

export async function recordMedia(input: { url: string; filename: string; file_type: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { error } = await supabase.from('media').insert({ ...input, uploaded_by: user?.id });
  revalidatePath('/admin/media');
  return { error: error?.message };
}

export async function deleteMedia(id: string, url: string) {
  const supabase = createClient();
  // Extract storage path from public URL (…/storage/v1/object/public/media/<path>)
  const marker = '/media/';
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const path = url.slice(idx + marker.length);
    await supabase.storage.from('media').remove([path]);
  }
  const { error } = await supabase.from('media').delete().eq('id', id);
  revalidatePath('/admin/media');
  return { error: error?.message };
}
