import Link from 'next/link';
import type { Post } from '@/lib/types';

export default function DevelopingTicker({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  const doubled = [...posts, ...posts];

  return (
    <div className="bg-wire text-paper overflow-hidden border-b border-wiredark">
      <div className="max-w-content mx-auto flex items-stretch">
        <span className="eyebrow bg-wiredark text-paper px-3 py-2 flex-shrink-0 flex items-center">
          Developing
        </span>
        <div className="overflow-hidden flex-1 py-2">
          <div className="ticker-track flex gap-10 whitespace-nowrap w-max">
            {doubled.map((post, i) => (
              <Link
                key={`${post.id}-${i}`}
                href={`/post/${post.slug}`}
                className="text-sm font-medium hover:underline"
              >
                {post.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
