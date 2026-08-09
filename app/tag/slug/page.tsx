import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTrendingPosts, getCategories, getSiteSettings } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 60;

async function getPostsByTag(slug: string) {
  const supabase = createClient();
  const { data: tag } = await supabase.from('tags').select('*').eq('slug', slug).single();
  if (!tag) return { tag: null, posts: [] as any[] };
  const { data } = await supabase
    .from('post_tags')
    .select('post:posts(*, category:categories(*), author:profiles(*))')
    .eq('tag_id', tag.id);
  const posts = (data ?? [])
    .map((row: any) => row.post)
    .filter((p: any) => p && p.status === 'published')
    .sort((a: any, b: any) => (b.published_at || '').localeCompare(a.published_at || ''));
  return { tag, posts };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const { tag, posts } = await getPostsByTag(params.slug);
  if (!tag) notFound();

  const [trending, categories, settings] = await Promise.all([
    getTrendingPosts(5),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: `#${tag.name}` }]} />
          <h1 className="font-display font-bold text-3xl">#{tag.name}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 mt-8">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {posts.length === 0 && <p className="text-ink/50 mt-10">No stories tagged yet.</p>}
        </div>
        <Sidebar trending={trending} categories={categories} settings={settings} />
      </div>
    </div>
  );
}
