import type { Metadata } from 'next';
import type { Post, SiteSettings } from '@/lib/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export function buildPostMetadata(post: Post, settings: SiteSettings): Metadata {
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt || '';
  const image = post.og_image || post.cover_image_url || undefined;
  const url = `${SITE_URL}/post/${post.slug}`;

  return {
    title: `${title} | ${settings.site_name}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: settings.site_name,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export function articleJsonLd(post: Post, settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.og_image || post.cover_image_url ? [post.og_image || post.cover_image_url] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: [{ '@type': 'Person', name: post.author?.full_name || settings.site_name }],
    publisher: {
      '@type': 'Organization',
      name: settings.site_name,
      logo: settings.logo_url ? { '@type': 'ImageObject', url: settings.logo_url } : undefined,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/post/${post.slug}` },
  };
}

export const SITE_URL_CONST = SITE_URL;
