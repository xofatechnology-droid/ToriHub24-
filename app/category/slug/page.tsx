import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getTrendingPosts, getCategories, getSiteSettings } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { category } = await getPostsByCategory(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description || `Latest ${category.name} coverage.`,
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { posts, category } = await getPostsByCategory(params.slug);
  if (!category) notFound();

  const [trending, categories, settings] = await Promise.all([
    getTrendingPosts(5),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: category.name }]} />
          <h1 className="font-display font-bold text-3xl sm:text-4xl">{category.name}</h1>
          {category.description && <p className="text-ink/70 mt-2 max-w-2xl">{category.description}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 mt-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {posts.length === 0 && (
            <p className="text-ink/50 mt-10">No stories published in this section yet.</p>
          )}
        </div>

        <Sidebar trending={trending} categories={categories} settings={settings} />
      </div>
    </div>
  );
}
