import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL_CONST } from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published');

  const { data: categories } = await supabase.from('categories').select('slug');

  const postUrls: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${SITE_URL_CONST}/post/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${SITE_URL_CONST}/category/${c.slug}`,
    changeFrequency: 'daily',
    priority: 0.6,
  }));

  return [
    { url: SITE_URL_CONST, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL_CONST}/search`, changeFrequency: 'weekly', priority: 0.3 },
    ...categoryUrls,
    ...postUrls,
  ];
}
