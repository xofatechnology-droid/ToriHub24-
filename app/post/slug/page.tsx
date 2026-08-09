import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug, getRelatedPosts, getTrendingPosts, getCategories, getSiteSettings, incrementViews } from '@/lib/queries';
import { buildPostMetadata, articleJsonLd, SITE_URL_CONST } from '@/lib/seo';
import { formatDate, readingTime } from '@/lib/utils';
import ArticleBody from '@/components/ArticleBody';
import ShareButtons from '@/components/ShareButtons';
import Breadcrumbs from '@/components/Breadcrumbs';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import AdSlot from '@/components/AdSlot';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import AudioPlayer from '@/components/AudioPlayer';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  const settings = await getSiteSettings();
  return buildPostMetadata(post, settings);
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== 'published') notFound();

  incrementViews(post.id).catch(() => {});

  const [related, trending, categories, settings] = await Promise.all([
    getRelatedPosts(post, 4),
    getTrendingPosts(5),
    getCategories(),
    getSiteSettings(),
  ]);

  const jsonLd = articleJsonLd(post, settings);
  const url = `${SITE_URL_CONST}/post/${post.slug}`;

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <article>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              ...(post.category ? [{ label: post.category.name, href: `/category/${post.category.slug}` }] : []),
              { label: post.title },
            ]}
          />

          {post.is_breaking && (
            <span className="inline-block eyebrow bg-wire text-paper px-2 py-1 mb-3">Breaking</span>
          )}

          <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight">{post.title}</h1>

          {post.excerpt && (
            <p className="font-display text-lg sm:text-xl text-ink/70 mt-4 italic">{post.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 mt-6 py-4 border-y border-rule">
            <div className="text-sm">
              <span className="font-semibold">{post.author?.full_name || settings.site_name}</span>
              <span className="text-ink/50 font-mono text-xs ml-3">
                {formatDate(post.published_at)} · {readingTime(post.content)} min read
              </span>
            </div>
            <ShareButtons url={url} title={post.title} />
          </div>

          {post.cover_image_url && (
            <div className="relative w-full aspect-video my-6 bg-paperdim">
              <Image src={post.cover_image_url} alt={post.title} fill sizes="800px" className="object-cover" priority />
            </div>
          )}

          {post.youtube_url && <YouTubeEmbed url={post.youtube_url} title={post.title} />}
          {post.audio_url && <AudioPlayer url={post.audio_url} title="Listen to this story" />}

          <ArticleBody content={post.content} />

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag) => (
                <a
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="text-xs font-mono border border-rule px-2 py-1 hover:border-wire hover:text-wire transition-colors"
                >
                  #{tag.name}
                </a>
              ))}
            </div>
          )}

          {settings.adsense_in_article_slot && (
            <div className="my-10">
              <AdSlot slot={settings.adsense_in_article_slot} clientId={settings.adsense_client_id} format="horizontal" />
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display font-bold text-xl border-b-2 border-ink pb-2 mb-6">
                Related Stories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                {related.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </article>

        <Sidebar trending={trending} categories={categories} settings={settings} />
      </div>
    </div>
  );
}
