import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { PlayCircle, Volume2 } from 'lucide-react';

export default function PostCard({
  post,
  variant = 'default',
}: {
  post: Post;
  variant?: 'default' | 'horizontal' | 'compact';
}) {
  const hasMedia = Boolean(post.youtube_url || post.audio_url);

  if (variant === 'compact') {
    return (
      <Link href={`/post/${post.slug}`} className="flex gap-3 group items-start">
        <div className="relative w-20 h-16 flex-shrink-0 bg-paperdim overflow-hidden">
          {post.cover_image_url && (
            <Image src={post.cover_image_url} alt={post.title} fill sizes="80px" className="object-cover" />
          )}
        </div>
        <div>
          <h4 className="font-display font-semibold leading-snug group-hover:text-wire transition-colors">
            {post.title}
          </h4>
          <p className="font-mono text-[11px] text-ink/50 mt-1">{formatDate(post.published_at)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/post/${post.slug}`} className="flex gap-5 group border-b border-rule pb-6">
        <div className="relative w-40 sm:w-56 aspect-[4/3] flex-shrink-0 bg-paperdim overflow-hidden">
          {post.cover_image_url && (
            <Image src={post.cover_image_url} alt={post.title} fill sizes="224px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          )}
          {hasMedia && (
            <span className="absolute bottom-2 left-2 bg-ink/80 text-paper p-1">
              {post.youtube_url ? <PlayCircle size={16} /> : <Volume2 size={16} />}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          {post.category && <span className="eyebrow mb-1">{post.category.name}</span>}
          <h3 className="font-display font-bold text-lg sm:text-xl leading-snug group-hover:text-wire transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-ink/70 mt-2 line-clamp-2 hidden sm:block">{post.excerpt}</p>
          )}
          <p className="font-mono text-[11px] text-ink/50 mt-auto pt-2">{formatDate(post.published_at)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/post/${post.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] bg-paperdim overflow-hidden mb-3">
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {hasMedia && (
          <span className="absolute bottom-2 left-2 bg-ink/80 text-paper p-1">
            {post.youtube_url ? <PlayCircle size={16} /> : <Volume2 size={16} />}
          </span>
        )}
      </div>
      {post.category && <span className="eyebrow mb-1">{post.category.name}</span>}
      <h3 className="font-display font-bold text-lg leading-snug group-hover:text-wire transition-colors">
        {post.title}
      </h3>
      <p className="font-mono text-[11px] text-ink/50 mt-2">{formatDate(post.published_at)}</p>
    </Link>
  );
}
