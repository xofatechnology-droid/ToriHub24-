import { searchPosts, getTrendingPosts, getCategories, getSiteSettings } from '@/lib/queries';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import SearchBar from '@/components/SearchBar';

export const metadata = { title: 'Search' };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() || '';
  const [results, trending, categories, settings] = await Promise.all([
    q ? searchPosts(q) : Promise.resolve([]),
    getTrendingPosts(5),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <h1 className="font-display font-bold text-3xl mb-6">Search</h1>
          <SearchBar initialQuery={q} />

          {q && (
            <p className="text-sm text-ink/50 mt-6 mb-4 font-mono">
              {results.length} result{results.length !== 1 ? 's' : ''} for "{q}"
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 mt-4">
            {results.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <Sidebar trending={trending} categories={categories} settings={settings} />
      </div>
    </div>
  );
}
