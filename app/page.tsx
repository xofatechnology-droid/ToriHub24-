import HeroSlider from '@/components/HeroSlider';
import DevelopingTicker from '@/components/DevelopingTicker';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import AdSlot from '@/components/AdSlot';
import {
  getFeaturedPosts,
  getLatestPosts,
  getTrendingPosts,
  getBreakingPosts,
  getCategories,
  getSiteSettings,
} from '@/lib/queries';

export const revalidate = 60;

export default async function HomePage() {
  const [featured, latest, trending, breaking, categories, settings] = await Promise.all([
    getFeaturedPosts(5),
    getLatestPosts(13),
    getTrendingPosts(5),
    getBreakingPosts(6),
    getCategories(),
    getSiteSettings(),
  ]);

  const [lead, ...rest] = latest;

  return (
    <>
      <HeroSlider posts={featured.length ? featured : latest.slice(0, 5)} />
      <DevelopingTicker posts={breaking} />

      <div className="max-w-content mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          {lead && (
            <div className="mb-10 pb-10 border-b border-rule">
              <PostCard post={lead} variant="horizontal" />
            </div>
          )}

          <h2 className="font-display font-bold text-xl border-b-2 border-ink pb-2 mb-6">
            Latest Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {settings.adsense_in_article_slot && (
            <div className="mt-10">
              <AdSlot slot={settings.adsense_in_article_slot} clientId={settings.adsense_client_id} format="horizontal" />
            </div>
          )}
        </div>

        <Sidebar trending={trending} categories={categories} settings={settings} />
      </div>
    </>
  );
}
