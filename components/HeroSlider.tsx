'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function HeroSlider({ posts }: { posts: Post[] }) {
  const [index, setIndex] = useState(0);
  const count = posts.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(next, 6500);
    return () => clearInterval(id);
  }, [next, count]);

  if (count === 0) return null;
  const active = posts[index];

  return (
    <section aria-label="Featured stories" className="relative border-b border-rule">
      <div className="relative h-[62vh] min-h-[420px] max-h-[640px] w-full overflow-hidden bg-ink">
        {posts.map((post, i) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {post.cover_image_url ? (
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ink to-moss" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          </div>
        ))}

        <div className="absolute bottom-0 left-0 right-0 max-w-content mx-auto w-full px-4 sm:px-6 pb-8 sm:pb-12">
          {active.category && (
            <span className="inline-block eyebrow bg-wire text-paper px-2 py-1 mb-3">
              {active.category.name}
            </span>
          )}
          <Link href={`/post/${active.slug}`} className="group">
            <h2 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl text-paper leading-tight max-w-3xl group-hover:underline decoration-wire">
              {active.title}
            </h2>
          </Link>
          {active.excerpt && (
            <p className="text-paper/80 mt-3 max-w-xl hidden sm:block">{active.excerpt}</p>
          )}
          <p className="font-mono text-xs text-paper/60 mt-3 tracking-wide">
            {formatDate(active.published_at)}
          </p>
        </div>

        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous story"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-paper/10 hover:bg-paper/20 text-paper p-2 backdrop-blur-sm transition-colors"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              aria-label="Next story"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-paper/10 hover:bg-paper/20 text-paper p-2 backdrop-blur-sm transition-colors"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute top-4 right-4 flex gap-1.5">
              {posts.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to story ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 transition-all ${
                    i === index ? 'w-6 bg-wire' : 'w-1.5 bg-paper/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
